/**
 * «Capacitate con nosotros» — configuración única del formulario y del envío por WhatsApp.
 *
 * Número: el teléfono oficial de CEPROC (contact.phone), confirmado por el responsable del sitio
 * como línea de WhatsApp. Formato internacional de celular argentino: 54 9 + área + número.
 * Se puede reemplazar sin tocar código con la variable VITE_WHATSAPP_NUMBER (solo dígitos).
 */
import { areas, contact } from "./ceproc";

export const WHATSAPP_NUMBER: string = (import.meta.env.VITE_WHATSAPP_NUMBER || `549${contact.phone}`).replace(/\D/g, "");

/** Límite del CV: las funciones de Vercel aceptan cuerpos de hasta 4,5 MB; el servidor valida lo mismo. */
export const CV_MAX_BYTES = 4 * 1024 * 1024;
export const CV_ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const CV_LINK_DAYS = 30;

export const UNDECIDED = "Todavía no lo tengo decidido";

export const objectives = [
  "Aprender un oficio desde cero",
  "Adquirir nuevas habilidades",
  "Mejorar mis oportunidades laborales",
  "Profundizar conocimientos que ya tengo",
  "Otro",
] as const;

export const experience = ["Sí", "No", "Tengo conocimientos básicos"] as const;

export const availability = ["Mañana", "Tarde", "Noche", "Horario flexible"] as const;

export const areaOptions = areas.map((a) => ({ id: a.id, label: a.label, workshops: a.workshops.map((w) => w.name) }));

export type EnrollData = {
  name: string;
  phone: string;
  email: string;
  area: string; // id del área
  workshop: string; // nombre del taller o UNDECIDED
  objective: string;
  objectiveOther: string;
  experience: string;
  availability: string[];
  comments: string;
};

export const emptyEnroll: EnrollData = {
  name: "",
  phone: "",
  email: "",
  area: "",
  workshop: UNDECIDED,
  objective: "",
  objectiveOther: "",
  experience: "",
  availability: [],
  comments: "",
};

/** Estado real del CV que se informa en el mensaje (nunca se afirma algo que no ocurrió). */
export type CvLine =
  | { kind: "none" }
  | { kind: "link"; url: string; days: number }
  | { kind: "manual" } // se adjunta a mano en el chat
  | { kind: "failed" }; // la carga falló y el usuario eligió seguir sin el CV

export const areaLabel = (id: string) => areas.find((a) => a.id === id)?.label ?? "";

export function buildMessage(d: EnrollData, cv: CvLine): string {
  const or = (v: string, fallback: string) => (v.trim() ? v.trim() : fallback);
  const objective = d.objective === "Otro" ? `Otro: ${d.objectiveOther.trim()}` : d.objective;
  const cvText = {
    none: "No adjunto currículum.",
    link: cv.kind === "link" ? `Enlace privado para descargarlo (vence en ${cv.days} días): ${cv.url}` : "",
    manual: "Tengo un currículum y lo adjunto en este chat.",
    failed: "Tengo un currículum, pero no se pudo subir desde el sitio. Puedo enviarlo por este chat si lo necesitan.",
  }[cv.kind];

  return [
    "SOLICITUD DE INFORMACIÓN — CEPROC",
    "",
    "Hola, quiero recibir información sobre las capacitaciones de CEPROC.",
    "",
    "DATOS PERSONALES",
    `Nombre y apellido: ${d.name.trim()}`,
    `WhatsApp: ${d.phone.trim()}`,
    `Correo electrónico: ${or(d.email, "No proporcionado")}`,
    "",
    "INTERESES FORMATIVOS",
    `Área de interés: ${areaLabel(d.area)}`,
    `Capacitación elegida: ${d.workshop}`,
    `Objetivo principal: ${objective}`,
    `Experiencia previa: ${d.experience}`,
    `Disponibilidad: ${d.availability.join(", ")}`,
    "",
    "COMENTARIOS",
    or(d.comments, "Sin comentarios adicionales."),
    "",
    "CURRÍCULUM VITAE",
    cvText,
    "",
    "Quedo a disposición para recibir información sobre las opciones de formación disponibles. Muchas gracias.",
  ].join("\n");
}

export const whatsappUrl = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/** Consulta general (sin formulario): abre el chat con un saludo editable. */
export const generalInquiryUrl = whatsappUrl("Hola, quiero hacer una consulta a CEPROC.");

/* ------------------------------------------------------------------ Validación */

export type Errors = Partial<Record<keyof EnrollData | "consent" | "cv", string>>;

export function validateStep(step: number, d: EnrollData): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (d.name.trim().length < 3) e.name = "Escribí tu nombre y apellido.";
    const digits = d.phone.replace(/\D/g, "");
    if (!digits) e.phone = "Escribí un número de teléfono o WhatsApp.";
    else if (digits.length < 8 || digits.length > 15) e.phone = "Revisá el número: debe tener entre 8 y 15 dígitos, con código de área.";
    if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = "Revisá el correo (ejemplo: nombre@correo.com) o dejalo vacío.";
  }
  if (step === 1) {
    if (!d.area) e.area = "Elegí un área.";
    if (!d.objective) e.objective = "Elegí tu objetivo principal.";
    else if (d.objective === "Otro" && !d.objectiveOther.trim()) e.objectiveOther = "Contanos brevemente tu objetivo.";
    if (!d.experience) e.experience = "Elegí una opción.";
    if (!d.availability.length) e.availability = "Elegí al menos una franja.";
  }
  return e;
}

/** Valida el CV en el navegador (el servidor repite la validación). */
export async function checkCv(file: File): Promise<string | null> {
  const ext = file.name.toLowerCase().split(".").pop();
  if (ext !== "pdf" && ext !== "docx") return "El archivo debe ser PDF o DOCX.";
  if (file.size === 0) return "El archivo está vacío.";
  if (file.size > CV_MAX_BYTES) return `El archivo pesa ${(file.size / 1048576).toFixed(1)} MB; el máximo es ${CV_MAX_BYTES / 1048576} MB.`;
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const isPdf = String.fromCharCode(...head) === "%PDF-";
  const isZip = head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04;
  if ((ext === "pdf" && !isPdf) || (ext === "docx" && !isZip)) return "El archivo no parece un PDF o DOCX válido.";
  return null;
}
