const cors = require('cors');
const express = require('express');
const path = require('node:path');
const { createTaskStore } = require('./taskStore');

const defaultStorePath = path.join(__dirname, '..', 'data', 'tasks.json');

function normalizeTitle(title) {
  return typeof title === 'string' ? title.trim() : '';
}

function createApp({ storePath = defaultStorePath } = {}) {
  const app = express();
  const taskStore = createTaskStore(storePath);

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true });
  });

  app.get('/api/tasks', async (_request, response, next) => {
    try {
      const tasks = await taskStore.getAll();
      response.json(tasks);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/tasks', async (request, response, next) => {
    const title = normalizeTitle(request.body?.title);

    if (!title) {
      return response.status(400).json({ message: 'Task title is required.' });
    }

    try {
      const task = await taskStore.create(title);
      return response.status(201).json(task);
    } catch (error) {
      return next(error);
    }
  });

  app.patch('/api/tasks/:taskId', async (request, response, next) => {
    const { completed } = request.body ?? {};

    if (typeof completed !== 'boolean') {
      return response.status(400).json({ message: 'Task completion state must be a boolean.' });
    }

    try {
      const updatedTask = await taskStore.update(request.params.taskId, { completed });

      if (!updatedTask) {
        return response.status(404).json({ message: 'Task not found.' });
      }

      return response.json(updatedTask);
    } catch (error) {
      return next(error);
    }
  });

  app.delete('/api/tasks/:taskId', async (request, response, next) => {
    try {
      const removed = await taskStore.remove(request.params.taskId);

      if (!removed) {
        return response.status(404).json({ message: 'Task not found.' });
      }

      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({ message: 'Unexpected server error.' });
  });

  return app;
}

module.exports = {
  createApp,
  defaultStorePath,
};
