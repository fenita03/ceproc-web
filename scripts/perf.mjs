// Rendimiento con GPU real (Chromium headless + ANGLE/D3D11).
// Uso: npx vite preview --port 4180  →  node scripts/perf.mjs
import { chromium, devices } from "playwright";

const URL = process.env.PERF_URL ?? "http://localhost:4180/";
const profiles = [
  { name: "escritorio 1920×1080", ctx: { viewport: { width: 1920, height: 1080 } } },
  { name: "portátil 1366×768", ctx: { viewport: { width: 1366, height: 768 } } },
  { name: "retina 1440×900 @2x", ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 } },
  { name: "tablet 768×1024 · CPU ×2", ctx: { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, cpu: 2 },
  { name: "móvil 390×844 @3x · CPU ×4", ctx: { ...devices["iPhone 13"] }, cpu: 4 },
  { name: "móvil 360×800 @3x · CPU ×4", ctx: { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, cpu: 4 },
];

const stats = (iv) => {
  const s = [...iv].sort((a, b) => a - b);
  const avg = iv.reduce((a, b) => a + b, 0) / iv.length;
  return { fps: +(1000 / avg).toFixed(1), p95: +s[Math.floor(0.95 * s.length)].toFixed(1), lentos: +((iv.filter((x) => x > 20).length / iv.length) * 100).toFixed(1) };
};

const browser = await chromium.launch({ args: ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist"] });
for (const prof of profiles) {
  const ctx = await browser.newContext(prof.ctx);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.addInitScript(() => {
    window.__p = { iv: [], long: 0, lcp: 0, rec: false };
    new PerformanceObserver((l) => (window.__p.long += l.getEntries().length)).observe({ type: "longtask", buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__p.lcp = e.startTime))).observe({ type: "largest-contentful-paint", buffered: true });
    let last = 0;
    const tick = (t) => {
      if (window.__p.rec && last) window.__p.iv.push(t - last);
      last = t;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  if (prof.cpu) await cdp.send("Emulation.setCPUThrottlingRate", { rate: prof.cpu });
  await page.goto(URL, { waitUntil: "load" });
  const rec = async (fn) => {
    await page.evaluate(() => Object.assign(window.__p, { iv: [], rec: true }));
    await fn();
    return page.evaluate(() => ((window.__p.rec = false), window.__p.iv));
  };
  // 1) Portada: entrada del núcleo, carga de texturas y reposo (3 s desde la carga).
  const hero = await rec(() => page.waitForTimeout(3000));
  // LCP de la carga inicial (antes de desplazarse a otras secciones).
  const lcpLoad = await page.evaluate(() => window.__p.lcp);
  // 2) Cambios de área en «Áreas de formación»: cursor sobre la lista (o toques en celular).
  const touch = !!prof.ctx.hasTouch;
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  await page.evaluate(() => document.getElementById("areas").scrollIntoView());
  await page.waitForTimeout(600);
  const round = async () => {
    const tabs = page.locator("#areas [role=tab]");
    for (let k = 0; k < 14; k++) {
      if (!touch) {
        const b = await tabs.nth(k % 7).boundingBox();
        await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 6 });
      } else {
        await tabs.nth(k % 7).dispatchEvent("click");
        await page.waitForTimeout(120);
      }
    }
  };
  const swapCold = await rec(round);
  const swap = await rec(round);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(300);
  const img = await page.evaluate(() => {
    const e = performance.getEntriesByType("resource").find((r) => /paisaje-\d+\.webp/.test(r.name));
    return e ? Math.round(e.responseEnd) : null;
  });
  const heap = await page.evaluate(() => (performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null));
  await page.mouse.move(5, 5);
  // 3) Scroll completo con rueda.
  const scroll = await rec(async () => {
    await page.mouse.move(200, 300);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 120) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(45);
    }
  });
  const { long, lcp } = await page.evaluate(() => window.__p);
  const fmt = (s) => (s ? `${s.fps} fps · p95 ${s.p95} ms · ${s.lentos}% lentos` : "—");
  console.log(`
${prof.name}`);
  console.log(`  entrada (3 s)     ${fmt(stats(hero))}`);
  console.log(`  cambios (1.ª vez) ${fmt(stats(swapCold))}`);
  console.log(`  cambios de área   ${fmt(stats(swap))}`);
  console.log(`  scroll            ${fmt(stats(scroll))}`);
  console.log(`  LCP ${Math.round(lcpLoad)} ms · paisaje cargado ${img} ms · tareas largas ${long} · heap JS ${heap} MB · errores ${errors.length}`);
  await ctx.close();
}
await browser.close();
