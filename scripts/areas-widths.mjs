// Carrusel 3D de Capacitaciones en anchos comunes: ¿se ven las tarjetas laterales en perspectiva?
import { chromium } from "@playwright/test";
const browser = await chromium.launch({ args: ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist"] });
for (const [w, h] of [[1280, 720], [1366, 768], [1536, 864], [1920, 1080], [1024, 768]]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  await page.goto("http://localhost:4180/#areas");
  await page.waitForTimeout(1500);
  const car = page.locator("[aria-roledescription=carrusel]");
  await car.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const info = await page.evaluate(() => [...document.querySelectorAll("[aria-roledescription=carrusel] article")].map((a) => {
    const b = a.getBoundingClientRect(); const cs = getComputedStyle(a);
    return `${a.dataset.off}:${Math.round(b.width)}w op${cs.opacity} ${cs.transform === "none" ? "sin-transform" : "3d"}`;
  }).join(" | "));
  console.log(w, info);
  await page.screenshot({ path: `.review/comparar/areas-${w}.png` });
}
await browser.close();
