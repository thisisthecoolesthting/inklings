#!/usr/bin/env bash
# spawn_from_niche_spec.sh — produce a new spine-anchored repo from a niche_spec.json
#
# Usage:
#   scripts/spawn_from_niche_spec.sh path/to/niche_spec.json
#
# Outputs a fresh git repo at ~/Projects/<slug>/ ready to push.
#
# Requires: jq, git, node (for token swap helpers)

set -euo pipefail
SPEC="${1:?usage: $0 path/to/niche_spec.json}"
[[ -f "$SPEC" ]] || { echo "spec not found: $SPEC"; exit 1; }
command -v jq >/dev/null || { echo "jq required"; exit 1; }

SLUG=$(jq -r '.slug' "$SPEC")
NAME=$(jq -r '.name' "$SPEC")
DOMAIN=$(jq -r '.domain' "$SPEC")
PORT=$(jq -r '.vps_port // 3400' "$SPEC")
TAGLINE=$(jq -r '.tagline // ""' "$SPEC")
GH_REPO=$(jq -r '.github_repo' "$SPEC")
TARGET="${HOME}/Projects/${SLUG}"

echo "=== spawn $NAME ($SLUG) → $TARGET ==="
[[ -e "$TARGET" ]] && { echo "$TARGET already exists. Aborting to avoid clobber."; exit 1; }

# Clone Inklings (this template) as the starting point
echo "Cloning template..."
git clone https://github.com/thisisthecoolesthting/inklings.git "$TARGET"
cd "$TARGET"
rm -rf .git
git init -q -b main

# === brand swap ===
echo "Swapping brand strings..."
# Find/replace literal "Inklings" → new name (case-sensitive)
grep -rl "Inklings" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.md" --include="*.css" \
  --exclude-dir=node_modules --exclude-dir=.next | xargs -r sed -i "s/Inklings/${NAME}/g"
grep -rl "inklings" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.md" --include="*.css" \
  --exclude-dir=node_modules --exclude-dir=.next | xargs -r sed -i "s/inklings/${SLUG}/g"
grep -rl "inklings.shop" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.md" \
  --exclude-dir=node_modules --exclude-dir=.next | xargs -r sed -i "s/inklings.shop/${DOMAIN}/g"

# === port swap ===
sed -i "s/3400/${PORT}/g" package.json next.config.mjs 2>/dev/null || true

# === palette swap ===
node -e "
const fs = require('fs');
const spec = JSON.parse(fs.readFileSync('${SPEC}'));
const pal = spec.brand?.palette;
if (!pal) { console.log('no palette in spec — skipping color swap'); process.exit(0); }
const map = {
  '#FFF6E5': pal.cream,
  '#4A2545': pal.ink,
  '#F4815C': pal.coral,
  '#A8DDB5': pal.mint,
  '#D4A574': pal.gold,
};
for (const f of ['tailwind.config.ts', 'src/app/globals.css']) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, 'utf8');
  for (const [from, to] of Object.entries(map)) {
    if (to && to !== from) s = s.split(from).join(to);
  }
  fs.writeFileSync(f, s);
}
console.log('palette swapped');
"

# === clear product-specific routes (operator decides what to keep) ===
# Inklings-specific: /studio, /portal — these stay because they're spine-deviated by design
# Marketing pages stay; copy will be hand-rewritten per audience

# === fresh README + saas_spec.json from the niche_spec ===
cp "$SPEC" "saas_spec.json"
cat > README.md <<README
# ${NAME}

> ${TAGLINE}

Spawned from the SolutionStore SaaS spine via \`scripts/spawn_from_niche_spec.sh\`. See \`saas_spec.json\` for the canonical config and \`docs/SOLUTIONSTORE_SAAS_SPINE.md\` for the architecture.

## Local dev

\`\`\`bash
cp .env.example .env.local       # fill DATABASE_URL + JWT_SECRET
npm install
npx prisma migrate dev
npm run dev                       # http://localhost:${PORT}
\`\`\`

## Repo

GitHub: https://github.com/${GH_REPO}
README

# === drop spine deviations doc ===
mv docs/INKLINGS_SPINE_DEVIATIONS.md "docs/$(echo "$SLUG" | tr '[:lower:]' '[:upper:]')_SPINE_DEVIATIONS.md" 2>/dev/null || true

# === initial commit ===
git add -A
git commit -q -m "feat: bootstrap ${NAME} from spine

Spawned via scripts/spawn_from_niche_spec.sh from niche_specs/${SLUG}.json.
Inherits the SolutionStore SaaS spine (page recipe, visual tokens, mobile
rules, deploy pattern). Brand palette and copy customized per niche_spec."

echo ""
echo "=== ✓ spawn complete ==="
echo "  path: $TARGET"
echo "  next: cd $TARGET && gh repo create $GH_REPO --public --source . --remote origin --push"
echo "  then: deploy via VPS bootstrap (see docs/SPAWN_RECIPE.md)"
