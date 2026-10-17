// Cuadros de la entrada de la portada y de una transición de área, para revisar el movimiento.
// Uso: node scripts/motion-frames.mjs <carpeta>
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const out = process.argv[2] ?? ".review/motion";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist"] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const t0 = Date.now();
page.goto("http://localhost:4180/");
await page.waitForSelector("#hero-title");
for (const ms of [120, 300, 500, 800, 1300, 2200]) {
  const wait = ms - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${out}/entrada-${String(ms).padStart(4, "0")}.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
}
await page.waitForSelector('#inicio [data-mode="3d"]', { timeout: 15000 });
const b = await page.locator("#inicio [role=tab]").nth(2).boundingBox();
await page.mouse.move(b.x, b.y, { steps: 8 });
for (const ms of [60, 200, 450]) {
  await page.waitForTimeout(ms === 60 ? 60 : ms - 60);
  await page.screenshot({ path: `${out}/area-${ms}.png` });
}
await browser.close();
