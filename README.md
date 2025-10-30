# CoinTracker Demo

Guidance for running the React frontend (`cointracker-app`) alongside the Express mock API (`cointracker-mock-api`).

## Prerequisites

- Node.js **22.x** (the repositories specify this via `engines`)
- npm 10+ (bundled with Node 22)

## Quick Start (single terminal)

From the repository root you can now run everything with a single command:

```bash
npm start
```

That script installs dependencies for both projects (if needed) and keeps the mock API and frontend dev servers running together.

## Install Dependencies Manually

If you prefer the explicit installs, run these once per project (any directory works):

```bash
npm install --prefix cointracker-app
npm install --prefix cointracker-mock-api
```

## Mock API

- Start (auto-reload): `npm run dev --prefix cointracker-mock-api`
- Start (single run): `npm start --prefix cointracker-mock-api`
- Default port: `3000`
- Optional reload of seed data: `npm run reset-db --prefix cointracker-mock-api`

When running locally you can confirm the service with `curl http://localhost:3000/health`.

## Frontend App

- Start Vite dev server: `npm run dev --prefix cointracker-app`
- Default port: `5173`
- Open the app: `http://localhost:5173`
- API base URL: `VITE_API_URL` (defaults to `http://localhost:3000`)

To target a mock API on another host/port, either export an environment variable before starting Vite:

```bash
VITE_API_URL=http://localhost:4000 npm run dev --prefix cointracker-app
```

…or create `cointracker-app/.env` with `VITE_API_URL=http://localhost:4000`.

## Typical Workflow

1. Run `npm start` (root) to install dependencies and launch both dev servers.
2. Navigate to `http://localhost:5173` and verify that the health check succeeds (look for the API status indicator in the UI).
3. When you're done, press `Ctrl+C` once to stop both processes.

If you would rather keep separate terminals, you can still start each project individually using the commands in the sections above.
