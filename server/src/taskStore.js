const { randomUUID } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

async function ensureFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]', 'utf8');
  }
}

async function readTasks(filePath) {
  await ensureFile(filePath);
  const fileContent = await fs.readFile(filePath, 'utf8');

  if (!fileContent.trim()) {
    return [];
  }

  return JSON.parse(fileContent);
}

async function writeTasks(filePath, tasks) {
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf8');
}

function createTaskStore(filePath) {
  return {
    async getAll() {
      return readTasks(filePath);
    },

    async create(title) {
      const tasks = await readTasks(filePath);
      const timestamp = new Date().toISOString();
      const task = {
        id: randomUUID(),
        title,
        completed: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      tasks.unshift(task);
      await writeTasks(filePath, tasks);

      return task;
    },

    async update(id, updates) {
      const tasks = await readTasks(filePath);
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex === -1) {
        return null;
      }

      const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      tasks[taskIndex] = updatedTask;
      await writeTasks(filePath, tasks);

      return updatedTask;
    },

    async remove(id) {
      const tasks = await readTasks(filePath);
      const nextTasks = tasks.filter((task) => task.id !== id);

      if (nextTasks.length === tasks.length) {
        return false;
      }

      await writeTasks(filePath, nextTasks);
      return true;
    },
  };
}

module.exports = {
  createTaskStore,
};
