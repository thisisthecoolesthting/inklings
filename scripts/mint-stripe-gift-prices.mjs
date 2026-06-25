#!/usr/bin/env node
/**
 * Mint Stripe gift prices and append IDs to .env
 * Run on VPS: cd /var/www/inklings && node scripts/mint-stripe-gift-prices.mjs
 */
import fs from "node:fs/promises";
import Stripe from "stripe";

const ENV_PATH = new URL("../.env", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

async function loadEnv() {
  try {
    const raw = await fs.readFile(ENV_PATH, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* */
  }
}

const PLANS = [
  { env: "STRIPE_PRICE_GIFT_1M", name: "Inklings Gift — 1 month Premium", amount: 999 },
  { env: "STRIPE_PRICE_GIFT_6M", name: "Inklings Gift — 6 months Premium", amount: 4999 },
  { env: "STRIPE_PRICE_GIFT_12M", name: "Inklings Gift — 12 months Premium", amount: 8999 },
];

async function main() {
  await loadEnv();
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY missing");
  const stripe = new Stripe(key);

  let envText = await fs.readFile(ENV_PATH, "utf8").catch(() => "");
  const created = {};

  for (const plan of PLANS) {
    if (process.env[plan.env]) {
      console.log(`Skip ${plan.env} (already set)`);
      created[plan.env] = process.env[plan.env];
      continue;
    }
    const product = await stripe.products.create({ name: plan.name });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.amount,
      currency: "usd",
    });
    created[plan.env] = price.id;
    console.log(`Created ${plan.env}=${price.id}`);
  }

  for (const [k, v] of Object.entries(created)) {
    const re = new RegExp(`^${k}=.*$`, "m");
    if (re.test(envText)) envText = envText.replace(re, `${k}=${v}`);
    else envText += `\n${k}=${v}`;
  }
  await fs.writeFile(ENV_PATH, envText.trim() + "\n");
  console.log("Updated .env");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
