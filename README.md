# TradeEstate — Virtual NSE Intraday Trading Platform

A full-stack paper-trading app styled like a "real estate" marketplace: 500+ real
NSE-listed companies are presented as ownable "properties." Prices stream live
(via Upstox, with a realistic simulation fallback when Upstox isn't connected
yet), every new account gets virtual cash automatically, and a global
leaderboard ranks every user who has ever signed up — live.

## What's included

- **backend/** — Node.js + Express + MongoDB + Socket.io
  - JWT auth (signup grants ₹10,00,000 virtual cash by default — configurable)
  - Upstox API integration for real NSE quotes (OAuth flow + live quote polling)
  - Simulation fallback so the app is fully live/demo-able with zero external keys
  - Buy/sell engine with MongoDB transactions (atomic wallet + holdings updates)
  - Global leaderboard computed live from every user's current net worth
  - Seed script that builds a 500+ stock universe across all NSE sectors
- **frontend/** — React + Tailwind + Framer Motion + Recharts + Socket.io client
  - Animated "property card" grid for browsing/searching/sorting stocks
  - Scrolling live ticker tape, price flash animations on every tick
  - Buy/Sell modal, Portfolio page with live valuation + allocation pie chart
  - Animated, auto-refreshing global leaderboard

## 1. Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (or a MongoDB Atlas connection string)
- (Optional, for real live NSE prices) An Upstox developer account:
  https://developer.upstox.com — create an app to get an API key + secret

> The app works immediately **without** Upstox: it auto-seeds 500+ real stock
> symbols and runs a realistic price simulation. Connect Upstox whenever
> you're ready for actual live NSE prices — no code changes needed, just env vars.

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, and (optionally) Upstox credentials
npm install
npm run seed      # populates 500+ stocks into MongoDB
npm run dev        # starts the API + Socket.io server on http://localhost:5000
```

### Connecting real Upstox live data (optional but recommended)

1. Register an app at https://developer.upstox.com and note your `API key`,
   `API secret`, and set the **Redirect URI** to
   `http://localhost:5000/api/upstox/callback`.
2. Put those values into `backend/.env` (`UPSTOX_API_KEY`, `UPSTOX_API_SECRET`,
   `UPSTOX_REDIRECT_URI`).
3. With the backend running, open `http://localhost:5000/api/upstox/login`
   in your browser and log in with your Upstox trading account credentials.
4. You'll be redirected back with an access token displayed on screen — copy
   it into `.env` as `UPSTOX_ACCESS_TOKEN`, then restart the backend
   (`npm run dev`).
5. Re-run `npm run seed` once more — it will now resolve every symbol's real
   Upstox `instrument_key` from the live NSE instrument master, and the price
   engine will switch from simulation to real live NSE quotes automatically.

   Note: Upstox access tokens expire daily — you'll need to repeat steps 3-4
   each trading day, or wire in Upstox's refresh-token flow for production use.

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm start    # opens http://localhost:3000
```

## 4. Using the app

1. Go to `http://localhost:3000`, click **Create an account** — you're
   instantly credited with virtual cash (default ₹10,00,000, configurable via
   `SIGNUP_VIRTUAL_CASH` in backend `.env`).
2. Browse **Properties** (the Market page) — search, filter by sector, sort by
   gainers. Click any card to **Buy/Sell**.
3. Check **My Portfolio** for live valuation, P&L, and allocation chart.
4. Check **Leaderboard** to see your live global rank by net worth against
   every other user.

## 5. One-command run with Docker (alternative)

```bash
docker compose up --build
```
This spins up MongoDB, the backend, and the frontend together. You'll still
need to run `docker compose exec backend npm run seed` once to populate stocks.

## 6. Deploying for real use

- Backend: deploy to Render / Railway / a VPS; set all `.env` vars there
  (use a real MongoDB Atlas URI, a strong `JWT_SECRET`, and your Upstox prod
  credentials with the redirect URI pointed at your deployed domain).
- Frontend: deploy to Vercel / Netlify; set `REACT_APP_API_URL` to your
  deployed backend URL.
- For production-grade always-on live prices, run a small cron/worker that
  refreshes the Upstox access token daily via Upstox's official refresh flow.

## Notes on data accuracy

This is a **paper trading / educational simulator**, not a real brokerage.
When connected to Upstox it reflects genuine NSE last-traded prices; without
a token it uses a random-walk simulation seeded from realistic starting
prices so the experience still feels live. No real money or real orders are
ever involved — `cashBalance` is entirely virtual.
