// Núcleo de la portada con teclado: Tab hasta el rótulo, flechas, Escape.
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:4180/");
await page.waitForSelector('#inicio [data-mode]');
const tabs = page.locator("#inicio [role=tab]");
await tabs.first().focus();
await page.keyboard.press("ArrowRight");
await page.keyboard.press("ArrowRight");
const sel = await tabs.nth(2).getAttribute("aria-selected");
const panel = await page.locator("#hero-area-panel").innerText();
await page.keyboard.press("Escape");
await page.keyboard.press("Tab");
console.log({ seleccionadaTrasDosFlechas: sel, ficha: panel.split("\n")[1], foco: await page.evaluate(() => document.activeElement?.textContent?.slice(0, 40)) });
await browser.close();
