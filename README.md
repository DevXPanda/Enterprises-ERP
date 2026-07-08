# NEP — API Gateway Showcase

Demonstrates the core microservices idea for the **NKTech Enterprise Platform (NEP)**:
two modules built by different people, in **different tech stacks**, unified behind
**one API Gateway** and shown on **one frontend**.

| Module        | Real stack (project)          | Runs here as        | Port  |
|---------------|-------------------------------|---------------------|-------|
| Wages         | Laravel (PHP) + MySQL — Sachin | Node stand-in       | 4001  |
| Manufacturing | MERN (Node + Express + Mongo) | Node                | 4002  |
| API Gateway   | routing + serves the frontend | Node                | 8080  |

> PHP and Docker are not installed on this machine, so the wages service runs as a
> small Node stand-in. The **integration is identical** either way — when Sachin's
> real Laravel is ready, just point the gateway at its URL (see below). Nothing else
> changes.

## Architecture

```
        Browser
           |
   http://localhost:8080
           |
   +---------------------+
   |    API GATEWAY      |   serves the frontend + routes /api/*
   +----+-----------+----+
        |           |
 /api/wages/*   /api/manufacturing/*
        |           |
   +---------+  +--------------+
   |  WAGES  |  | MANUFACTURING|
   | Laravel |  |    MERN      |
   +---------+  +--------------+
```

The frontend only ever calls the gateway (same origin) — so there is **no CORS
problem** and it has no idea two different backends are involved.

## Run it

```bash
node start.js
```

Then open **http://localhost:8080**.

(Or run each service in its own terminal: `npm run wages`, `npm run manufacture`, `npm run gateway`.)

## Endpoints (through the gateway)

- `GET /api/health` — aggregated health + stack of every service
- `GET /api/manufacturing/summary` · `GET /api/manufacturing/lines`
- `GET /api/wages/summary` · `GET /api/wages/workers`

## Plugging in Sachin's real Laravel later

The gateway reads service URLs from env vars. Point it at the real host:

```bash
# PowerShell
$env:WAGES_URL = "http://localhost:9000"   # Sachin's `php artisan serve`
node start.js
```

No frontend or gateway code changes — that is the whole point of the gateway.

## What to say in the demo

1. Open the page — one clean ERP dashboard.
2. Point at the two badges: **Manufacturing = MERN**, **Wages = Laravel**. Different
   stacks, different databases, different developers.
3. The gateway strip shows both services live.
4. The "Production-Linked Wage Insight" mixes data from **both** services in one card
   — proving they are unified, not just placed side by side.
