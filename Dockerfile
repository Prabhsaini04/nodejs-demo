# Production Dockerfile — nodejs-demo
#
# Adapted from the reference design in the ai-engineering-team repo
# (07-Projects/nodejs-demo/DEVOPS/Dockerfile) for this app's real shape:
# plain JavaScript, no build/bundle step, entrypoint src/server.js.
# Multi-stage build, minimal pinned base image, non-root runtime user,
# no secrets baked in, HEALTHCHECK, explicit minimal exposed port.

# ---- Build stage ----
FROM node:20.11.1-alpine3.19 AS build
WORKDIR /app

# Copy dependency manifests before source so Docker's layer cache is
# reused whenever only app source changes, not dependencies.
COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .

# No build step: this app is plain, unbundled JS — nothing to compile.
RUN npm prune --omit=dev

# ---- Runtime stage ----
FROM node:20.11.1-alpine3.19 AS runtime
WORKDIR /app
ENV NODE_ENV=production

# App listens only on this internal port; Nginx on the Ubuntu host
# terminates TLS and reverse-proxies to it (never exposed directly).
EXPOSE 3000

# Use the `node` user already built into the official image.
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/src ./src

USER node

# Liveness/readiness probe read by docker-compose healthcheck and the
# blue-green cutover script before routing traffic to this container.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "src/server.js"]
