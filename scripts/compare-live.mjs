// Captura portada y Capacitaciones del sitio publicado y del local para comparar.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
mkdirSync(".review/comparar", { recursive: true });
const browser = await chromium.launch({ args: ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist"] });
for (const [name, url] of [["publicado", "https://ceproc.vercel.app/"], ["local", "http://localhost:4180/"]]) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(url);
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `.review/comparar/${name}-portada.png` });
  const info = await page.evaluate(() => ({
    secciones: [...document.querySelectorAll("main > section")].map((s) => s.id),
    canvases: document.querySelectorAll("canvas").length,
    modo: document.querySelector("#inicio [data-mode]")?.getAttribute("data-mode"),
  }));
  console.log(name, JSON.stringify(info));
  await page.evaluate(() => document.getElementById("areas")?.scrollIntoView());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `.review/comparar/${name}-areas.png` });
}
await browser.close();
