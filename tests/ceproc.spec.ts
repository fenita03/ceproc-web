import { expect, test, type Page } from "@playwright/test";

function watch(page: Page) {
  const problems: string[] = [];
  page.on("console", (m) => m.type() === "error" && problems.push(`console: ${m.text()}`));
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("response", (r) => r.status() >= 400 && problems.push(`${r.status()} ${r.url()}`));
  page.on("requestfailed", (r) => {
    if (!/ERR_ABORTED/.test(r.failure()?.errorText ?? "")) problems.push(`requestfailed ${r.url()}`);
  });
  return problems;
}

const instant = (page: Page) => page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });

test("orden: capacitaciones después de la portada, luego la institución y al final el contacto", async ({ page }) => {
  await page.goto("/");
  const ids = await page.$$eval("main > section", (s) => s.map((x) => x.id));
  expect(ids).toEqual(["inicio", "areas", "seguridad", "quienes-somos", "el-proyecto", "articulacion", "beneficios", "contacto"]);
  const navLabels = await page.$$eval('header nav[aria-label="Secciones"] a', (a) => a.map((x) => x.textContent?.trim()));
  expect(navLabels.slice(0, 3)).toEqual(["Capacitaciones", "La institución", "El proyecto"]);
  // Cada enlace del menú y del pie lleva a una sección que existe.
  const hrefs = await page.$$eval('header a[href^="#"], footer a[href^="#"]', (a) => a.map((x) => x.getAttribute("href")!));
  for (const h of hrefs) await expect(page.locator(h)).toHaveCount(1);
});

test("sin errores, con todas las imágenes y sin desborde en todos los anchos", async ({ page, isMobile }) => {
  test.skip(isMobile, "los anchos se recorren en un solo navegador");
  test.setTimeout(120_000);
  const problems = watch(page);
  await page.goto("/");
  await instant(page);
  for (const [w, h] of [[320, 640], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768], [1280, 800], [1920, 1080]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(120);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 700) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(25);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow, `desborde horizontal a ${w}px`).toBeLessThanOrEqual(0);
    await page.evaluate(() => scrollTo(0, 0));
  }
  await page.evaluate(() => Promise.all([...document.images].map((i) => ((i.loading = "eager"), i.decode().catch(() => null)))));
  const broken = await page.$$eval("img", (imgs) => imgs.filter((i) => i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
  expect(broken).toEqual([]);
  expect(problems).toEqual([]);
});

const activeBackdrop = (page: Page) =>
  page.evaluate(() => {
    // Capas del fondo de la portada: <img> (paisaje) o fondo CSS (fotos de áreas).
    const on = [...document.querySelectorAll<HTMLElement>("#inicio [class*=backdrop] [data-on]")];
    const src = (el?: HTMLElement) => (!el ? "" : el instanceof HTMLImageElement ? (el.getAttribute("src") ?? "") : getComputedStyle(el).backgroundImage);
    return { count: on.length, src: src(on[0]) };
  });

test("portada: núcleo orbital 3D sin esfera, con el logo plano en el centro", async ({ page }) => {
  const problems = watch(page);
  await page.goto("/");
  await expect(page.locator("#inicio [data-mode]")).toHaveAttribute("data-mode", "3d", { timeout: 15_000 });
  await expect(page.locator("#inicio [role=tab]")).toHaveCount(7);
  const logo = page.locator("#inicio img[class*=centerLogo]");
  await expect(logo).toBeVisible();
  const box = (await logo.boundingBox())!;
  expect(box.width).toBeLessThan(200); // logo chico, como en la cabecera
  // Sin objeto central: la escena solo dibuja órbitas, nodos y conexiones (pocos triángulos).
  const tri = await page.evaluate(() => (window as any).__ceprocOrbit?.stats().triangles);
  expect(tri).toBeLessThan(5000);
  expect(problems).toEqual([]);
});

test("portada: acercar el cursor a cada área cambia la foto de fondo, el título y los talleres", async ({ page, isMobile }) => {
  test.skip(isMobile, "interacción de puntero fino");
  const problems = watch(page);
  await page.goto("/");
  await expect(page.locator("#inicio [data-mode]")).toHaveAttribute("data-mode", "3d", { timeout: 15_000 });
  const panel = page.locator("#hero-area-panel");
  const keys = ["maquinaria", "seguridad", "regional", "cocina", "textil", "creativa", "carpinteria"];
  const counts = [5, 6, 10, 7, 9, 11, 8];
  for (let i = 0; i < 7; i++) {
    const b = (await page.locator("#inicio [role=tab]").nth(i).boundingBox())!;
    await page.mouse.move(b.x, b.y, { steps: 6 });
    await expect(page.locator("#inicio [role=tab]").nth(i)).toHaveAttribute("aria-selected", "true");
    await expect(panel).toContainText(`${counts[i]} talleres`);
    await expect.poll(async () => (await activeBackdrop(page)).src).toContain(`/img/${keys[i]}-`);
    expect((await activeBackdrop(page)).count).toBe(1);
  }
  await page.mouse.move(20, 500, { steps: 4 });
  await expect(panel).toContainText("Elegí un área de formación");
  await expect.poll(async () => (await activeBackdrop(page)).src).toContain("/img/paisaje-");
  expect(problems).toEqual([]);
});

test("portada en celular: tocar un área cambia la foto de la ficha", async ({ page, isMobile }) => {
  test.skip(!isMobile, "solo celular");
  await page.goto("/");
  const chips = page.locator("#inicio [aria-label='Elegí un área'] button");
  await chips.nth(4).tap();
  await expect(page.locator("#hero-area-panel")).toContainText("9 talleres");
  await expect(page.locator("#hero-area-panel figure img")).toHaveAttribute("src", /textil-/);
});

const areaExpect = [
  ["maquinaria", "Maquinaria, mecánica, electricidad y soldadura", 5],
  ["seguridad", "Seguridad, química", 6],
  ["regional", "Producción de alimentos", 10],
  ["cocina", "Capacitación para cocina", 7],
  ["textil", "Formación artesanal, textil y creativa", 9],
  ["creativa", "Nuevos talleres", 11],
  ["carpinteria", "", 8],
] as const;

test("áreas: pestañas, lista de talleres y carrusel con una foto por taller", async ({ page }) => {
  const problems = watch(page);
  await page.goto("/#areas");
  const tabs = page.locator("#areas [role=tab]");
  await expect(tabs).toHaveCount(7);
  const panel = page.locator("#area-panel");
  const front = panel.locator('article[data-off="0"]');
  const srcs = new Set<string>();
  for (let i = 0; i < 7; i++) {
    await tabs.nth(i).click();
    await expect(panel).toContainText(`${areaExpect[i][2]} talleres`);
    const items = panel.locator("ul button");
    await expect(items).toHaveCount(areaExpect[i][2]);
    // Cada taller de la lista lleva su tarjeta al frente del carrusel.
    await items.nth(1).click();
    await expect(front).toContainText(`Taller 02 / ${String(areaExpect[i][2]).padStart(2, "0")}`);
    const img = front.locator("img");
    await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.naturalWidth)).toBeGreaterThan(0);
    srcs.add((await img.getAttribute("src"))!);
  }
  expect(srcs.size).toBe(7);
  await page.getByRole("button", { name: "Taller siguiente" }).click();
  await expect(front).toContainText("Taller 03");
  expect(problems).toEqual([]);
});

test("áreas con teclado: flechas, Inicio y Fin entre pestañas", async ({ page, isMobile }) => {
  test.skip(isMobile, "teclado en escritorio");
  await page.goto("/#areas");
  const tabs = page.locator("#areas [role=tab]");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(page.locator("#area-panel")).toContainText("6 talleres");
  await page.keyboard.press("End");
  await expect(page.locator("#area-panel")).toContainText("8 talleres");
  await page.keyboard.press("Home");
  await expect(page.locator("#area-panel")).toContainText("5 talleres");
});

test("etapas del proyecto: cinco etapas reales y la nota sobre contratación", async ({ page }) => {
  await page.goto("/#el-proyecto");
  const steps = page.locator('section[aria-labelledby="circuito-title"] li');
  await expect(steps).toHaveCount(5);
  await expect(steps.first()).toContainText("Capacitación");
  await expect(page.locator('section[aria-labelledby="circuito-title"]')).toContainText("no implica contratación automática");
});

test("catálogo: los 56 talleres del documento están publicados y se abren desde el panel", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#areas details tbody tr")).toHaveCount(56);
  await page.getByRole("button", { name: "Ver el catálogo completo del área" }).click();
  await expect(page.locator("#catalogo-mineros-1")).toHaveAttribute("open", "");
});

test("menú móvil: abre, cierra con Escape y devuelve el foco", async ({ page, isMobile }) => {
  test.skip(!isMobile, "solo celular");
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  const links = page.locator("#menu-movil a");
  await expect(links).toHaveText(["Capacitaciones", "La institución", "El proyecto", "Contacto"]);
  await page.keyboard.press("Escape");
  await expect(page.locator("#menu-movil")).toBeHidden();
  await expect(page.getByRole("button", { name: "Abrir menú" })).toBeFocused();
});

test("enlace directo a una sección", async ({ page }) => {
  await page.goto("about:blank");
  await page.goto("/#areas");
  await expect(page.locator("#areas")).toBeInViewport({ timeout: 3000 });
});

test("movimiento reducido: contenido completo y sin animaciones del fondo", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("construye futuro");
  await expect(page.getByRole("heading", { name: /Una propuesta de formación/ })).toBeVisible();
  const anim = await page.locator("#inicio [class*=haze]").first().evaluate((e) => getComputedStyle(e).animationName);
  expect(anim).toBe("none");
  await ctx.close();
});

test("quiénes somos: dos retratos ilustrativos distintos, marcados como ilustrativos", async ({ page }) => {
  const problems = watch(page);
  await page.goto("/#quienes-somos");
  const imgs = page.locator("#quienes-somos [class*=portrait] img");
  await expect(imgs).toHaveCount(2);
  const srcs = await imgs.evaluateAll((els) => els.map((e) => (e as HTMLImageElement).getAttribute("src")));
  expect(new Set(srcs).size).toBe(2);
  for (let i = 0; i < 2; i++) {
    await imgs.nth(i).scrollIntoViewIfNeeded();
    await expect.poll(() => imgs.nth(i).evaluate((e: HTMLImageElement) => e.naturalWidth)).toBeGreaterThan(0);
    await expect(imgs.nth(i)).toHaveAttribute("alt", /ilustrativo/);
  }
  await expect(page.locator("#quienes-somos [class*=portrait] figcaption")).toHaveText(["Retrato ilustrativo", "Retrato ilustrativo"]);
  expect(problems).toEqual([]);
});

test("maquinaria: carrusel con las vistas del camión que avanza solo y se pausa con el cursor", async ({ page, isMobile }) => {
  const problems = watch(page);
  await page.goto("/");
  await instant(page);
  const panel = page.locator("#area-panel");
  const carousel = panel.locator("[aria-roledescription=carrusel]");
  await carousel.scrollIntoViewIfNeeded();
  const front = panel.locator('article[data-off="0"]');
  await expect(front.locator("img")).toHaveAttribute("src", /camion\/vista-1-/);
  await expect(front).not.toContainText("Imagen ilustrativa");
  await expect.poll(() => front.locator("img").evaluate((e: HTMLImageElement) => e.naturalWidth)).toBeGreaterThan(0);
  // Avanza solo, despacio (5 s por tarjeta).
  await page.waitForTimeout(3500);
  await expect(front).toContainText("Taller 01 / 05");
  await expect(front).toContainText("Taller 02 / 05", { timeout: 4000 });
  await expect(front.locator("img")).toHaveAttribute("src", /camion\/vista-3-/);
  if (!isMobile) {
    // Con el cursor encima no avanza.
    const b = (await carousel.boundingBox())!;
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.waitForTimeout(6000);
    await expect(front).toContainText("Taller 02 / 05");
  }
  expect(problems).toEqual([]);
});
