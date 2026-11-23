# nodejs-demo

A simple Node.js (Express) website — the application code for the
`nodejs-demo` reference deployment exercise.

This repo holds only the **application code**. The deployment design,
decisions, and standards (Jenkinsfile, deployment Dockerfile reference,
Nginx config, ADRs) live in the separate governance repo, project
`07-Projects/nodejs-demo/`.

## Run locally

```bash
npm install
npm start          # starts on http://localhost:3000
```

## Scripts

- `npm start` — run the server
- `npm run lint` — ESLint
- `npm test` — unit tests (Node's built-in test runner + supertest)

## Endpoints

- `GET /` — simple HTML homepage
- `GET /health` — liveness check, returns `{"status":"ok"}` with HTTP 200;
  required by the deployment design's Docker `HEALTHCHECK` and blue-green
  cutover script — do not remove or rename.

## Status

Local only — not yet pushed to a remote. No deployment has occurred.
