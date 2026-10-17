import { chromium, devices } from "@playwright/test";
const browser = await chromium.launch();
const page = await (await browser.newContext({ ...devices["Pixel 7"] })).newPage();
await page.goto("http://localhost:4180/");
await page.waitForTimeout(1500);
console.log(await page.evaluate(() => {
  const W = document.documentElement.clientWidth;
  const res = [];
  for (const el of document.querySelectorAll("body, body *")) {
    const b = el.getBoundingClientRect();
    if (b.right > W + 1 && b.width > 0) res.push([Math.round(b.right), el.tagName + "." + String(el.className).slice(0, 40), getComputedStyle(el).position]);
  }
  res.sort((a, b) => b[0] - a[0]);
  return JSON.stringify({ W, body: document.body.scrollWidth, html: document.documentElement.scrollWidth, top: res.slice(0, 12) }, null, 1);
}));
// ¿Se puede desplazar horizontalmente en realidad?
await page.evaluate(() => scrollTo(300, 0));
console.log("scrollX tras intentar desplazar:", await page.evaluate(() => scrollX));
await browser.close();
