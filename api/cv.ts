/**
 * Función de Vercel para los CV de «Capacitate con nosotros».
 *
 *   GET  /api/cv?status   → { ready } : indica si el almacenamiento está configurado.
 *   POST /api/cv          → cuerpo = el archivo (PDF o DOCX, ≤ 4 MB). Lo valida por contenido,
 *                           lo guarda como blob PRIVADO y devuelve un enlace firmado que vence.
 *   GET  /api/cv?t=…      → verifica la firma y la fecha y entrega el archivo (no indexable).
 *
 * Variables de entorno (Vercel → Settings → Environment Variables):
 *   BLOB_READ_WRITE_TOKEN  la crea Vercel al conectar un Blob Store al proyecto.
 *   CV_LINK_SECRET         cadena aleatoria larga (p. ej. `openssl rand -hex 32`) para firmar los enlaces.
 * Sin ellas, la función responde 503 y el formulario pasa al flujo manual (adjuntar en el chat).
 */
import { get, put } from "@vercel/blob";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const MAX_BYTES = 4 * 1024 * 1024;
export const LINK_DAYS = 30;

const TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;
type Kind = keyof typeof TYPES;

/** Reconoce el formato por su contenido, no por el nombre ni el tipo declarado. */
export function detectKind(b: Uint8Array): Kind | null {
  if (b.length > 5 && String.fromCharCode(...b.subarray(0, 5)) === "%PDF-") return "pdf";
  const zip = b.length > 30 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;
  // Un DOCX es un ZIP con word/document.xml (los nombres de las entradas no van comprimidos).
  if (zip && Buffer.from(b.buffer, b.byteOffset, b.byteLength).includes("word/document.xml")) return "docx";
  return null;
}

const b64 = (s: string | Buffer) => Buffer.from(s).toString("base64url");
const mac = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function signLink(pathname: string, expires: number, secret: string): string {
  const payload = b64(JSON.stringify({ p: pathname, e: expires }));
  return `${payload}.${mac(payload, secret)}`;
}

export function verifyLink(token: string, secret: string, now = Date.now()): string | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const want = Buffer.from(mac(payload, secret));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const { p, e } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof p !== "string" || !p.startsWith("cv/") || typeof e !== "number" || e < now) return null;
    return p;
  } catch {
    return null;
  }
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
  });

const config = () => {
  const secret = process.env.CV_LINK_SECRET;
  return process.env.BLOB_READ_WRITE_TOKEN && secret && secret.length >= 16 ? { secret } : null;
};

export async function POST(request: Request): Promise<Response> {
  const cfg = config();
  if (!cfg) return json(503, { error: "not-configured" });
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES) return json(413, { error: "too-large" });

  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.length === 0) return json(400, { error: "empty" });
  if (bytes.length > MAX_BYTES) return json(413, { error: "too-large" });
  const kind = detectKind(bytes);
  if (!kind) return json(415, { error: "unsupported-type" });

  try {
    const blob = await put(`cv/${randomUUID()}.${kind}`, Buffer.from(bytes), {
      access: "private",
      contentType: TYPES[kind],
      addRandomSuffix: true,
    });
    const expires = Date.now() + LINK_DAYS * 864e5;
    const url = `${new URL(request.url).origin}/api/cv?t=${signLink(blob.pathname, expires, cfg.secret)}`;
    return json(201, { url, expires, days: LINK_DAYS });
  } catch (err) {
    console.error("cv upload failed:", err instanceof Error ? err.message : "unknown");
    return json(502, { error: "storage-failed" });
  }
}

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const cfg = config();
  if (params.has("status")) return json(200, { ready: Boolean(cfg), maxBytes: MAX_BYTES });
  if (!cfg) return json(503, { error: "not-configured" });

  const pathname = verifyLink(params.get("t") ?? "", cfg.secret);
  if (!pathname) return json(403, { error: "invalid-or-expired" });
  const found = await get(pathname, { access: "private" });
  if (!found || found.statusCode !== 200) return json(404, { error: "not-found" });
  const ext = pathname.endsWith(".pdf") ? "pdf" : "docx";
  return new Response(found.stream, {
    headers: {
      "content-type": found.blob.contentType,
      "content-disposition": `attachment; filename="CV-CEPROC.${ext}"`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
    },
  });
}
