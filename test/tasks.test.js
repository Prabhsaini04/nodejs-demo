const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');

test('GET /api/tasks returns the seeded task list', async () => {
  const app = createApp();
  const res = await request(app).get('/api/tasks');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.length > 0);
});

test('POST /api/tasks creates a task', async () => {
  const app = createApp();
  const res = await request(app).post('/api/tasks').send({ title: 'Write tests' });
  assert.equal(res.status, 201);
  assert.equal(res.body.title, 'Write tests');
  assert.equal(res.body.done, false);
  assert.ok(res.body.id);
});

test('POST /api/tasks rejects an empty title', async () => {
  const app = createApp();
  const res = await request(app).post('/api/tasks').send({ title: '   ' });
  assert.equal(res.status, 400);
});

test('PATCH /api/tasks/:id toggles done', async () => {
  const app = createApp();
  const created = await request(app).post('/api/tasks').send({ title: 'Toggle me' });
  const res = await request(app).patch(`/api/tasks/${created.body.id}`).send({ done: true });
  assert.equal(res.status, 200);
  assert.equal(res.body.done, true);
});

test('PATCH /api/tasks/:id returns 404 for unknown id', async () => {
  const app = createApp();
  const res = await request(app).patch('/api/tasks/does-not-exist').send({ done: true });
  assert.equal(res.status, 404);
});

test('DELETE /api/tasks/:id removes a task', async () => {
  const app = createApp();
  const created = await request(app).post('/api/tasks').send({ title: 'Delete me' });
  const res = await request(app).delete(`/api/tasks/${created.body.id}`);
  assert.equal(res.status, 204);

  const list = await request(app).get('/api/tasks');
  assert.ok(!list.body.some((t) => t.id === created.body.id));
});

test('DELETE /api/tasks/:id returns 404 for unknown id', async () => {
  const app = createApp();
  const res = await request(app).delete('/api/tasks/does-not-exist');
  assert.equal(res.status, 404);
});
