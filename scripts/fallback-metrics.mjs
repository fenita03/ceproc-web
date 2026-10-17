// Calcula size-adjust de los respaldos (Arial) comparando anchos de texto real.
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:4180/");
await page.evaluate(() => document.fonts.ready);
console.log(await page.evaluate(async () => {
  const sample = "Formación práctica en oficios para jóvenes y adultos de Rawson, conectada con el trabajo. 0123456789";
  const c = document.createElement("canvas").getContext("2d");
  const out = {};
  for (const [name, fam, w] of [["Manrope", "Manrope Variable", 700], ["DM Sans", "DM Sans Variable", 400]]) {
    await document.fonts.load(`${w} 100px "${fam}"`);
    c.font = `${w} 100px "${fam}"`;
    const real = c.measureText(sample);
    c.font = `${w} 100px Arial`;
    const arial = c.measureText(sample).width;
    out[name] = { sizeAdjust: ((real.width / arial) * 100).toFixed(1) + "%", ascent: real.fontBoundingBoxAscent, descent: real.fontBoundingBoxDescent };
  }
  return JSON.stringify(out);
}));
await browser.close();
