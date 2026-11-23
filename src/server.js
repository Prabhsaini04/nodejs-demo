const { createApp } = require('./app');

const PORT = process.env.PORT || 3000;
// Bind to all interfaces inside the container — the host-level publish
// (docker-compose.staging.yml / blue-green-deploy.sh) is what restricts
// this to 127.0.0.1 on the Ubuntu host, per
// ai-engineering-team repo 07-Projects/nodejs-demo/DEVOPS/02-DEPLOYMENT_ARCHITECTURE.md.
const HOST = process.env.HOST || '0.0.0.0';

const app = createApp();

app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`nodejs-demo listening on http://${HOST}:${PORT}`);
});
