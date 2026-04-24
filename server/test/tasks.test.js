const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const request = require('supertest');
const { createApp } = require('../src/app');

async function createTestContext() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'task-manager-api-'));
  const storePath = path.join(directory, 'tasks.json');
  const app = createApp({ storePath });

  return {
    app,
    async cleanup() {
      await fs.rm(directory, { recursive: true, force: true });
    },
  };
}

test('creates, lists, updates, and deletes tasks', async () => {
  const context = await createTestContext();

  try {
    const createResponse = await request(context.app)
      .post('/api/tasks')
      .send({ title: 'Write assignment README' })
      .expect(201);

    assert.equal(createResponse.body.title, 'Write assignment README');
    assert.equal(createResponse.body.completed, false);

    const listResponse = await request(context.app).get('/api/tasks').expect(200);

    assert.equal(listResponse.body.length, 1);
    assert.equal(listResponse.body[0].id, createResponse.body.id);

    const patchResponse = await request(context.app)
      .patch(`/api/tasks/${createResponse.body.id}`)
      .send({ completed: true })
      .expect(200);

    assert.equal(patchResponse.body.completed, true);

    await request(context.app).delete(`/api/tasks/${createResponse.body.id}`).expect(204);

    const finalListResponse = await request(context.app).get('/api/tasks').expect(200);
    assert.deepEqual(finalListResponse.body, []);
  } finally {
    await context.cleanup();
  }
});

test('rejects invalid task creation payloads', async () => {
  const context = await createTestContext();

  try {
    const response = await request(context.app).post('/api/tasks').send({ title: '   ' }).expect(400);

    assert.equal(response.body.message, 'Task title is required.');
  } finally {
    await context.cleanup();
  }
});

test('persists tasks to disk between app instances', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'task-manager-api-'));
  const storePath = path.join(directory, 'tasks.json');

  try {
    const firstApp = createApp({ storePath });

    await request(firstApp).post('/api/tasks').send({ title: 'Persist me' }).expect(201);

    const secondApp = createApp({ storePath });
    const response = await request(secondApp).get('/api/tasks').expect(200);

    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].title, 'Persist me');
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
