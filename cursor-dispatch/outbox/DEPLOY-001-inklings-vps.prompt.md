---
to: codex
from: claude (cowork)
date: 2026-05-07
priority: P0-IMMEDIATE
project: inklings
working_dir: C:\Users\reasn\Projects\inklings
branch: chore/vps-deploy
dispatch_id: INKLINGS-DEPLOY-001
depends_on: [INKLINGS-BUILD-VERIFY-002]
parallel_safe: true
self_merge_after_green: false
operator_blocked_on: ["VPS SSH access (host, root user, key)", "Porkbun DNS A record for inklings.shop", "Supabase Postgres URL OR provision local Postgres on VPS"]
---

# DEPLOY-001 — Inklings VPS deploy

Mirror PriceScout deploy: `/var/www/inklings`, Caddy vhost, pm2 process on port 3400, cron auto-pull every 2 min.

## Tasks

### A — Caddy block (append to `/etc/caddy/Caddyfile`)

```
inklings.shop {
  reverse_proxy localhost:3400
  encode zstd gzip
}
```

### B — pm2 ecosystem entry

```js
{
  name: "inklings",
  script: "./node_modules/next/dist/bin/next",
  args: "start -p 3400",
  cwd: "/var/www/inklings",
  env: { PORT: 3400, NODE_ENV: "production" },
  instances: 1,
  exec_mode: "fork",
}
```

### C — Cron auto-pull (every 2 min)

`/etc/cron.d/inklings-deploy`:
```
*/2 * * * * root cd /var/www/inklings && git fetch origin main >> /var/log/inklings-deploy.log 2>&1 && git reset --hard origin/main && pm2 stop inklings; npm ci && npx prisma generate && npm run build && pm2 start inklings --update-env >> /var/log/inklings-deploy.log 2>&1
```

CRITICAL: `pm2 stop && start --update-env`, never `pm2 reload` (per spine §15 — bit ShiftDeck 3x).

### D — DNS + cert

A record `inklings.shop → <VPS IP>` on Porkbun. Caddy auto-fetches LE cert.

### E — Env vars on VPS

Place in `/var/www/inklings/.env` (chmod 600):
- DATABASE_URL (Supabase or local Postgres)
- INK_SESSION_SECRET (32+ chars random)
- NEXT_PUBLIC_APP_URL=https://inklings.shop
- RESEND_API_KEY (optional dev)
- ANTHROPIC_API_KEY (after dispatch 003)
- TOGETHER_API_KEY (after dispatch 004)
- STRIPE_* (after dispatch 006)

## Acceptance

`https://inklings.shop` returns 200 with the home page. Cron deploy log shows successful pulls every 2 min. `gh repo view` and the live site agree on the latest commit SHA.
