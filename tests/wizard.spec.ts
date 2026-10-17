import { expect, test, type Page } from "@playwright/test";
import { GET, POST, detectKind, signLink, verifyLink } from "../api/cv.ts";

/**
 * «Capacitate con nosotros»: asistente adaptado de NOVEX, acceso flotante, CV y mensaje de WhatsApp.
 * window.open se intercepta para leer la URL exacta que se abriría.
 */

const WA = "https://wa.me/5492645239410?text=";

async function setup(page: Page, opts: { blockPopup?: boolean } = {}) {
  await page.addInitScript((block) => {
    (window as any).__opened = [];
    window.open = ((url: string) => {
      (window as any).__opened.push(url);
      return block ? null : ({} as Window);
    }) as typeof window.open;
    sessionStorage.clear();
  }, Boolean(opts.blockPopup));
}

const opened = (page: Page) => page.evaluate(() => (window as any).__opened as string[]);
const textOf = (url: string) => decodeURIComponent(url.slice(WA.length));
const wizard = (page: Page) => page.getByRole("dialog");
const btn = (page: Page, name: RegExp | string) => wizard(page).getByRole("button", { name, exact: typeof name === "string" });
const pick = (page: Page, text: string) => wizard(page).locator("label", { hasText: text }).first().click();
const step = (page: Page, n: number) => expect(wizard(page).getByText(new RegExp(`Paso ${n} de 7`))).toBeVisible();

const pdf = (size = 2048, name = "cv-ana.pdf") => ({
  name,
  mimeType: "application/pdf",
  buffer: Buffer.concat([Buffer.from("%PDF-1.7\n"), Buffer.alloc(Math.max(0, size - 9), 32)]),
});

async function openFromHero(page: Page) {
  await page.goto("/");
  await page.locator("#inicio").getByRole("button", { name: "Capacitate con nosotros" }).click();
  await expect(wizard(page)).toBeVisible();
}

/** Recorre el asistente hasta el paso del CV. */
async function toCv(page: Page) {
  await pick(page, "Textil y artesanal");
  await btn(page, /Continuar/).click();
  await pick(page, "Macramé");
  await pick(page, "Telar");
  await btn(page, /Continuar/).click();
  await pick(page, "Mejorar mis oportunidades laborales");
  await btn(page, /Continuar/).click();
  await pick(page, "Tengo conocimientos básicos");
  await pick(page, "Tarde");
  await pick(page, "Noche");
  await btn(page, /Continuar/).click();
  const d = wizard(page);
  await d.locator("#nombre").fill("Ana Pérez");
  await d.locator("#telefono").fill("264 512-3456");
  await d.locator("#consentimiento").check();
  await btn(page, /Continuar/).click();
  await step(page, 6);
}

test("acceso flotante: se aparta en la portada y está en el resto del recorrido; abre el asistente y Escape lo cierra", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", (e) => problems.push(e.message));
  page.on("console", (m) => m.type() === "error" && problems.push(m.text()));
  await setup(page);
  await page.goto("/");
  const fab = page.locator("button[class*=fab]");
  await expect(fab).toHaveAttribute("data-off", "true");
  for (const id of ["areas", "quienes-somos", "el-proyecto", "contacto"]) {
    await page.evaluate((id) => document.getElementById(id)!.scrollIntoView({ behavior: "instant" }), id);
    await expect(fab, `visible en #${id}`).not.toHaveAttribute("data-off", "true");
  }
  await fab.click();
  await expect(wizard(page)).toBeVisible();
  await expect(wizard(page).getByRole("heading", { name: "¿Qué te gustaría aprender?" })).toBeFocused();
  await expect(page.locator("dialog[open]")).toHaveCount(1); // un solo asistente
  await expect(fab).toHaveAttribute("data-off", "true");
  await page.keyboard.press("Escape");
  await expect(wizard(page)).toBeHidden();
  await expect(fab).toBeFocused();
  // Reabrir no duplica el diálogo y conserva el paso.
  await fab.click();
  await expect(page.locator("dialog")).toHaveCount(1);
  expect(problems).toEqual([]);
});

test("pasos: validación, Omitir, Anterior y respuestas que se conservan", async ({ page }) => {
  await setup(page);
  await openFromHero(page);
  await step(page, 1);
  await btn(page, /Continuar/).click();
  await expect(wizard(page).getByText("Elegí un área o «Todavía no lo sé».")).toBeVisible();
  await pick(page, "Seguridad y servicios");
  await btn(page, /Continuar/).click();
  await step(page, 2);
  await expect(wizard(page).locator("label[class*=chip]")).toHaveCount(6); // talleres reales del área
  await btn(page, "Omitir").click();
  await step(page, 3);
  await pick(page, "Otro objetivo");
  await btn(page, /Continuar/).click();
  await expect(wizard(page).getByText("Contanos tu objetivo o elegí otra opción.")).toBeVisible();
  await wizard(page).locator("#objetivoOtro").fill("Trabajar en un campamento");
  await btn(page, /Continuar/).click();
  await btn(page, "Omitir").click();
  await step(page, 5);
  await btn(page, /Continuar/).click();
  for (const msg of ["Escribí tu nombre.", "Escribí un número de WhatsApp o teléfono.", "Necesitamos tu autorización para responderte."])
    await expect(wizard(page).getByText(msg)).toBeVisible();
  await wizard(page).locator("#telefono").fill("123");
  await wizard(page).locator("#email").fill("ana@");
  await btn(page, /Continuar/).click();
  await expect(wizard(page).getByText(/entre 8 y 15 dígitos/)).toBeVisible();
  await expect(wizard(page).getByText(/Revisá el correo/)).toBeVisible();
  // Anterior conserva lo elegido.
  await btn(page, "Anterior").click();
  await btn(page, "Anterior").click();
  await expect(wizard(page).locator("#objetivoOtro")).toHaveValue("Trabajar en un campamento");
});

test("«Todavía no lo sé» saltea los talleres sin cambiar el total de pasos", async ({ page }) => {
  await setup(page);
  await openFromHero(page);
  await pick(page, "Todavía no lo sé");
  await btn(page, /Continuar/).click();
  await step(page, 3);
  await btn(page, "Anterior").click();
  await step(page, 1);
});

test("envío sin CV: revisión, edición y WhatsApp al número oficial con todas las respuestas", async ({ page }) => {
  await setup(page);
  await openFromHero(page);
  await toCv(page);
  await btn(page, "Omitir").click();
  await step(page, 7);
  const d = wizard(page);
  await expect(d.getByRole("region", { name: "Qué quiero aprender" })).toContainText("Macramé, Telar");
  // Editar vuelve a la revisión con «Guardar».
  await d.getByRole("button", { name: "Editar: Contacto" }).click();
  await d.locator("#email").fill("ana@correo.com");
  await btn(page, /Guardar/).click();
  await step(page, 7);
  await btn(page, /Enviar por WhatsApp/).click();
  const urls = await opened(page);
  expect(urls).toHaveLength(1);
  expect(urls[0].startsWith(WA)).toBe(true);
  const text = textOf(urls[0]);
  for (const line of [
    "Hola, CEPROC. Quiero recibir información sobre las capacitaciones.",
    "- Área: Textil y artesanal",
    "- Talleres: Macramé, Telar",
    "- Objetivo: Mejorar mis oportunidades laborales",
    "- Experiencia previa: Tengo conocimientos básicos",
    "- Horarios posibles: Tarde, Noche",
    "- Nombre: Ana Pérez",
    "- WhatsApp o teléfono: 264 512-3456",
    "- Correo: ana@correo.com",
  ])
    expect(text).toContain(line);
  expect(text).not.toContain("CURRÍCULUM");
  await expect(d.getByText("Para que nos llegue, tocá Enviar en WhatsApp.")).toBeVisible();
  await expect(btn(page, /Abrir WhatsApp de nuevo/)).toBeVisible();
});

test("si el navegador bloquea la ventana, se ofrece el enlace y no se confirma nada", async ({ page }) => {
  await setup(page, { blockPopup: true });
  await openFromHero(page);
  await toCv(page);
  await btn(page, "Omitir").click();
  await btn(page, /Enviar por WhatsApp/).click();
  await expect(wizard(page).getByText("Tu navegador no dejó abrir WhatsApp.")).toBeVisible();
  await expect(wizard(page).getByRole("link", { name: "Abrí este enlace" })).toHaveAttribute("href", /^https:\/\/wa\.me\/5492645239410/);
  await expect(wizard(page).getByText("tocá Enviar en WhatsApp")).toHaveCount(0);
});

test("CV: rechaza formatos y tamaños no permitidos, permite cambiar y quitar", async ({ page }) => {
  await setup(page);
  await openFromHero(page);
  await toCv(page);
  const input = wizard(page).locator("#cv");
  await expect(input).toHaveAttribute("accept", /\.pdf,\.docx/);
  await input.setInputFiles({ name: "cv.txt", mimeType: "text/plain", buffer: Buffer.from("hola") });
  await expect(wizard(page).getByText("Tiene que ser un PDF o un Word (.docx).")).toBeVisible();
  await input.setInputFiles({ name: "falso.pdf", mimeType: "application/pdf", buffer: Buffer.from("no soy un pdf") });
  await expect(wizard(page).getByText("El archivo no parece un PDF o Word válido.")).toBeVisible();
  await input.setInputFiles(pdf(5 * 1024 * 1024));
  await expect(wizard(page).getByText(/el máximo es 4 MB/)).toBeVisible();
  await input.setInputFiles(pdf());
  await expect(wizard(page).getByText("cv-ana.pdf")).toBeVisible();
  await input.setInputFiles(pdf(4096, "cv-nuevo.pdf"));
  await expect(wizard(page).getByText("cv-nuevo.pdf")).toBeVisible();
  await btn(page, "Quitar").click();
  await expect(btn(page, /Elegir archivo/)).toBeVisible();
});

test("CV sin almacenamiento: el mensaje dice que se adjunta en el chat", async ({ page }) => {
  await setup(page);
  await page.route("**/api/cv?status", (r) => r.fulfill({ status: 404, body: "" }));
  await openFromHero(page);
  await toCv(page);
  await wizard(page).locator("#cv").setInputFiles(pdf());
  await expect(wizard(page).getByText(/Lo adjuntás en el chat de WhatsApp/)).toBeVisible();
  await btn(page, /Revisar solicitud/).click();
  await btn(page, /Enviar por WhatsApp/).click();
  expect(textOf((await opened(page))[0])).toContain("- Lo adjunto en este chat.");
  await expect(wizard(page).getByText("Y adjuntá tu CV en el chat.", { exact: false })).toBeVisible();
});

test("CV con almacenamiento: se sube antes de la revisión y el mensaje lleva el enlace privado", async ({ page }) => {
  await setup(page);
  let bytes = 0;
  await page.route("**/api/cv?status", (r) => r.fulfill({ json: { ready: true } }));
  await page.route("**/api/cv", async (r) => {
    if (r.request().method() !== "POST") return r.fallback();
    bytes = r.request().postDataBuffer()!.length;
    await new Promise((res) => setTimeout(res, 300));
    await r.fulfill({ status: 201, json: { url: "https://ceproc.vercel.app/api/cv?t=abc.def", days: 30 } });
  });
  await openFromHero(page);
  await toCv(page);
  await wizard(page).locator("#cv").setInputFiles(pdf());
  await btn(page, /Revisar solicitud/).click();
  await expect(btn(page, /Subiendo CV/)).toBeDisabled();
  await step(page, 7);
  expect(bytes).toBe(2048);
  await expect(wizard(page).getByRole("region", { name: "Currículum" })).toContainText("Enlace privado");
  await btn(page, /Enviar por WhatsApp/).click();
  expect(textOf((await opened(page))[0])).toContain("- Enlace privado (vence en 30 días): https://ceproc.vercel.app/api/cv?t=abc.def");
});

test("CV con error de carga: no avanza, se puede reintentar o seguir sin el CV", async ({ page }) => {
  await setup(page);
  let attempts = 0;
  await page.route("**/api/cv?status", (r) => r.fulfill({ json: { ready: true } }));
  await page.route("**/api/cv", (r) => {
    if (r.request().method() !== "POST") return r.fallback();
    attempts++;
    return r.fulfill({ status: 502, json: { error: "storage-failed" } });
  });
  await openFromHero(page);
  await toCv(page);
  await wizard(page).locator("#cv").setInputFiles(pdf());
  await btn(page, /Revisar solicitud/).click();
  await expect(wizard(page).getByText("No se pudo subir el CV.")).toBeVisible();
  await step(page, 6);
  await btn(page, "Reintentar").click();
  await expect.poll(() => attempts).toBe(2);
  await btn(page, "Seguir sin el CV").click();
  await btn(page, /Revisar solicitud/).click();
  await step(page, 7);
  await btn(page, /Enviar por WhatsApp/).click();
  expect(textOf((await opened(page))[0])).toContain("No se pudo subir; puedo enviarlo por este chat.");
});

test("«Me interesa este taller» abre el asistente con el área y el taller marcados", async ({ page }) => {
  await setup(page);
  await page.goto("/#areas");
  await page.locator("#areas [role=tab]").nth(4).click();
  await page.locator("#area-panel ul button").nth(2).click();
  await page.locator("#area-panel").getByRole("button", { name: /Me interesa este taller/ }).click();
  await expect(wizard(page).locator("label[data-checked=true]", { hasText: "Textil y artesanal" })).toBeVisible();
  await btn(page, /Continuar/).click();
  await expect(wizard(page).locator("label[data-checked=true]", { hasText: "Bordado" })).toBeVisible();
});

test("encabezado: en escritorio el botón abre el mismo asistente", async ({ page, isMobile }) => {
  test.skip(isMobile, "en celular el acceso es el flotante");
  await setup(page);
  await page.goto("/");
  await page.locator("header").getByRole("button", { name: /Capacitate con nosotros/ }).click();
  await expect(wizard(page)).toBeVisible();
  await expect(page.locator("dialog")).toHaveCount(1);
});

test("contacto: consulta general por WhatsApp separada del asistente", async ({ page }) => {
  await page.goto("/#contacto");
  const general = page.locator("#contacto").getByRole("link", { name: /WhatsApp · consulta general/ });
  await expect(general).toHaveAttribute("href", /^https:\/\/wa\.me\/5492645239410\?text=/);
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
    const saved = { token: process.env.BLOB_READ_WRITE_TOKEN, secret: process.env.CV_LINK_SECRET };
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
    if (saved.token === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = saved.token;
    if (saved.secret === undefined) delete process.env.CV_LINK_SECRET;
    else process.env.CV_LINK_SECRET = saved.secret;
  });
});
