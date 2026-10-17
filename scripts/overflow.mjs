// Busca elementos que desbordan el ancho de la ventana (Pixel 7 y 320 px).
import { chromium, devices } from "@playwright/test";
const browser = await chromium.launch();
for (const opts of [{ ...devices["Pixel 7"] }, { viewport: { width: 320, height: 640 } }]) {
  const page = await (await browser.newContext(opts)).newPage();
  await page.goto("http://localhost:4180/");
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      const b = el.getBoundingClientRect();
      if (b.right > W + 1 && b.width > 0 && getComputedStyle(el).position !== "fixed") {
        let p = el.parentElement, clipped = false;
        while (p && p !== document.body) { const o = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(o.overflowX)) { clipped = true; break; } p = p.parentElement; }
        if (!clipped) out.push(`${el.tagName}.${el.className} right=${Math.round(b.right)}`);
      }
    }
    return { W, sw: document.documentElement.scrollWidth, out: out.slice(0, 15) };
  });
  console.log(JSON.stringify(r, null, 1));
}
await browser.close();
