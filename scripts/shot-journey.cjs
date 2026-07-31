const { chromium } = require("@playwright/test");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3400/", { waitUntil: "networkidle" });
  const top = await page.evaluate(() => {
    const el = document.querySelector("#story-journey");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });
  const runway = await page.evaluate(() => document.querySelector("#story-journey > div")?.offsetHeight ?? 0);
  await page.evaluate((y) => window.scrollTo(0, y), top + runway * 0.35);
  await page.waitForTimeout(900);
  await page.screenshot({ path: "/tmp/shots/fix-journey.png" });
  await browser.close();
  console.log("done");
})();
