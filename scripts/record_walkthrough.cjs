const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.argv[2] || "https://inklings.shop";
const OUT_DIR = path.join(__dirname, "..", "public", "videos");
const VIDEO_SIZE = { width: 1280, height: 720 };

async function showCaption(page, text) {
  await page.evaluate((txt) => {
    let el = document.getElementById("__ink_caption__");
    if (!el) {
      el = document.createElement("div");
      el.id = "__ink_caption__";
      el.style.cssText = [
        "position:fixed","bottom:36px","left:50%","transform:translateX(-50%)",
        "background:rgba(74,37,69,0.92)","color:#FFF6E5",
        "padding:14px 28px","border-radius:12px",
        "font:600 22px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
        "letter-spacing:-0.01em","max-width:78%","text-align:center",
        "z-index:2147483647","box-shadow:0 12px 36px rgba(0,0,0,0.35)",
        "border:1px solid rgba(168,221,181,0.45)","pointer-events:none",
      ].join(";");
      document.body.appendChild(el);
    }
    el.textContent = txt;
    el.style.opacity = "1";
  }, text);
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: VIDEO_SIZE,
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT_DIR, size: VIDEO_SIZE },
  });
  const page = await ctx.newPage();

  // Scene 1 — home hero
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(1000);
  await showCaption(page, "Inklings — a storybook your child stars in");
  await page.waitForTimeout(2500);

  // Scene 2 — pricing
  await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(800);
  await showCaption(page, "Free to start. $9.99 Premium. $19.99 per printed book.");
  await page.waitForTimeout(2500);

  // Scene 3 — safety + CTA
  await page.goto(`${BASE}/security`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(800);
  await showCaption(page, "Safety is the first feature. Parent approval gate. COPPA-compliant.");
  await page.waitForTimeout(2500);
  await page.evaluate(() => { const el = document.getElementById("__ink_caption__"); if (el) el.style.opacity="0"; });
  await page.waitForTimeout(400);

  await page.close();
  await ctx.close();
  await browser.close();

  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith(".webm")).map(f => ({ f, t: fs.statSync(path.join(OUT_DIR, f)).mtimeMs }));
  files.sort((a, b) => b.t - a.t);
  if (!files[0]) { console.error("no webm"); process.exit(1); }
  const final = path.join(OUT_DIR, "walkthrough.webm");
  if (fs.existsSync(final)) fs.unlinkSync(final);
  fs.renameSync(path.join(OUT_DIR, files[0].f), final);
  // Cleanup any zero-byte stragglers
  for (const f of fs.readdirSync(OUT_DIR)) {
    const fp = path.join(OUT_DIR, f);
    if (f.startsWith("page@") && fs.statSync(fp).size === 0) fs.unlinkSync(fp);
  }
  console.log(`OK ${(fs.statSync(final).size/1024).toFixed(0)} KB`);
})().catch((e) => { console.error("FAIL", e.message); process.exit(1); });
