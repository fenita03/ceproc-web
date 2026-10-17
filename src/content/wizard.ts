import { Bread } from "@phosphor-icons/react/dist/csr/Bread";
import { Briefcase } from "@phosphor-icons/react/dist/csr/Briefcase";
import { CookingPot } from "@phosphor-icons/react/dist/csr/CookingPot";
import { Hammer } from "@phosphor-icons/react/dist/csr/Hammer";
import { HardHat } from "@phosphor-icons/react/dist/csr/HardHat";
import { PaintBrush } from "@phosphor-icons/react/dist/csr/PaintBrush";
import { Plant } from "@phosphor-icons/react/dist/csr/Plant";
import { Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { Question } from "@phosphor-icons/react/dist/csr/Question";
import { ShieldCheck } from "@phosphor-icons/react/dist/csr/ShieldCheck";
import { Sparkle } from "@phosphor-icons/react/dist/csr/Sparkle";
import { Scissors } from "@phosphor-icons/react/dist/csr/Scissors";
import { TrendUp } from "@phosphor-icons/react/dist/csr/TrendUp";
import type { Icon } from "@phosphor-icons/react";
import { areas, contact } from "./ceproc";

/**
 * Asistente «Capacitate con nosotros».
 * Adaptado del asistente «Contanos tu proyecto» de NOVEX (src/data/wizard.ts): mismas reglas
 * de validación, saneamiento, resumen y armado del mensaje; preguntas propias de CEPROC.
 * Áreas y talleres salen de ceproc.ts: no se inventan opciones.
 */

/** Número de WhatsApp oficial (54 9 + área + número). Reemplazable con VITE_WHATSAPP_NUMBER. */
export const WHATSAPP_NUMBER: string = (import.meta.env.VITE_WHATSAPP_NUMBER || `549${contact.phone}`).replace(/\D/g, "");

export const whatsappHref = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
export const generalInquiryUrl = whatsappHref("Hola, CEPROC. Quiero hacer una consulta.");

export interface Choice {
  id: string;
  label: string;
  hint?: string;
  icon?: Icon;
}

/* 1 · Área */
export const UNDECIDED = "indeciso";
const areaIcons: Record<string, Icon> = {
  "mineros-1": HardHat,
  "mineros-2": ShieldCheck,
  regional: Bread,
  gastronomia: CookingPot,
  textil: Scissors,
  creativa: PaintBrush,
  oficios: Hammer,
};
export const areaChoices: Choice[] = [
  ...areas.map((a) => ({ id: a.id, label: a.label, hint: `${a.workshops.length} talleres`, icon: areaIcons[a.id] })),
  { id: UNDECIDED, label: "Todavía no lo sé", hint: "Te orientamos según tu perfil.", icon: Question },
];
export const workshopsOf = (areaId?: string) => areas.find((a) => a.id === areaId)?.workshops.map((w) => w.name) ?? [];

/* 3 · Objetivo */
export const objetivos: Choice[] = [
  { id: "cero", label: "Aprender un oficio desde cero", icon: Plant },
  { id: "habilidades", label: "Sumar nuevas habilidades", icon: Sparkle },
  { id: "trabajo", label: "Mejorar mis oportunidades laborales", icon: Briefcase },
  { id: "profundizar", label: "Profundizar lo que ya sé", icon: TrendUp },
  { id: "otro", label: "Otro objetivo", icon: Plus },
];

/* 4 · Experiencia y horarios */
export const experiencias = ["Sí", "No", "Tengo conocimientos básicos"];
export const horarios = ["Mañana", "Tarde", "Noche", "Horario flexible"];

/* ─── CV ─────────────────────────────────────────────────── */
/** Las funciones de Vercel aceptan cuerpos de hasta 4,5 MB; api/cv.ts valida lo mismo. */
export const CV_MAX_BYTES = 4 * 1024 * 1024;
export const CV_ACCEPT = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** Estado real del CV para el mensaje: nunca se afirma algo que no ocurrió. */
export type CvStatus = { kind: "none" } | { kind: "link"; url: string; days: number } | { kind: "chat" } | { kind: "failed" };

export async function checkCv(file: File): Promise<string | null> {
  const ext = file.name.toLowerCase().split(".").pop();
  if (ext !== "pdf" && ext !== "docx") return "Tiene que ser un PDF o un Word (.docx).";
  if (file.size === 0) return "El archivo está vacío.";
  if (file.size > CV_MAX_BYTES) return `Pesa ${(file.size / 1048576).toFixed(1)} MB; el máximo es 4 MB.`;
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const isPdf = String.fromCharCode(...head) === "%PDF-";
  const isZip = head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04;
  if ((ext === "pdf" && !isPdf) || (ext === "docx" && !isZip)) return "El archivo no parece un PDF o Word válido.";
  return null;
}

/* ─── Estado ─────────────────────────────────────────────── */
export interface Answers {
  area?: string;
  talleres: string[];
  objetivo?: string;
  objetivoOtro?: string;
  experiencia?: string;
  horarios: string[];
  nombre?: string;
  telefono?: string;
  email?: string;
  adicional?: string;
  consentimiento?: boolean;
}

export const emptyAnswers = (): Answers => ({ talleres: [], horarios: [] });

export const areaLabel = (id?: string) => areaChoices.find((a) => a.id === id)?.label;

export function objetivoLabel(a: Answers) {
  if (a.objetivo === "otro") return a.objetivoOtro?.trim() || undefined;
  return objetivos.find((o) => o.id === a.objetivo)?.label;
}

/** Talleres válidos para el área elegida (descarta los de otra área si cambió). */
export const talleresVigentes = (a: Answers) => a.talleres.filter((t) => workshopsOf(a.area).includes(t));

/* ─── Validación (misma regla que NOVEX) ─────────────────── */
export const digits = (s = "") => s.replace(/\D/g, "");
export const isValidPhone = (s = "") => /^\+?[\d\s().-]+$/.test(s.trim()) && digits(s).length >= 8 && digits(s).length <= 15;
export const isValidEmail = (s = "") => s.trim().length <= LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

export const LIMITS = { objetivoOtro: 100, nombre: 80, telefono: 25, email: 120, adicional: 600 } as const;

/** Quita caracteres de control y de dirección de texto y recorta al máximo (NOVEX). */
export function cleanText(value: unknown, max: number, multiline = false): string {
  if (typeof value !== "string") return "";
  // eslint-disable-next-line no-control-regex -- se buscan caracteres de control a propósito, para quitarlos
  const control = multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return value.replace(control, "").replace(/[‎‏‪-‮⁦-⁩]/g, "").slice(0, max);
}

const oneOf = (value: unknown, allowed: readonly string[]) =>
  typeof value === "string" && allowed.includes(value) ? value : undefined;

/** Reconstruye lo guardado en sessionStorage aceptando solo valores conocidos (entrada no confiable). */
export function sanitizeAnswers(raw: unknown): Answers {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const allWorkshops = areas.flatMap((a) => a.workshops.map((w) => w.name));
  const list = (v: unknown, allowed: string[]) => (Array.isArray(v) ? v.filter((x): x is string => oneOf(x, allowed) !== undefined) : []);
  return {
    area: oneOf(r.area, areaChoices.map((x) => x.id)),
    talleres: list(r.talleres, allWorkshops),
    objetivo: oneOf(r.objetivo, objetivos.map((x) => x.id)),
    objetivoOtro: cleanText(r.objetivoOtro, LIMITS.objetivoOtro),
    experiencia: oneOf(r.experiencia, experiencias),
    horarios: list(r.horarios, horarios),
    nombre: cleanText(r.nombre, LIMITS.nombre),
    telefono: cleanText(r.telefono, LIMITS.telefono),
    email: cleanText(r.email, LIMITS.email),
    adicional: cleanText(r.adicional, LIMITS.adicional, true),
    consentimiento: r.consentimiento === true,
  };
}

/* ─── Resumen y mensaje ──────────────────────────────────── */
export interface SummarySection {
  id: string;
  title: string;
  step: string;
  items: { label?: string; value: string }[];
}

export function cvText(cv: CvStatus): string {
  switch (cv.kind) {
    case "link":
      return `Enlace privado (vence en ${cv.days} días): ${cv.url}`;
    case "chat":
      return "Lo adjunto en este chat.";
    case "failed":
      return "No se pudo subir; puedo enviarlo por este chat.";
    default:
      return "";
  }
}

export function summarySections(a: Answers, cv: CvStatus): SummarySection[] {
  const sections: SummarySection[] = [
    {
      id: "interes",
      title: "Qué quiero aprender",
      step: "area",
      items: [
        { label: "Área", value: areaLabel(a.area) ?? "" },
        { label: "Talleres", value: talleresVigentes(a).join(", ") },
      ],
    },
    {
      id: "perfil",
      title: "Mi perfil",
      step: "objetivo",
      items: [
        { label: "Objetivo", value: objetivoLabel(a) ?? "" },
        { label: "Experiencia previa", value: a.experiencia ?? "" },
        { label: "Horarios posibles", value: a.horarios.join(", ") },
      ],
    },
    {
      id: "contacto",
      title: "Contacto",
      step: "contacto",
      items: [
        { label: "Nombre", value: a.nombre?.trim() ?? "" },
        { label: "WhatsApp o teléfono", value: a.telefono?.trim() ?? "" },
        { label: "Correo", value: a.email?.trim() ?? "" },
        { label: "Comentarios", value: a.adicional?.trim() ?? "" },
      ],
    },
    { id: "cv", title: "Currículum", step: "cv", items: [{ value: cvText(cv) }] },
  ];
  return sections.map((s) => ({ ...s, items: s.items.filter((i) => i.value) })).filter((s) => s.items.length);
}

/** Mensaje ordenado para CEPROC, con el mismo formato que NOVEX (títulos en negrita de WhatsApp). */
export function buildMessage(a: Answers, cv: CvStatus): string {
  const lines = ["Hola, CEPROC. Quiero recibir información sobre las capacitaciones."];
  for (const s of summarySections(a, cv)) {
    lines.push("", `*${s.title.toUpperCase()}*`);
    for (const it of s.items) {
      const value = cleanText(it.value, LIMITS.adicional, true);
      lines.push(it.label ? `- ${it.label}: ${value}` : `- ${value}`);
    }
  }
  lines.push("", "Muchas gracias.");
  return lines.join("\n");
}
