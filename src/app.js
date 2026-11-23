const express = require('express');
const path = require('path');
const { createTaskStore } = require('./taskStore');

function createApp() {
  const app = express();
  const store = createTaskStore([
    { id: 'seed-1', title: 'Welcome to Task Tracker', done: false, createdAt: new Date().toISOString() },
    { id: 'seed-2', title: 'Try adding a task above', done: false, createdAt: new Date().toISOString() },
    { id: 'seed-3', title: 'Check one off when done', done: true, createdAt: new Date().toISOString() },
  ]);

  app.use(express.json());

  // Required by the deployment design's Docker HEALTHCHECK and the
  // blue-green cutover script (ai-engineering-team repo:
  // 07-Projects/nodejs-demo/DEVOPS/Dockerfile,
  // DEVOPS/deploy/blue-green-deploy.sh) — must stay at this exact path and
  // return 200 while the process is ready to serve traffic.
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/api/tasks', (_req, res) => {
    res.status(200).json(store.list());
  });

  app.post('/api/tasks', (req, res) => {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }
    const task = store.add(title);
    return res.status(201).json(task);
  });

  app.patch('/api/tasks/:id', (req, res) => {
    const changes = {};
    if (typeof req.body?.done === 'boolean') changes.done = req.body.done;
    if (typeof req.body?.title === 'string' && req.body.title.trim()) changes.title = req.body.title.trim();

    const task = store.update(req.params.id, changes);
    if (!task) {
      return res.status(404).json({ error: 'task not found' });
    }
    return res.status(200).json(task);
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const removed = store.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'task not found' });
    }
    return res.status(204).send();
  });

  app.use(express.static(path.join(__dirname, 'public')));

  return app;
}

module.exports = { createApp };
