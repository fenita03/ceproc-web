import { ArrowLeft } from "@phosphor-icons/react/dist/csr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { ChatCircle } from "@phosphor-icons/react/dist/csr/ChatCircle";
import { Check } from "@phosphor-icons/react/dist/csr/Check";
import { CircleNotch } from "@phosphor-icons/react/dist/csr/CircleNotch";
import { Copy } from "@phosphor-icons/react/dist/csr/Copy";
import { FileText } from "@phosphor-icons/react/dist/csr/FileText";
import { Paperclip } from "@phosphor-icons/react/dist/csr/Paperclip";
import { PencilSimple } from "@phosphor-icons/react/dist/csr/PencilSimple";
import { WarningCircle } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { EnrollPreset } from "../hooks/enroll";
import {
  CV_ACCEPT,
  LIMITS,
  UNDECIDED,
  areaChoices,
  buildMessage,
  checkCv,
  emptyAnswers,
  experiencias,
  horarios,
  isValidEmail,
  isValidPhone,
  objetivos,
  sanitizeAnswers,
  summarySections,
  whatsappHref,
  workshopsOf,
  type Answers,
  type Choice,
  type CvStatus,
} from "../content/wizard";
import styles from "./TrainingWizard.module.css";

/**
 * «Capacitate con nosotros»: asistente paso a paso adaptado de «Contanos tu proyecto» (NOVEX,
 * src/pages/ProjectWizard.tsx). Misma lógica: una pregunta por paso, pasos opcionales con «Omitir»,
 * revisión con «Editar», respuestas en sessionStorage (saneadas) y envío por WhatsApp sin confirmar
 * nada que no ocurrió. Se abre a pantalla completa sobre el sitio (CEPROC no tiene rutas).
 */

const STORAGE_KEY = "ceproc-asistente-v1";

type StepId = "area" | "taller" | "objetivo" | "perfil" | "contacto" | "cv" | "resumen";
const ALL_STEPS: StepId[] = ["area", "taller", "objetivo", "perfil", "contacto", "cv", "resumen"];
const OPTIONAL: StepId[] = ["taller", "objetivo", "perfil", "cv"];

const STEP_NAMES: Record<StepId, string> = {
  area: "Área",
  taller: "Talleres",
  objetivo: "Objetivo",
  perfil: "Experiencia",
  contacto: "Tus datos",
  cv: "CV",
  resumen: "Revisión",
};

const TITLE: Record<StepId, string> = {
  area: "¿Qué te gustaría aprender?",
  taller: "¿Qué talleres te interesan?",
  objetivo: "¿Qué buscás con la capacitación?",
  perfil: "Tu experiencia y horarios",
  contacto: "¿Cómo te contactamos?",
  cv: "¿Querés sumar tu CV?",
  resumen: "Revisá tu solicitud",
};

const WHY: Record<StepId, string> = {
  area: "Elegí un área. Si no estás seguro, te orientamos.",
  taller: "Podés marcar más de uno.",
  objetivo: "Nos ayuda a orientarte mejor.",
  perfil: "Los horarios son tu preferencia, no un turno confirmado.",
  contacto: "Solo lo necesario para responderte.",
  cv: "PDF o Word, hasta 4 MB.",
  resumen: "Así nos va a llegar. Podés editar cualquier parte.",
};

type SendState = "idle" | "sent" | "error";
type Storage = "checking" | "server" | "chat";
type Upload = { status: "idle" } | { status: "uploading" } | { status: "done"; url: string; days: number } | { status: "failed"; message: string };

function loadAnswers(): Answers {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return sanitizeAnswers(JSON.parse(raw));
  } catch {
    /* sin almacenamiento: se empieza de cero */
  }
  return emptyAnswers();
}

const fileSize = (n: number) => (n < 1048576 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1048576).toFixed(1)} MB`);

/* ─── Controles (OptionCard y Chip de NOVEX, con la identidad de CEPROC) ─── */
function OptionCard({ choice, type, name, checked, onChange }: { choice: Choice; type: "radio" | "checkbox"; name: string; checked: boolean; onChange: () => void }) {
  const Icon = choice.icon;
  return (
    <label className={styles.card} data-checked={checked}>
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      {Icon && (
        <span className={styles.cardIcon} aria-hidden="true">
          <Icon size={20} />
        </span>
      )}
      <span className={styles.cardText}>
        <span className={styles.cardLabel}>{choice.label}</span>
        {choice.hint && <span className={styles.cardHint}>{choice.hint}</span>}
      </span>
      <span className={styles.cardCheck} aria-hidden="true">
        <Check size={13} weight="bold" />
      </span>
    </label>
  );
}

function Chip({ label, type, name, checked, onChange }: { label: string; type: "radio" | "checkbox"; name: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={styles.chip} data-checked={checked}>
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className={styles.chipCheck} aria-hidden="true">
        <Check size={11} weight="bold" />
      </span>
      {label}
    </label>
  );
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className={styles.error} role="alert">
      <WarningCircle size={16} aria-hidden="true" />
      {children}
    </p>
  );
}

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label}
        {optional && <span className={styles.optional}>(opcional)</span>}
      </label>
      {children}
      {error && <ErrorLine id={`${id}-error`}>{error}</ErrorLine>}
    </div>
  );
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className={styles.group}>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
}

/* ─── Asistente ──────────────────────────────────────────── */
export default function TrainingWizard({
  open,
  preset,
  onClose,
}: {
  open: boolean;
  preset: EnrollPreset & { n: number };
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const sendingLock = useRef(false);

  const [answers, setAnswers] = useState<Answers>(loadAnswers);
  const [step, setStep] = useState<StepId>("area");
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [returnToSummary, setReturnToSummary] = useState(false);
  const [send, setSend] = useState<SendState>("idle");
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [storage, setStorage] = useState<Storage>("checking");
  const [upload, setUpload] = useState<Upload>({ status: "idle" });
  const [skipCv, setSkipCv] = useState(false);

  // El total queda fijo; sin un área concreta no hay talleres para elegir y ese paso se saltea.
  const steps = ALL_STEPS;
  const pos = steps.indexOf(step) + 1;
  const total = steps.length;
  const hasWorkshops = Boolean(answers.area && answers.area !== UNDECIDED);
  const after = (s: StepId) => {
    const n = steps[Math.min(steps.indexOf(s) + 1, total - 1)];
    return n === "taller" && !hasWorkshops ? "objetivo" : n;
  };
  const before = (s: StepId) => {
    const p = steps[Math.max(steps.indexOf(s) - 1, 0)];
    return p === "taller" && !hasWorkshops ? "area" : p;
  };

  /* Apertura y cierre del diálogo (Escape incluido) devolviendo el foco. */
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      returnTo.current = document.activeElement as HTMLElement | null;
      d.showModal();
      headingRef.current?.focus({ preventScroll: true });
    } else if (!open && d.open) d.close();
  }, [open]);

  // «Me interesa este taller»: llega con el área y el taller marcados.
  useEffect(() => {
    if (!preset.area) return;
    setAnswers((a) => ({ ...a, area: preset.area, talleres: preset.workshop ? [preset.workshop] : a.area === preset.area ? a.talleres : [] }));
    setStep("area");
    setSend("idle");
  }, [preset]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* sin almacenamiento: las respuestas viven en memoria */
    }
  }, [answers]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  // ¿Está configurado el almacenamiento privado del CV?
  useEffect(() => {
    if (!open || storage !== "checking") return;
    fetch("/api/cv?status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setStorage(j?.ready ? "server" : "chat"))
      .catch(() => setStorage("chat"));
  }, [open, storage]);

  const update = (patch: Partial<Answers>) => {
    setAnswers((a) => ({ ...a, ...patch }));
    setSend("idle");
  };
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const validate = (s: StepId): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === "area" && !answers.area) e.area = "Elegí un área o «Todavía no lo sé».";
    if (s === "objetivo" && answers.objetivo === "otro" && !answers.objetivoOtro?.trim()) e.objetivoOtro = "Contanos tu objetivo o elegí otra opción.";
    if (s === "contacto") {
      if (!answers.nombre?.trim()) e.nombre = "Escribí tu nombre.";
      if (!answers.telefono?.trim()) e.telefono = "Escribí un número de WhatsApp o teléfono.";
      else if (!isValidPhone(answers.telefono)) e.telefono = "Revisá el número: entre 8 y 15 dígitos, por ejemplo 264 512-3456.";
      if (answers.email?.trim() && !isValidEmail(answers.email)) e.email = "Revisá el correo: falta algo como nombre@correo.com.";
      if (!answers.consentimiento) e.consentimiento = "Necesitamos tu autorización para responderte.";
    }
    return e;
  };

  const goTo = (target: StepId, direction: "fwd" | "back") => {
    setDir(direction);
    setErrors({});
    setStep(target);
  };

  const cv: CvStatus = !file
    ? { kind: "none" }
    : upload.status === "done"
      ? { kind: "link", url: upload.url, days: upload.days }
      : skipCv
        ? { kind: "failed" }
        : { kind: "chat" };

  const doUpload = async (f: File) => {
    setUpload({ status: "uploading" });
    try {
      const r = await fetch("/api/cv", { method: "POST", headers: { "content-type": f.type || "application/octet-stream" }, body: f });
      const j = await r.json().catch(() => ({}));
      if (r.ok && typeof j.url === "string") {
        setUpload({ status: "done", url: j.url, days: j.days ?? 30 });
        return true;
      }
      if (r.status === 503) setStorage("chat");
      setUpload({
        status: "failed",
        message: r.status === 415 ? "El servidor no reconoció el archivo como PDF o Word." : r.status === 413 ? "El archivo supera los 4 MB." : "No se pudo subir el CV.",
      });
    } catch {
      setUpload({ status: "failed", message: "No se pudo subir el CV. Revisá tu conexión." });
    }
    return false;
  };

  const next = async () => {
    const e = validate(step);
    if (Object.keys(e).length) {
      setErrors(e);
      const first = Object.keys(e)[0];
      const el = document.getElementById(first) ?? document.getElementById(`${first}-error`);
      el?.scrollIntoView({ block: "center" });
      if (el instanceof HTMLInputElement) el.focus();
      return;
    }
    // El CV termina de subirse antes de pasar a la revisión: el enlace llega al mensaje solo si existe.
    if (step === "cv" && file && storage === "server" && upload.status !== "done" && !skipCv) {
      if (!(await doUpload(file))) return;
    }
    if (returnToSummary) {
      setReturnToSummary(false);
      goTo("resumen", "fwd");
      return;
    }
    goTo(after(step), "fwd");
  };
  const back = () => {
    if (returnToSummary) {
      setReturnToSummary(false);
      goTo("resumen", "back");
      return;
    }
    goTo(before(step), "back");
  };
  const editFrom = (s: string) => {
    setReturnToSummary(true);
    setSend("idle");
    goTo(s as StepId, "back");
  };

  const pickFile = async (f?: File | null) => {
    if (fileRef.current) fileRef.current.value = "";
    if (!f) return;
    const problem = await checkCv(f);
    setErrors((e) => {
      const rest = { ...e };
      delete rest.cv;
      return problem ? { ...rest, cv: problem } : rest;
    });
    if (problem) return;
    setFile(f);
    setUpload({ status: "idle" });
    setSkipCv(false);
    setSend("idle");
  };
  const removeFile = () => {
    setFile(null);
    setUpload({ status: "idle" });
    setSkipCv(false);
    setSend("idle");
  };

  const message = buildMessage(answers, cv);
  const href = whatsappHref(message);
  const sections = summarySections(answers, cv);

  const submit = () => {
    if (sendingLock.current) return; // evita envíos duplicados
    const pending = validate("contacto");
    if (Object.keys(pending).length) {
      editFrom("contacto");
      setErrors(pending);
      return;
    }
    sendingLock.current = true;
    const win = window.open(href, "_blank");
    if (win) {
      win.opener = null;
      setSend("sent");
    } else setSend("error");
    window.setTimeout(() => (sendingLock.current = false), 1500);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const restart = () => {
    setAnswers(emptyAnswers());
    removeFile();
    goTo("area", "back");
  };

  const canShareFile = !!file && typeof navigator !== "undefined" && !!navigator.canShare?.({ files: [file] });
  const uploading = upload.status === "uploading";

  const renderStep = () => {
    switch (step) {
      case "area":
        return (
          <div className={styles.stack}>
            <div role="radiogroup" aria-label="Área" className={styles.grid}>
              {areaChoices.map((c) => (
                <OptionCard key={c.id} choice={c} type="radio" name="area" checked={answers.area === c.id} onChange={() => update({ area: c.id, talleres: c.id === answers.area ? answers.talleres : [] })} />
              ))}
            </div>
            {errors.area && <ErrorLine id="area-error">{errors.area}</ErrorLine>}
          </div>
        );

      case "taller":
        return (
          <div className={styles.chips} role="group" aria-label="Talleres">
            {workshopsOf(answers.area).map((w) => (
              <Chip key={w} label={w} type="checkbox" name="talleres" checked={answers.talleres.includes(w)} onChange={() => update({ talleres: toggle(answers.talleres, w) })} />
            ))}
          </div>
        );

      case "objetivo":
        return (
          <div className={styles.stack}>
            <div role="radiogroup" aria-label="Objetivo" className={styles.grid}>
              {objetivos.map((c) => (
                <OptionCard key={c.id} choice={c} type="radio" name="objetivo" checked={answers.objetivo === c.id} onChange={() => update({ objetivo: c.id })} />
              ))}
            </div>
            {answers.objetivo === "otro" && (
              <Field id="objetivoOtro" label="¿Cuál es tu objetivo?" error={errors.objetivoOtro}>
                <input
                  id="objetivoOtro"
                  maxLength={LIMITS.objetivoOtro}
                  className={styles.input}
                  value={answers.objetivoOtro ?? ""}
                  onChange={(e) => update({ objetivoOtro: e.target.value })}
                  aria-invalid={Boolean(errors.objetivoOtro)}
                  aria-describedby={errors.objetivoOtro ? "objetivoOtro-error" : undefined}
                />
              </Field>
            )}
          </div>
        );

      case "perfil":
        return (
          <div className={styles.stackLg}>
            <Group legend="¿Tenés experiencia en esta área?">
              <div className={styles.chips} role="radiogroup" aria-label="Experiencia">
                {experiencias.map((o) => (
                  <Chip key={o} label={o} type="radio" name="experiencia" checked={answers.experiencia === o} onChange={() => update({ experiencia: o })} />
                ))}
              </div>
            </Group>
            <Group legend="¿En qué horario podrías cursar?">
              <div className={styles.chips} role="group" aria-label="Horarios">
                {horarios.map((o) => (
                  <Chip key={o} label={o} type="checkbox" name="horarios" checked={answers.horarios.includes(o)} onChange={() => update({ horarios: toggle(answers.horarios, o) })} />
                ))}
              </div>
            </Group>
          </div>
        );

      case "contacto":
        return (
          <div className={styles.stackLg}>
            <div className={styles.fields}>
              <Field id="nombre" label="Nombre y apellido" error={errors.nombre}>
                <input id="nombre" maxLength={LIMITS.nombre} className={styles.input} autoComplete="name" value={answers.nombre ?? ""} onChange={(e) => update({ nombre: e.target.value })} aria-invalid={Boolean(errors.nombre)} aria-describedby={errors.nombre ? "nombre-error" : undefined} />
              </Field>
              <Field id="telefono" label="WhatsApp o teléfono" error={errors.telefono}>
                <input id="telefono" maxLength={LIMITS.telefono} type="tel" inputMode="tel" className={styles.input} autoComplete="tel" value={answers.telefono ?? ""} onChange={(e) => update({ telefono: e.target.value })} placeholder="Ej.: 264 512-3456" aria-invalid={Boolean(errors.telefono)} aria-describedby={errors.telefono ? "telefono-error" : undefined} />
              </Field>
              <Field id="email" label="Correo electrónico" optional error={errors.email}>
                <input id="email" maxLength={LIMITS.email} type="email" inputMode="email" className={styles.input} autoComplete="email" value={answers.email ?? ""} onChange={(e) => update({ email: e.target.value })} placeholder="nombre@correo.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
              </Field>
            </div>
            <Field id="adicional" label="¿Algo más que quieras contarnos?" optional>
              <textarea id="adicional" maxLength={LIMITS.adicional} rows={3} className={styles.input} value={answers.adicional ?? ""} onChange={(e) => update({ adicional: e.target.value })} />
            </Field>
            <div className={styles.field}>
              <label className={styles.consent} data-checked={Boolean(answers.consentimiento)}>
                <input id="consentimiento" type="checkbox" checked={Boolean(answers.consentimiento)} onChange={(e) => update({ consentimiento: e.target.checked })} aria-invalid={Boolean(errors.consentimiento)} aria-describedby={errors.consentimiento ? "consentimiento-error" : undefined} />
                <span>Autorizo a CEPROC a usar estos datos (y mi CV, si lo sumo) solo para responder mi consulta. La solicitud se envía por WhatsApp.</span>
              </label>
              {errors.consentimiento && <ErrorLine id="consentimiento-error">{errors.consentimiento}</ErrorLine>}
            </div>
          </div>
        );

      case "cv":
        return (
          <div className={styles.stack}>
            <input ref={fileRef} id="cv" type="file" accept={CV_ACCEPT} className="sr-only" tabIndex={-1} aria-label="Elegir CV" onChange={(e) => pickFile(e.target.files?.[0])} />
            {file ? (
              <div className={styles.file}>
                <span className={styles.cardIcon} aria-hidden="true">
                  <FileText size={20} />
                </span>
                <span className={styles.cardText}>
                  <span className={styles.cardLabel}>{file.name}</span>
                  <span className={styles.cardHint} aria-live="polite">
                    {fileSize(file.size)} ·{" "}
                    {uploading ? "Subiendo…" : upload.status === "done" ? "Subido" : skipCv ? "No se adjunta" : storage === "server" ? "Se sube al continuar" : "Lo adjuntás en el chat de WhatsApp"}
                  </span>
                </span>
                <span className={styles.fileActions}>
                  <button type="button" className={styles.textBtn} onClick={() => fileRef.current?.click()} disabled={uploading}>
                    Cambiar
                  </button>
                  <button type="button" className={styles.textBtn} onClick={removeFile} disabled={uploading}>
                    Quitar
                  </button>
                </span>
              </div>
            ) : (
              <button type="button" className={styles.drop} onClick={() => fileRef.current?.click()} aria-describedby={errors.cv ? "cv-error" : undefined}>
                <Paperclip size={22} aria-hidden="true" />
                <span>Elegir archivo</span>
              </button>
            )}
            {errors.cv && <ErrorLine id="cv-error">{errors.cv}</ErrorLine>}
            {upload.status === "failed" && (
              <div role="alert" className={styles.state} data-state="error">
                <WarningCircle size={20} aria-hidden="true" />
                <div>
                  <p>{upload.message}</p>
                  <div className={styles.stateActions}>
                    <button type="button" className={styles.textBtn} onClick={() => file && void doUpload(file)}>
                      Reintentar
                    </button>
                    <button type="button" className={styles.textBtn} onClick={() => (setSkipCv(true), setUpload({ status: "idle" }))}>
                      Seguir sin el CV
                    </button>
                  </div>
                </div>
              </div>
            )}
            {storage === "server" && !file && <p className={styles.note}>Se guarda de forma privada y nos llega como enlace.</p>}
          </div>
        );

      case "resumen":
        return (
          <div className={styles.stack}>
            {sections.map((s) => (
              <section key={s.id} aria-labelledby={`res-${s.id}`} className={styles.summary}>
                <div className={styles.summaryHead}>
                  <h3 id={`res-${s.id}`}>{s.title}</h3>
                  <button type="button" onClick={() => editFrom(s.step)} className={styles.editBtn} aria-label={`Editar: ${s.title}`}>
                    <PencilSimple size={14} aria-hidden="true" />
                    Editar
                  </button>
                </div>
                <ul>
                  {s.items.map((it, i) => (
                    <li key={i}>
                      {it.label && <span className={styles.summaryLabel}>{it.label}: </span>}
                      <span>{it.value}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {send === "sent" && (
              <div role="status" className={styles.state} data-state="sent">
                <Check size={20} aria-hidden="true" />
                <div>
                  <p>
                    Abrimos WhatsApp con tu solicitud. <strong>Para que nos llegue, tocá Enviar en WhatsApp.</strong>
                    {cv.kind === "chat" && " Y adjuntá tu CV en el chat."}
                  </p>
                  {cv.kind === "chat" && canShareFile && (
                    <button type="button" className={styles.textBtn} onClick={() => navigator.share({ files: [file!] }).catch(() => undefined)}>
                      Compartir el CV
                    </button>
                  )}
                </div>
              </div>
            )}
            {send === "error" && (
              <div role="alert" className={styles.state} data-state="error">
                <WarningCircle size={20} aria-hidden="true" />
                <p>
                  Tu navegador no dejó abrir WhatsApp.{" "}
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    Abrí este enlace
                  </a>{" "}
                  o copiá la solicitud.
                </p>
              </div>
            )}
            <button type="button" onClick={restart} className={styles.restart}>
              Empezar de nuevo
            </button>
          </div>
        );
    }
  };

  const isOptional = OPTIONAL.includes(step);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="wizard-title"
      onClose={() => {
        onClose();
        returnTo.current?.focus?.();
      }}
      onCancel={(e) => uploading && e.preventDefault()}
    >
      <div ref={scrollRef} className={styles.scroll}>
        <div className={styles.wrap}>
          <div className={styles.top}>
            <button type="button" className={styles.back} onClick={() => dialogRef.current?.close()} disabled={uploading}>
              <ArrowLeft size={16} aria-hidden="true" />
              Volver al sitio
            </button>
            <p className={styles.counter}>
              Paso {pos} de {total} · <span>{STEP_NAMES[step]}</span>
            </p>
          </div>
          <div
            className={styles.progress}
            role="progressbar"
            aria-label="Progreso"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={pos}
            aria-valuetext={`Paso ${pos} de ${total}: ${STEP_NAMES[step]}`}
          >
            <span style={{ transform: `scaleX(${pos / total})` }} />
          </div>

          <div key={step} className={styles.step} data-dir={dir}>
            <h2 id="wizard-title" ref={headingRef} tabIndex={-1} className={styles.title}>
              {TITLE[step]}
            </h2>
            <p className={styles.why}>
              {WHY[step]}
              {isOptional && " Es opcional."}
            </p>
            <div className={styles.body}>{renderStep()}</div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.actionsInner}>
          {step === "resumen" ? (
            <>
              <button type="button" onClick={back} className={`btn btn-ghost ${styles.iconBtn}`} aria-label="Anterior: volver al CV">
                <ArrowLeft size={18} aria-hidden="true" />
                <span className={styles.hideXs}>Anterior</span>
              </button>
              <button type="button" onClick={copy} className={`btn btn-ghost ${styles.iconBtn}`}>
                {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                <span aria-live="polite" className={styles.hideXs}>
                  {copied ? "Copiada" : "Copiar"}
                </span>
                {!copied && <span className="sr-only">la solicitud</span>}
              </button>
              <button type="button" onClick={submit} className={`btn btn-gold ${styles.primary}`} data-testid="enviar-whatsapp">
                <ChatCircle size={18} aria-hidden="true" />
                {send === "sent" ? "Abrir WhatsApp de nuevo" : "Enviar por WhatsApp"}
              </button>
            </>
          ) : (
            <>
              {pos > 1 && (
                <button type="button" onClick={back} className={`btn btn-ghost ${styles.iconBtn}`} aria-label={returnToSummary ? "Volver a la revisión" : "Anterior"} disabled={uploading}>
                  <ArrowLeft size={18} aria-hidden="true" />
                  <span className={styles.hideXs}>{returnToSummary ? "Revisión" : "Anterior"}</span>
                </button>
              )}
              {isOptional && !returnToSummary && (
                <button
                  type="button"
                  onClick={() => {
                    if (step === "cv") removeFile(); // omitir el CV es no enviarlo
                    goTo(after(step), "fwd");
                  }}
                  className={styles.skip}
                  disabled={uploading}
                >
                  Omitir
                </button>
              )}
              <button type="button" onClick={() => void next()} className={`btn btn-gold ${styles.primary}`} disabled={uploading} aria-busy={uploading}>
                {uploading ? <CircleNotch size={18} className={styles.spin} aria-hidden="true" /> : null}
                {uploading ? "Subiendo CV…" : returnToSummary ? "Guardar" : step === "cv" ? "Revisar solicitud" : "Continuar"}
                {!uploading && <ArrowRight size={18} aria-hidden="true" />}
              </button>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
