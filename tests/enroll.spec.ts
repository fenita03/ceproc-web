import { expect, test, type Page } from "@playwright/test";
import { GET, POST, detectKind, signLink, verifyLink } from "../api/cv.ts";

/**
 * «Capacitate con nosotros»: acceso flotante, diálogo, validación, CV y mensaje de WhatsApp.
 * window.open se intercepta para leer la URL exacta que se abriría (no se sale del sitio).
 */

const WA = "https://wa.me/5492645239410?text=";

function watch(page: Page) {
  const problems: string[] = [];
  page.on("console", (m) => m.type() === "error" && problems.push(`console: ${m.text()}`));
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  return problems;
}

async function setup(page: Page) {
  await page.addInitScript(() => {
    (window as any).__opened = [];
    window.open = ((url: string) => {
      (window as any).__opened.push(url);
      return null;
    }) as typeof window.open;
  });
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" }).catch(() => undefined);
}

const opened = (page: Page) => page.evaluate(() => (window as any).__opened as string[]);
const textOf = (url: string) => decodeURIComponent(url.slice(WA.length));
const dialog = (page: Page) => page.getByRole("dialog", { name: "Capacitate con nosotros" });
const next = (page: Page) => dialog(page).getByRole("button", { name: "Siguiente", exact: true });

async function fillSteps(page: Page) {
  const d = dialog(page);
  await d.getByLabel("Nombre y apellido").fill("Ana Pérez");
  await d.getByLabel("Teléfono o WhatsApp").fill("264 512-3456");
  await next(page).click();
  await d.getByLabel("¿Qué área te interesa?").selectOption({ label: "Textil y artesanal" });
  await d.getByLabel("¿Qué capacitación te gustaría realizar?").selectOption("Macramé");
  await d.getByRole("radio", { name: "Mejorar mis oportunidades laborales" }).check();
  await d.getByRole("radio", { name: "No", exact: true }).check();
  await d.getByRole("checkbox", { name: "Tarde" }).check();
  await d.getByRole("checkbox", { name: "Noche" }).check();
  await next(page).click();
  await expect(d.getByRole("heading", { name: /Paso 3 de 3/ })).toBeFocused();
}

const pdf = (size = 2048) => ({
  name: "cv-ana.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.concat([Buffer.from("%PDF-1.7\n"), Buffer.alloc(Math.max(0, size - 9), 32)]),
});

test("acceso flotante: oculto en la portada, visible al recorrer la institución; abre y cierra con Escape devolviendo el foco", async ({ page }) => {
  const problems = watch(page);
  await setup(page);
  await page.goto("/");
  const launcher = page.locator("button[class*=launcher]");
  await expect(launcher).toHaveAttribute("data-off", "true");
  await page.locator("#quienes-somos").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("quienes-somos")!.scrollIntoView());
  await expect(launcher).not.toHaveAttribute("data-off", "true");
  await launcher.click();
  await expect(dialog(page)).toBeVisible();
  await expect(dialog(page).getByRole("heading", { name: /Paso 1 de 3/ })).toBeFocused();
  // El acceso flotante no queda accesible mientras el diálogo está abierto.
  await expect(launcher).toHaveAttribute("data-off", "true");
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();
  await expect(launcher).toBeFocused();
  expect(problems).toEqual([]);
});

test("portada: el botón «Capacitate con nosotros» abre el formulario; el botón de cierre lo cierra", async ({ page }) => {
  await setup(page);
  await page.goto("/");
  const cta = page.locator("#inicio").getByRole("button", { name: "Capacitate con nosotros" });
  await cta.click();
  await expect(dialog(page)).toBeVisible();
  await dialog(page).getByRole("button", { name: "Cerrar" }).click();
  await expect(dialog(page)).toBeHidden();
  await expect(cta).toBeFocused();
});

test("validación: obligatorios, formatos, «Otro» y respuestas que se conservan al volver", async ({ page }) => {
  await setup(page);
  await page.goto("/");
  await page.locator("#inicio").getByRole("button", { name: "Capacitate con nosotros" }).click();
  const d = dialog(page);
  await next(page).click();
  await expect(d.getByText("Escribí tu nombre y apellido.")).toBeVisible();
  await expect(d.getByText("Escribí un número de teléfono o WhatsApp.")).toBeVisible();
  await expect(d.getByLabel("Nombre y apellido")).toBeFocused();
  await d.getByLabel("Nombre y apellido").fill("Ana Pérez");
  await d.getByLabel("Teléfono o WhatsApp").fill("123");
  await d.getByLabel("Correo electrónico").fill("ana@");
  await next(page).click();
  await expect(d.getByText(/entre 8 y 15 dígitos/)).toBeVisible();
  await expect(d.getByText(/Revisá el correo/)).toBeVisible();
  await d.getByLabel("Teléfono o WhatsApp").fill("+54 9 264 512-3456");
  await d.getByLabel("Correo electrónico").fill("");
  await next(page).click();

  // Paso 2: el selector de talleres depende del área.
  await expect(d.getByLabel("¿Qué capacitación te gustaría realizar?")).toBeDisabled();
  await next(page).click();
  for (const msg of ["Elegí un área.", "Elegí tu objetivo principal.", "Elegí una opción.", "Elegí al menos una franja."])
    await expect(d.getByText(msg, { exact: true })).toBeVisible();
  await d.getByLabel("¿Qué área te interesa?").selectOption({ label: "Seguridad y servicios" });
  const workshops = d.getByLabel("¿Qué capacitación te gustaría realizar?").locator("option");
  await expect(workshops).toHaveCount(7); // «Todavía no lo tengo decidido» + 6 talleres reales
  await d.getByRole("radio", { name: "Otro" }).check();
  await d.getByRole("radio", { name: "Sí", exact: true }).check();
  await d.getByRole("checkbox", { name: "Horario flexible" }).check();
  await next(page).click();
  await expect(d.getByText("Contanos brevemente tu objetivo.")).toBeVisible();
  await d.getByLabel("Contanos tu objetivo").fill("Trabajar en un campamento minero");
  await next(page).click();

  // Volver no pierde nada.
  await d.getByRole("button", { name: "Volver" }).click();
  await expect(d.getByLabel("¿Qué área te interesa?")).toHaveValue("mineros-2");
  await expect(d.getByLabel("Contanos tu objetivo")).toHaveValue("Trabajar en un campamento minero");
  await d.getByRole("button", { name: "Volver" }).click();
  await expect(d.getByLabel("Nombre y apellido")).toHaveValue("Ana Pérez");

  // Cerrar y reabrir tampoco.
  await page.keyboard.press("Escape");
  await page.locator("#inicio").getByRole("button", { name: "Capacitate con nosotros" }).click();
  await expect(d.getByLabel("Nombre y apellido")).toHaveValue("Ana Pérez");
});

test("envío sin CV: exige autorización y abre WhatsApp al número oficial con todas las respuestas", async ({ page }) => {
  const problems = watch(page);
  await setup(page);
  await page.goto("/");
  await page.locator("#inicio").getByRole("button", { name: "Capacitate con nosotros" }).click();
  await fillSteps(page);
  const d = dialog(page);
  await d.getByLabel("Comentarios").fill("Puedo cursar en Rawson.");
  await expect(d.getByRole("region", { name: "Revisá tus respuestas" })).toContainText("Macramé");

  const send = d.getByRole("button", { name: "Enviar mi solicitud por WhatsApp" });
  await send.click();
  await expect(d.getByText("Para enviar tu solicitud necesitamos tu autorización.")).toBeVisible();
  expect(await opened(page)).toEqual([]);

  await d.getByRole("checkbox", { name: /Acepto que mis datos/ }).check();
  await send.click();
  const urls = await opened(page);
  expect(urls).toHaveLength(1);
  expect(urls[0].startsWith(WA)).toBe(true);
  const text = textOf(urls[0]);
  for (const line of [
    "SOLICITUD DE INFORMACIÓN — CEPROC",
    "Nombre y apellido: Ana Pérez",
    "WhatsApp: 264 512-3456",
    "Correo electrónico: No proporcionado",
    "Área de interés: Textil y artesanal",
    "Capacitación elegida: Macramé",
    "Objetivo principal: Mejorar mis oportunidades laborales",
    "Experiencia previa: No",
    "Disponibilidad: Tarde, Noche",
    "Puedo cursar en Rawson.",
    "No adjunto currículum.",
  ])
    expect(text).toContain(line);
  expect(text).not.toMatch(/\[respuesta\]|undefined|null/);

  // Sin falsa confirmación: se aclara que el mensaje todavía no se envió.
  await expect(d.getByText("todavía no se envió")).toBeVisible();
  await expect(d.getByRole("link", { name: "Abrir WhatsApp de nuevo" })).toHaveAttribute("href", urls[0]);
  expect(problems).toEqual([]);
});

test("CV: rechaza formatos y tamaños no permitidos, permite reemplazar y quitar", async ({ page }) => {
  await setup(page);
  await page.goto("/");
  await page.locator("#inicio").getByRole("button", { name: "Capacitate con nosotros" }).click();
  await fillSteps(page);
  const d = dialog(page);
  const input = d.locator('input[type="file"]');
  await expect(input).toHaveAttribute("accept", /\.pdf,\.docx/);

  await input.setInputFiles({ name: "cv.txt", mimeType: "text/plain", buffer: Buffer.from("hola") });
  await expect(d.getByText("El archivo debe ser PDF o DOCX.")).toBeVisible();
  await input.setInputFiles({ name: "falso.pdf", mimeType: "application/pdf", buffer: Buffer.from("no soy un pdf") });
  await expect(d.getByText("El archivo no parece un PDF o DOCX válido.")).toBeVisible();
  await input.setInputFiles(pdf(5 * 1024 * 1024));
  await expect(d.getByText(/el máximo es 4 MB/)).toBeVisible();

  await input.setInputFiles(pdf());
  await expect(d.getByText("cv-ana.pdf")).toBeVisible();
  await input.setInputFiles({ ...pdf(), name: "cv-nuevo.pdf" }); // «Reemplazar» usa el mismo selector
  await expect(d.getByText("cv-nuevo.pdf")).toBeVisible();
  await expect(d.getByText("cv-ana.pdf")).toHaveCount(0);
  await d.getByRole("button", { name: "Quitar" }).click();
  await expect(d.getByRole("button", { name: "Adjuntar mi currículum" })).toBeVisible();
});

test("CV sin almacenamiento configurado: el mensaje avisa que se adjunta en el chat", async ({ page }) => {
  await setup(page);
  await page.route("**/api/cv?status", (r) => r.fulfill({ status: 404, body: "" }));
  await page.goto("/");
  await page.locator("#inicio").getByRole("button", { name: "Capacitate con nosotros" }).click();
  await fillSteps(page);
  const d = dialog(page);
  await expect(d.getByText(/adjuntalo en el chat con el clip/)).toBeVisible();
  await d.locator('input[type="file"]').setInputFiles(pdf());
  await d.getByRole("checkbox", { name: /Acepto que mis datos y mi CV/ }).check();
  await d.getByRole("button", { name: "Enviar mi solicitud por WhatsApp" }).click();
  expect(textOf((await opened(page))[0])).toContain("Tengo un currículum y lo adjunto en este chat.");
  await expect(d.getByText(/Falta tu CV/)).toBeVisible();
});

test("CV con almacenamiento: se sube antes de armar el mensaje y viaja como enlace privado", async ({ page }) => {
  await setup(page);
  let uploaded = 0;
  await page.route("**/api/cv?status", (r) => r.fulfill({ json: { ready: true } }));
  await page.route("**/api/cv", async (r) => {
    if (r.request().method() !== "POST") return r.fallback();
    uploaded = r.request().postDataBuffer()!.length;
    await new Promise((res) => setTimeout(res, 300));
    await r.fulfill({ status: 201, json: { url: "https://ceproc.vercel.app/api/cv?t=abc.def", days: 30 } });
  });
  await page.goto("/");
  await page.locator("#inicio").getByRole("button", { name: "Capacitate con nosotros" }).click();
  await fillSteps(page);
  const d = dialog(page);
  await d.locator('input[type="file"]').setInputFiles(pdf());
  await d.getByRole("checkbox", { name: /Acepto que mis datos y mi CV/ }).check();
  await d.getByRole("button", { name: "Enviar mi solicitud por WhatsApp" }).click();
  await expect(d.getByRole("button", { name: "Subiendo tu CV…" })).toBeDisabled();
  await expect(d.getByText("Tu CV se subió correctamente.", { exact: false })).toBeVisible();
  expect(uploaded).toBe(2048);
  expect(await opened(page)).toEqual([]); // WhatsApp se abre con el toque del usuario, no solo
  const link = d.getByRole("link", { name: "Enviar mi solicitud por WhatsApp" });
  const href = (await link.getAttribute("href"))!;
  expect(href.startsWith(WA)).toBe(true);
  expect(textOf(href)).toContain("Enlace privado para descargarlo (vence en 30 días): https://ceproc.vercel.app/api/cv?t=abc.def");
});

test("CV con error de carga: se informa, no hay confirmación falsa y se puede reintentar o seguir sin el CV", async ({ page }) => {
  await setup(page);
  let attempts = 0;
  await page.route("**/api/cv?status", (r) => r.fulfill({ json: { ready: true } }));
  await page.route("**/api/cv", (r) => {
    if (r.request().method() !== "POST") return r.fallback();
    attempts++;
    return r.fulfill({ status: 502, json: { error: "storage-failed" } });
  });
  await page.goto("/");
  await page.locator("#inicio").getByRole("button", { name: "Capacitate con nosotros" }).click();
  await fillSteps(page);
  const d = dialog(page);
  await d.locator('input[type="file"]').setInputFiles(pdf());
  await d.getByRole("checkbox", { name: /Acepto que mis datos y mi CV/ }).check();
  await d.getByRole("button", { name: "Enviar mi solicitud por WhatsApp" }).click();
  await expect(d.getByText(/No se pudo subir el CV/)).toBeVisible();
  expect(await opened(page)).toEqual([]);
  await expect(d.getByText("todavía no se envió")).toHaveCount(0);
  await d.getByRole("button", { name: "Reintentar" }).click();
  await expect.poll(() => attempts).toBe(2);
  await d.getByRole("button", { name: "Seguir sin el CV" }).click();
  await d.getByRole("button", { name: "Enviar mi solicitud por WhatsApp" }).click();
  expect(textOf((await opened(page))[0])).toContain("no se pudo subir desde el sitio");
});

test("capacitaciones: «Me interesa este taller» abre el formulario con el área y el taller elegidos", async ({ page }) => {
  await setup(page);
  await page.goto("/#areas");
  await page.locator("#areas [role=tab]").nth(4).click();
  await page.locator("#area-panel ul button").nth(2).click();
  await page.locator("#area-panel").getByRole("button", { name: /Me interesa este taller/ }).click();
  const d = dialog(page);
  await d.getByLabel("Nombre y apellido").fill("Ana Pérez");
  await d.getByLabel("Teléfono o WhatsApp").fill("2645123456");
  await next(page).click();
  await expect(d.getByLabel("¿Qué área te interesa?")).toHaveValue("textil");
  await expect(d.getByLabel("¿Qué capacitación te gustaría realizar?")).toHaveValue("Bordado");
});

test("seguridad: los trayectos mineros llevan a su área en Capacitaciones", async ({ page }) => {
  await page.goto("/#seguridad");
  await page.locator("#seguridad").getByRole("link", { name: /Seguridad y servicios/ }).click();
  await expect(page.locator("#areas [role=tab][aria-selected=true]")).toHaveText(/Seguridad y servicios/);
  await expect(page.locator("#areas")).toBeInViewport();
});

test("contacto: consulta general por WhatsApp separada del formulario", async ({ page }) => {
  await page.goto("/#contacto");
  const general = page.locator("#contacto").getByRole("link", { name: /WhatsApp · consulta general/ });
  await expect(general).toHaveAttribute("href", /^https:\/\/wa\.me\/5492645239410\?text=/);
  await expect(page.locator("#contacto").getByRole("button", { name: "Capacitate con nosotros" })).toBeVisible();
});

test("institución: el detalle extenso está plegado pero completo", async ({ page }) => {
  await page.goto("/#el-proyecto");
  const more = page.locator("#el-proyecto details");
  await expect(more.locator("#especificos-title + ol li")).toHaveCount(10);
  await expect(more.locator("#especificos-title")).toBeHidden();
  await more.locator("summary").click();
  await expect(more.locator("#especificos-title")).toBeVisible();
});

/* ------------------------------------------------------------------ Función /api/cv (sin red) */

test.describe("api/cv", () => {
  test.skip(({ isMobile }) => isMobile, "lógica de servidor: una sola vez");
  const SECRET = "x".repeat(32);
  const docx = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.alloc(40), Buffer.from("word/document.xml")]);

  test("reconoce PDF y DOCX por su contenido", () => {
    expect(detectKind(new Uint8Array(Buffer.from("%PDF-1.4 resto")))).toBe("pdf");
    expect(detectKind(new Uint8Array(docx))).toBe("docx");
    expect(detectKind(new Uint8Array(Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.alloc(60)])))).toBeNull();
    expect(detectKind(new Uint8Array(Buffer.from("MZ ejecutable......")))).toBeNull();
  });

  test("los enlaces firmados vencen y no se pueden alterar", () => {
    const t = signLink("cv/abc.pdf", Date.now() + 60_000, SECRET);
    expect(verifyLink(t, SECRET)).toBe("cv/abc.pdf");
    expect(verifyLink(t, "otro-secreto-de-32-caracteres!!!")).toBeNull();
    expect(verifyLink(t.slice(0, -2) + "xx", SECRET)).toBeNull();
    expect(verifyLink(signLink("cv/abc.pdf", Date.now() - 1, SECRET), SECRET)).toBeNull();
    expect(verifyLink(signLink("../secreto", Date.now() + 60_000, SECRET), SECRET)).toBeNull();
  });

  test("sin configuración responde 503; con configuración valida tipo y tamaño antes de guardar", async () => {
    const env = { ...process.env };
    delete process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.CV_LINK_SECRET;
    expect((await POST(new Request("https://x/api/cv", { method: "POST", body: "%PDF-1" }))).status).toBe(503);
    expect(await (await GET(new Request("https://x/api/cv?status"))).json()).toMatchObject({ ready: false });

    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_test_token";
    process.env.CV_LINK_SECRET = SECRET;
    expect(await (await GET(new Request("https://x/api/cv?status"))).json()).toMatchObject({ ready: true });
    expect((await POST(new Request("https://x/api/cv", { method: "POST", body: "texto plano no permitido" }))).status).toBe(415);
    expect((await POST(new Request("https://x/api/cv", { method: "POST", body: Buffer.alloc(4 * 1024 * 1024 + 1) }))).status).toBe(413);
    expect((await POST(new Request("https://x/api/cv", { method: "POST", body: "" }))).status).toBe(400);
    expect((await GET(new Request("https://x/api/cv?t=falso.firma"))).status).toBe(403);
    delete process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.CV_LINK_SECRET;
    Object.assign(process.env, env);
  });
});
