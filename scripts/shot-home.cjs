/* Screenshot sweep of the redesigned homepage (desktop + mobile). */
const { chromium } = require("@playwright/test");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3400/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  await page.screenshot({ path: "/tmp/shots/01-hero.png" });

  // Journey: scroll through the 440vh runway in slices
  const journeyTop = await page.evaluate(() => {
    const el = document.querySelector("#story-journey");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });
  const runway = await page.evaluate(() => {
    const el = document.querySelector("#story-journey > div");
    return el ? el.offsetHeight : 0;
  });
  const vh = 900;
  for (const [i, frac] of [0.02, 0.35, 0.7, 0.97].entries()) {
    await page.evaluate((y) => window.scrollTo(0, y), journeyTop + runway * frac - vh * 0.0);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `/tmp/shots/02-journey-${i}.png` });
  }

  // Principles
  await page.evaluate(() => {
    document.querySelectorAll("article.card-base")[0]?.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "/tmp/shots/03-principles.png" });

  // Craft
  await page.evaluate(() => {
    document.querySelector("figure blockquote")?.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "/tmp/shots/04-craft.png" });

  // Pricing
  await page.evaluate(() => {
    document.querySelectorAll("section")[4]?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "/tmp/shots/05-pricing.png" });

  // Final CTA
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/tmp/shots/06-final-cta.png" });

  // Mobile hero + journey
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3400/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "/tmp/shots/07-mobile-hero.png" });
  const mJourneyTop = await page.evaluate(() => {
    const el = document.querySelector("#story-journey");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });
  const mRunway = await page.evaluate(() => {
    const el = document.querySelector("#story-journey > div");
    return el ? el.offsetHeight : 0;
  });
  await page.evaluate((y) => window.scrollTo(0, y), mJourneyTop + mRunway * 0.45);
  await page.waitForTimeout(900);
  await page.screenshot({ path: "/tmp/shots/08-mobile-journey.png" });

  await browser.close();
  console.log("shots done");
})();
