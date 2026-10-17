// Capturas de revisión por tramos (evita el bucle de fullPage con alturas en svh).
// Uso: npx serve out -l 4173 & node scripts/capture-review.mjs <carpeta-salida>
// Escribe tramos PNG numerados por vista; luego scripts/stitch.py los une.
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";

const out = process.argv[2] ?? ".impeccable/review/parts";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist"] });

async function fullPage(name, ctxOpts) {
  const ctx = await browser.newContext({ ...ctxOpts, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("http://localhost:4180/");
  await page.addStyleTag({
    content: `html{scroll-behavior:auto!important}
      header,.read-progress{position:absolute!important}
      `,
  });
  // Precarga: recorrer la página para disparar imágenes diferidas y observadores.
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = await page.evaluate(() => innerHeight);
  for (let y = 0; y < total; y += vh / 2) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = "eager"; return i.decode().catch(() => {}); })));
  await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((n) => n.classList.add("is-visible")));
  // Las columnas sticky se mueven entre tramos y duplicarían texto al unir: se fijan solo aquí.
  await page.evaluate(() => document.querySelectorAll("body *").forEach((n) => {
    if (getComputedStyle(n).position === "sticky") n.style.position = "static";
  }));
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  let k = 0;
  for (let y = 0; y < height; y += vh) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(250);
    const real = await page.evaluate(() => scrollY);
    await page.screenshot({ path: `${out}/${name}-${String(k++).padStart(3, "0")}-${real}.png` });
  }
  console.log(name, "alto", height, "tramos", k);
  await ctx.close();
}

await fullPage("desktop", { viewport: { width: 1280, height: 800 } });
await fullPage("mobile", { ...devices["Pixel 7"] });
await browser.close();
