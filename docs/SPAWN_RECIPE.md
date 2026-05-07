# Spawn recipe — going from niche_spec.json to a deployed site

## Phase 1 — local scaffold (~5 min)

```bash
# 1. Author the niche_spec
cp niche_specs/inklings.json niche_specs/<slug>.json
$EDITOR niche_specs/<slug>.json   # edit slug, name, domain, palette, tiers

# 2. Spawn
scripts/spawn_from_niche_spec.sh niche_specs/<slug>.json
# Produces ~/Projects/<slug>/ with brand swap applied + initial commit
```

## Phase 2 — push to GitHub (~30 sec)

```bash
cd ~/Projects/<slug>
gh repo create thisisthecoolesthting/<slug> --public --source . --remote origin --push
```

## Phase 3 — VPS deploy (~10 min)

On the operator's VPS as root:

```bash
# 1. Clone
git clone https://github.com/thisisthecoolesthting/<slug>.git /var/www/<slug>
cd /var/www/<slug>
npm install --no-audit --no-fund
npx prisma generate

# 2. Provision Postgres
sudo -u postgres psql <<SQL
CREATE ROLE <slug> WITH LOGIN PASSWORD 'CHANGEME';
CREATE DATABASE <slug> OWNER <slug>;
SQL

# 3. Write /var/www/<slug>/.env (chmod 600)
cat > /var/www/<slug>/.env <<ENV
DATABASE_URL=postgresql://<slug>:CHANGEME@localhost:5432/<slug>
INK_SESSION_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_APP_URL=https://<domain>
NODE_ENV=production
PORT=<port>
ENV
chmod 600 /var/www/<slug>/.env

# 4. Migrate + build
npx prisma db push
NEXT_TELEMETRY_DISABLED=1 npm run build

# 5. Caddy
cat >> /etc/caddy/Caddyfile <<CADDY

<domain>, www.<domain> {
  reverse_proxy localhost:<port>
  encode zstd gzip
}
CADDY
caddy reload --config /etc/caddy/Caddyfile

# 6. pm2
pm2 start npm --name <slug> -- start
pm2 save

# 7. Auto-deploy cron (the hardened pattern from Inklings)
cat > /etc/cron.d/<slug>-deploy <<CRON
*/2 * * * * root cd /var/www/<slug> && git fetch origin main >> /var/log/<slug>-deploy.log 2>&1 && CURR=\$(git rev-parse HEAD) && git reset --hard origin/main >> /var/log/<slug>-deploy.log 2>&1 && NEW=\$(git rev-parse HEAD) && if [ "\$CURR" != "\$NEW" ]; then pm2 stop <slug>; rm -rf .next; npm install --no-audit --no-fund >> /var/log/<slug>-deploy.log 2>&1; npx prisma generate >> /var/log/<slug>-deploy.log 2>&1; NEXT_TELEMETRY_DISABLED=1 npm run build >> /var/log/<slug>-deploy.log 2>&1; pm2 start <slug> --update-env >> /var/log/<slug>-deploy.log 2>&1; fi
CRON
chmod 644 /etc/cron.d/<slug>-deploy
```

## Phase 4 — DNS (~30 sec)

Programmatically via Porkbun API (operator's PORKBUN_API_KEY in `/opt/factory/.env`):

```bash
TKEY=$(grep '^PORKBUN_API_KEY=' /opt/factory/.env | cut -d= -f2-)
TSEC=$(grep '^PORKBUN_SECRET_API_KEY=' /opt/factory/.env | cut -d= -f2-)
VPS_IP=187.124.246.154
DOMAIN=<domain>

# Delete any parking ALIAS / wildcard CNAME (Porkbun adds these by default)
curl -sS -X POST -H "Content-Type: application/json" \
  -d "{\"apikey\":\"$TKEY\",\"secretapikey\":\"$TSEC\"}" \
  https://api.porkbun.com/api/json/v3/dns/retrieve/$DOMAIN \
  | jq -r '.records[] | select(.type=="ALIAS" or (.type=="CNAME" and .name=="*.'$DOMAIN'")) | .id' \
  | xargs -I{} curl -sS -X POST -H "Content-Type: application/json" \
      -d "{\"apikey\":\"$TKEY\",\"secretapikey\":\"$TSEC\"}" \
      https://api.porkbun.com/api/json/v3/dns/delete/$DOMAIN/{}

# Create the A record
curl -sS -X POST -H "Content-Type: application/json" \
  -d "{\"apikey\":\"$TKEY\",\"secretapikey\":\"$TSEC\",\"type\":\"A\",\"content\":\"$VPS_IP\",\"ttl\":\"600\"}" \
  https://api.porkbun.com/api/json/v3/dns/create/$DOMAIN

# Create www CNAME → root
curl -sS -X POST -H "Content-Type: application/json" \
  -d "{\"apikey\":\"$TKEY\",\"secretapikey\":\"$TSEC\",\"type\":\"CNAME\",\"name\":\"www\",\"content\":\"$DOMAIN\",\"ttl\":\"600\"}" \
  https://api.porkbun.com/api/json/v3/dns/create/$DOMAIN
```

Caddy auto-fetches the LE cert on the first inbound request.

## Total time

~15 minutes from niche_spec to live HTTPS site, vs ~2 hours hand-doing it. Inklings (2026-05-07) was the validation run.

## Limits of the spawn

The script does the easy 30%: clone, brand swap, palette, port. It does NOT ship:
- Product-specific routes (the kid Studio for Inklings, the scanner for PriceScout)
- Stripe Price IDs (operator mints)
- Custom Prisma schema beyond the spine baseline
- Marketing copy beyond placeholders

Those are hand-written per project — but you start from a working scaffold that compiles, deploys, and serves a marketing site, not from a blank `npx create-next-app`.
