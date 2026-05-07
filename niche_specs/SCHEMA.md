# niche_spec.json schema

A `niche_spec.json` is the single config file that drives a spine-spawned SaaS. Drop it in `niche_specs/<slug>.json`, run `scripts/spawn_from_niche_spec.sh <slug>`, and a new spine-anchored Next 15 site spawns into `~/Projects/<slug>/`.

## Required fields

| Field | Type | Notes |
|---|---|---|
| `slug` | string | url-safe lowercase, dash-separated (e.g. `inklings`, `secondspringclub`) |
| `name` | string | Display brand name (e.g. `Inklings`) |
| `domain` | string | Canonical domain (e.g. `inklings.shop`) |
| `github_repo` | string | `<owner>/<repo>` — usually `thisisthecoolesthting/<slug>` |
| `vps_path` | string | `/var/www/<slug>` for the standard VPS deploy |
| `vps_port` | number | Free port ≥ 3300, unique per app on the shared VPS |
| `audience` | object | `{ primary, also, never }` |
| `value_props` | string[] | 3-5 short bullets, owner-operator language |
| `tiers` | object[] | Pricing tiers — name, price_cents, interval, limits |
| `brand.palette` | object | Hex tokens — at minimum a primary, an accent, a text color, and a background |
| `stack` | string | One-liner of stack identifiers |
| `spawned_from` | object | `{ spine_doc, spine_version, swap_recipe_section }` |

## Optional fields

| Field | Type | Notes |
|---|---|---|
| `ai_integrations` | object | Per-integration: `{ provider, model, env }` |
| `deploy` | object | VPS host, process manager, reverse proxy, cron config |
| `spine_deviations` | string[] | Documented intentional differences from the canonical spine |
| `tagline` | string | Short hero line |

## How the spawn script uses each field

`scripts/spawn_from_niche_spec.sh` reads the JSON and produces:

1. **Repo path**: `~/Projects/<slug>/` cloned from this template (or PriceScout)
2. **Brand swap**: `tailwind.config.ts` colors replaced with `brand.palette`; `src/lib/brand.ts` rewritten with `name`, `tagline`, `domain`; metadata in `src/app/layout.tsx` swapped
3. **Schema**: `prisma/schema.prisma` kept generic; project-specific tables added by hand-written migration (out of scope for spawn)
4. **Pricing**: `src/components/PricingTiers.tsx` rewritten from the `tiers` array
5. **`.env.example`**: keys for `ai_integrations.*.env` + standard auth/db vars
6. **README**: scaffolded with name, audience, run-it-locally block

## What the spawn script does NOT do

- Provision DNS, VPS dirs, Caddy vhost, pm2 entry, cron — those are operator-side or handled by a separate `scripts/vps_bootstrap.sh` deploy script
- Mint Stripe Price IDs
- Wire up product-specific routes (e.g. `/studio` and `/portal` for Inklings, `/scan` for PriceScout)

Those remain hand-written per project, but the spine scaffold + brand chrome lands in <30 minutes.
