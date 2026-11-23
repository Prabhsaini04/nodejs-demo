# nodejs-demo

A small Task Tracker app (Express API + a static HTML/CSS/JS UI) — the
application code for the `nodejs-demo` reference deployment exercise.

This repo holds the **application code**, its own `Dockerfile` and
`Jenkinsfile`, and a `docker-compose.yml` for local container runs. The
deployment architecture, blue-green cutover script, Nginx config and ADRs
live in the separate governance repo, project `07-Projects/nodejs-demo/`.

## Run locally

```bash
npm install
npm start          # starts on http://localhost:3000
```

Open http://localhost:3000 for the Task Tracker UI.

## Run with Docker

```bash
docker compose up --build
```

or directly:

```bash
docker build -t nodejs-demo .
docker run -p 3000:3000 nodejs-demo
```

## Scripts

- `npm start` — run the server
- `npm run lint` — ESLint
- `npm test` — unit tests (Node's built-in test runner + supertest)

## Endpoints

- `GET /` — Task Tracker UI (static files served from `src/public/`)
- `GET /health` — liveness check, returns `{"status":"ok"}` with HTTP 200;
  required by the deployment design's Docker `HEALTHCHECK` and blue-green
  cutover script — do not remove or rename.
- `GET /api/tasks` — list tasks
- `POST /api/tasks` — create a task (`{ "title": string }`)
- `PATCH /api/tasks/:id` — update a task (`{ "done"?: boolean, "title"?: string }`)
- `DELETE /api/tasks/:id` — remove a task

Task storage is in-memory and resets on restart — it's a demo app, not a
persistence layer.

## CI/CD

The `Jenkinsfile` runs install → lint → test → Docker build, and pushes the
image on `main`/`dev` builds if `DOCKER_REGISTRY_CREDENTIALS` is configured
in Jenkins. It does not deploy — deployment is handled by the separate
scripts in the governance repo.

## Status

Local only — not yet pushed to a remote. No deployment has occurred.
