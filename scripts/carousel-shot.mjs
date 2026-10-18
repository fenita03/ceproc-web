// Primer plano del carrusel 3D de Capacitaciones (escritorio y celular).
import { chromium, devices } from "@playwright/test";
const browser = await chromium.launch({ args: ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist"] });
for (const [n, o] of [["d", { viewport: { width: 1440, height: 900 } }], ["m", { ...devices["Pixel 7"] }]]) {
  const page = await (await browser.newContext(o)).newPage();
  await page.goto("http://localhost:4180/");
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important} header{display:none!important}" });
  const car = page.locator("#area-panel [aria-roledescription=carrusel]");
  await car.scrollIntoViewIfNeeded();
  await page.evaluate(() => scrollBy(0, -120));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `.review/blanco/carrusel-${n}.png` });
}
await browser.close();
