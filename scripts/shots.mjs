// Capturas rápidas por sección (escritorio 1440×900 y Pixel 7) para revisar el diseño.
// Uso: npx vite preview --port 4180 & node scripts/shots.mjs <carpeta-salida> [sección ...]
import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";

const out = process.argv[2] ?? ".review/shots";
const only = process.argv.slice(3);
mkdirSync(out, { recursive: true });
const SECTIONS = ["inicio", "areas", "seguridad", "quienes-somos", "el-proyecto", "articulacion", "beneficios", "contacto", "footer"];
const browser = await chromium.launch({ args: ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist"] });
const problems = [];

for (const [name, opts] of [
  ["d", { viewport: { width: 1440, height: 900 } }],
  ["m", { ...devices["Pixel 7"] }],
  ...(process.env.TABLET ? [["t", { viewport: { width: 820, height: 1180 }, hasTouch: true }]] : []),
]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && problems.push(`${name} console: ${m.text()}`));
  page.on("pageerror", (e) => problems.push(`${name} pageerror: ${e.message}`));
  page.on("response", (r) => r.status() >= 400 && problems.push(`${name} ${r.status()} ${r.url()}`));
  await page.goto("http://localhost:4180/");
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  await page.waitForTimeout(2500);
  for (const id of SECTIONS) {
    if (only.length && !only.includes(id)) continue;
    const sel = id === "footer" ? "footer" : `#${id}`;
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    // Recorre la sección para disparar apariciones y fotos diferidas.
    const box = await el.boundingBox();
    const y0 = await page.evaluate(() => scrollY);
    for (let y = 0; y < (box?.height ?? 0); y += 400) {
      await page.evaluate((y) => scrollTo(0, y), y0 + y);
      await page.waitForTimeout(60);
    }
    await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((n) => n.classList.add("is-in")));
    await page.waitForTimeout(700);
    await el.screenshot({ path: `${out}/${name}-${id}.png`, animations: "disabled" }).catch(async () => {
      await page.screenshot({ path: `${out}/${name}-${id}.png` });
    });
  }
  await ctx.close();
}
await browser.close();
console.log(problems.length ? problems.join("\n") : "sin errores de consola ni de red");
