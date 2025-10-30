# CoinTracker Demo Frontend

A small React + TypeScript prototype that connects to the local CoinTracker mock API. It demonstrates wallet management, manual sync, and transaction viewing with Redux Toolkit Query and Emotion styling.

## Quick Start

1. Ensure Node v22 is installed (`.nvmrc` is provided).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server (assumes the mock API is running on port 3000):
   ```bash
   npm run dev
   ```
4. Visit the app at http://localhost:5173.

## Environment

Create a `.env` file (or copy `.env.example`) to override the API base URL:

```
VITE_API_URL=http://localhost:3000
```

## Architecture

- **React + Vite + TypeScript** for the UI scaffold and build tooling.
- **Redux Toolkit & RTK Query** manage state, caching, and network requests.
- **Emotion** supplies theming, global styles, and lightweight UI primitives.
- **Vitest + Testing Library** enable component-free unit tests (validation and helpers today).

`src/app/Providers.tsx` wires the store, theme, and global styles. Feature modules live under `src/features`, while shared UI lives in `src/components` and helpers in `src/lib`.

## Routing & URL persistence

- `/wallet/:walletId` keeps the selected wallet in the URL so refreshes stay in sync.
- Landing on `/` auto-selects the first wallet when one exists.
- After adding a wallet, the UI navigates to it so its transactions load immediately.

## API Endpoints

| Endpoint | Method | Purpose | Cache Tags |
| --- | --- | --- | --- |
| `/wallets` | GET | Fetch wallet collection | `Wallets:LIST`, `Wallets:{id}` |
| `/wallets` | POST | Create wallet by address (returns full list) | Invalidate `Wallets:LIST` |
| `/wallets/:walletId` | DELETE | Remove a wallet | Invalidate `Wallets:LIST`, `Transactions:{walletId}` |
| `/wallets/:walletId` | GET | Fetch wallet transactions | `Transactions:{walletId}` |
| `/wallets/:walletId/sync` | POST | Trigger manual sync | Invalidate `Wallets:LIST`, `Transactions:{walletId}` |
| `/health` | GET | Service heartbeat | none |

All requests default to `http://localhost:3000`; override with `VITE_API_URL`.

## Decisions & Tradeoffs

- **Manual sync over polling:** RTK Query tag invalidation keeps data fresh after explicit sync clicks, avoiding constant network traffic.
- **URL-driven wallet selection:** React Router owns selection, enabling deep links without expanding global state.
- **No virtualization yet:** Simplicity over performance for now; table rendering stays straightforward.
- **Optimistic UI deferred:** Mutations rely on server responses to avoid mock API drift.

## Limitations & Stretch Ideas

- Large transaction sets (e.g., 156k rows) would need virtualization or pagination.
- Missing richer wallet metadata (labels, fiat values) and address book support.
- Background sync or WebSocket updates could improve freshness.
- Additional testing layers (component/integration) intentionally deferred for brevity.

## Testing & Linting

- Run unit tests: `npm test`
- Run type-checking: `npm run typecheck`
- Run linting: `npm run lint`

Vitest runs in a jsdom environment via the Vite test config.
