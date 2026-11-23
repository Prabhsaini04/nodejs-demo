const express = require('express');

function createApp() {
  const app = express();

  // Required by the deployment design's Docker HEALTHCHECK and the
  // blue-green cutover script (ai-engineering-team repo:
  // 07-Projects/nodejs-demo/DEVOPS/Dockerfile,
  // DEVOPS/deploy/blue-green-deploy.sh) — must stay at this exact path and
  // return 200 while the process is ready to serve traffic.
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/', (_req, res) => {
    res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>nodejs-demo</title>
  </head>
  <body>
    <h1>nodejs-demo</h1>
    <p>A simple Node.js website.</p>
  </body>
</html>`);
  });

  return app;
}

module.exports = { createApp };
