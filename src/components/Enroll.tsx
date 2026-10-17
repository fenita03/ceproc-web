import { ArrowLeft } from "@phosphor-icons/react/dist/csr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { Check } from "@phosphor-icons/react/dist/csr/Check";
import { FileText } from "@phosphor-icons/react/dist/csr/FileText";
import { Paperclip } from "@phosphor-icons/react/dist/csr/Paperclip";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import { X } from "@phosphor-icons/react/dist/csr/X";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { contact } from "../content/ceproc";
import {
  CV_ACCEPT,
  CV_LINK_DAYS,
  CV_MAX_BYTES,
  UNDECIDED,
  areaLabel,
  areaOptions,
  availability,
  buildMessage,
  checkCv,
  emptyEnroll,
  experience,
  objectives,
  validateStep,
  whatsappUrl,
  type CvLine,
  type EnrollData,
  type Errors,
} from "../content/enroll";
import type { EnrollPreset } from "../hooks/enroll";
import styles from "./Enroll.module.css";

const STEPS = ["Tus datos", "Tus intereses", "CV y envío"] as const;

type Storage = "checking" | "server" | "manual";
type Upload =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "done"; url: string; days: number }
  | { status: "failed"; message: string };
type Done = { message: string; url: string; opened: boolean; cv: CvLine["kind"] };

const size = (n: number) => (n < 1048576 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1048576).toFixed(1)} MB`);

/**
 * «Capacitate con nosotros»: acceso flotante + diálogo de tres pasos. Las respuestas se arman en el
 * navegador y se envían por WhatsApp al número oficial; el CV (opcional) se sube a un almacenamiento
 * privado y viaja como enlace firmado. Si el almacenamiento no está configurado, se explica cómo
 * adjuntarlo en el chat. Nunca se informa un envío que no ocurrió.
 */
export default function Enroll({
  open,
  preset,
  returnTo,
  onClose,
}: {
  open: boolean;
  preset: EnrollPreset & { n: number };
  returnTo: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<EnrollData>(emptyEnroll);
  const [errors, setErrors] = useState<Errors>({});
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [storage, setStorage] = useState<Storage>("checking");
  const [upload, setUpload] = useState<Upload>({ status: "idle" });
  const [skipCv, setSkipCv] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof EnrollData>(k: K, v: EnrollData[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
    if (done) setDone(null);
  };

  // Área y taller preelegidos (p. ej. desde «Me interesa este taller»).
  useEffect(() => {
    if (!preset.area) return;
    setData((d) => ({ ...d, area: preset.area!, workshop: preset.workshop ?? UNDECIDED }));
    setDone(null);
  }, [preset]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      headingRef.current?.focus();
    } else if (!open && d.open) d.close();
  }, [open]);

  // ¿Está configurado el almacenamiento del CV? (se consulta una vez, al abrir por primera vez)
  useEffect(() => {
    if (!open || storage !== "checking") return;
    fetch("/api/cv?status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setStorage(j?.ready ? "server" : "manual"))
      .catch(() => setStorage("manual"));
  }, [open, storage]);

  // Al cambiar de paso, el foco va al título del paso (lectores de pantalla y teclado).
  useEffect(() => {
    if (open) headingRef.current?.focus({ preventScroll: true });
    formRef.current?.scrollTo({ top: 0 });
  }, [step, done, open]);

  const close = onClose;
  const onClosed = () => {
    onClose();
    returnTo.current?.focus?.();
  };

  const focusFirstError = () =>
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  const next = () => {
    const e = validateStep(step, data);
    setErrors(e);
    if (Object.values(e).some(Boolean)) return focusFirstError();
    setStep((s) => s + 1);
  };

  const pickFile = async (f: File | null | undefined) => {
    if (fileRef.current) fileRef.current.value = "";
    if (!f) return;
    const problem = await checkCv(f);
    setErrors((e) => ({ ...e, cv: problem ?? undefined }));
    if (problem) return;
    setFile(f);
    setUpload({ status: "idle" });
    setSkipCv(false);
    setDone(null);
  };
  const removeFile = () => {
    setFile(null);
    setUpload({ status: "idle" });
    setSkipCv(false);
    setErrors((e) => ({ ...e, cv: undefined }));
    setDone(null);
  };

  const cvLine = (): CvLine => {
    if (!file) return { kind: "none" };
    if (upload.status === "done") return { kind: "link", url: upload.url, days: upload.days };
    if (skipCv) return { kind: "failed" };
    return { kind: "manual" };
  };

  const doUpload = async (f: File) => {
    setUpload({ status: "uploading" });
    try {
      const r = await fetch("/api/cv", {
        method: "POST",
        headers: { "content-type": f.type || "application/octet-stream" },
        body: f,
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && typeof j.url === "string") {
        setUpload({ status: "done", url: j.url, days: j.days ?? CV_LINK_DAYS });
        return;
      }
      if (r.status === 503) setStorage("manual");
      const message =
        r.status === 413
          ? `El archivo supera el máximo de ${CV_MAX_BYTES / 1048576} MB.`
          : r.status === 415
            ? "El servidor no reconoció el archivo como PDF o DOCX válido."
            : r.status === 503
              ? "La carga de archivos no está disponible en este momento."
              : "No se pudo subir el CV. Revisá tu conexión e intentá de nuevo.";
      setUpload({ status: "failed", message });
    } catch {
      setUpload({ status: "failed", message: "No se pudo subir el CV. Revisá tu conexión e intentá de nuevo." });
    }
  };

  const submit = async () => {
    const e: Errors = { ...validateStep(0, data), ...validateStep(1, data) };
    if (Object.values(e).some(Boolean)) {
      setStep(e.name || e.phone || e.email ? 0 : 1);
      setErrors(e);
      return focusFirstError();
    }
    if (!consent) {
      setErrors({ consent: "Para enviar tu solicitud necesitamos tu autorización." });
      return focusFirstError();
    }

    // Con almacenamiento disponible, el CV termina de subirse antes de armar el mensaje.
    // WhatsApp se abre después con un toque del usuario (los navegadores bloquean ventanas abiertas tras una espera).
    if (file && storage === "server" && upload.status !== "done" && !skipCv) {
      await doUpload(file); // si sale bien, aparece el botón final que abre WhatsApp
      return;
    }
    const line = cvLine();
    const message = buildMessage(data, line);
    const url = whatsappUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
    setDone({ message, url, opened: true, cv: line.kind });
  };

  // Tras una subida correcta, el mensaje queda listo para abrir con un toque.
  const readyMessage = upload.status === "done" && consent && !done ? buildMessage(data, cvLine()) : null;
  const readyAfterUpload = readyMessage ? { message: readyMessage, url: whatsappUrl(readyMessage) } : null;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const canShareFile = typeof navigator !== "undefined" && !!file && !!navigator.canShare?.({ files: [file] });
  const area = areaOptions.find((a) => a.id === data.area);
  const busy = upload.status === "uploading";

  return (
    <>
      <dialog
        ref={dialogRef}
        className={`on-paper ${styles.dialog}`}
        aria-labelledby="enroll-title"
        aria-describedby="enroll-intro"
        onClose={onClosed}
        onCancel={(ev) => {
          if (busy) ev.preventDefault();
        }}
      >
        <header className={styles.top}>
          <div>
            <p className={`eyebrow ${styles.kicker}`}>CEPROC · Inscripción de interés</p>
            <h2 id="enroll-title" className={styles.title}>
              Capacitate con nosotros
            </h2>
          </div>
          <button type="button" className={styles.close} onClick={close} aria-label="Cerrar" disabled={busy}>
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form
          ref={formRef}
          className={styles.body}
          noValidate
          onSubmit={(ev) => {
            ev.preventDefault();
            if (step < 2) next();
            else void submit();
          }}
        >
          {done ? (
            <DonePanel
              done={done}
              headingRef={headingRef}
              file={file}
              canShareFile={canShareFile}
              copied={copied}
              onCopy={() => copy(done.message)}
              onEdit={() => {
                setDone(null);
                setStep(2);
              }}
            />
          ) : (
            <>
              <p id="enroll-intro" className={styles.intro}>
                Queremos conocer tus intereses para orientarte sobre las oportunidades de formación de CEPROC. Completá tus
                datos y contanos qué área te gustaría explorar.
              </p>

              <ol className={styles.progress} aria-label="Pasos">
                {STEPS.map((s, i) => (
                  <li key={s} data-state={i < step ? "done" : i === step ? "current" : "next"} aria-current={i === step ? "step" : undefined}>
                    <span className={styles.bar} aria-hidden="true" />
                    <span className={styles.stepName}>
                      <span className="sr-only">{i < step ? "Completado: " : ""}</span>
                      {i + 1}. {s}
                    </span>
                  </li>
                ))}
              </ol>

              <h3 ref={headingRef} tabIndex={-1} className={styles.stepTitle}>
                Paso {step + 1} de {STEPS.length}: {STEPS[step]}
              </h3>

              {step === 0 && (
                <div className={styles.fields}>
                  <Field label="Nombre y apellido" error={errors.name}>
                    {(p) => <input {...p} type="text" autoComplete="name" value={data.name} onChange={(e) => set("name", e.target.value)} maxLength={80} />}
                  </Field>
                  <Field label="Teléfono o WhatsApp" hint="Con código de área, por ejemplo 264 512-3456." error={errors.phone}>
                    {(p) => <input {...p} type="tel" inputMode="tel" autoComplete="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} maxLength={24} />}
                  </Field>
                  <Field label="Correo electrónico" optional error={errors.email}>
                    {(p) => <input {...p} type="email" inputMode="email" autoComplete="email" value={data.email} onChange={(e) => set("email", e.target.value)} maxLength={120} />}
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className={styles.fields}>
                  <Field label="¿Qué área te interesa?" error={errors.area}>
                    {(p) => (
                      <select
                        {...p}
                        value={data.area}
                        onChange={(e) => {
                          set("area", e.target.value);
                          set("workshop", UNDECIDED);
                        }}
                      >
                        <option value="" disabled>
                          Elegí un área
                        </option>
                        {areaOptions.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <Field label="¿Qué capacitación te gustaría realizar?" hint={area ? `${area.workshops.length} talleres en ${area.label}.` : "Primero elegí un área."}>
                    {(p) => (
                      <select {...p} value={data.workshop} disabled={!area} onChange={(e) => set("workshop", e.target.value)}>
                        <option value={UNDECIDED}>{UNDECIDED}</option>
                        {area?.workshops.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <Choices
                    legend="¿Cuál es tu objetivo principal?"
                    type="radio"
                    name="objective"
                    options={objectives}
                    value={[data.objective]}
                    error={errors.objective}
                    onChange={(v) => set("objective", v)}
                  />
                  {data.objective === "Otro" && (
                    <Field label="Contanos tu objetivo" error={errors.objectiveOther}>
                      {(p) => <input {...p} type="text" value={data.objectiveOther} onChange={(e) => set("objectiveOther", e.target.value)} maxLength={140} />}
                    </Field>
                  )}
                  <Choices
                    legend="¿Tenés experiencia previa en esa área?"
                    type="radio"
                    name="experience"
                    options={experience}
                    value={[data.experience]}
                    error={errors.experience}
                    onChange={(v) => set("experience", v)}
                  />
                  <Choices
                    legend="¿Qué disponibilidad tenés?"
                    hint="Es tu preferencia para orientarte; no confirma horarios de cursada."
                    type="checkbox"
                    name="availability"
                    options={availability}
                    value={data.availability}
                    error={errors.availability}
                    onChange={(v) =>
                      set("availability", data.availability.includes(v) ? data.availability.filter((x) => x !== v) : [...availability].filter((x) => x === v || data.availability.includes(x)))
                    }
                  />
                </div>
              )}

              {step === 2 && (
                <div className={styles.fields}>
                  <CvField
                    file={file}
                    storage={storage}
                    upload={upload}
                    skipCv={skipCv}
                    error={errors.cv}
                    fileRef={fileRef}
                    onPick={pickFile}
                    onRemove={removeFile}
                    onRetry={() => file && void doUpload(file)}
                    onSkip={() => {
                      setSkipCv(true);
                      setUpload({ status: "idle" });
                    }}
                  />

                  <Field label="Comentarios" optional hint="Cualquier dato que quieras sumar.">
                    {(p) => <textarea {...p} rows={3} value={data.comments} onChange={(e) => set("comments", e.target.value)} maxLength={600} />}
                  </Field>

                  <Review data={data} onEdit={(s) => setStep(s)} />

                  <details className={styles.privacy}>
                    <summary>Cómo usamos tus datos</summary>
                    <p>
                      Usamos tus respuestas solo para responder tu consulta y orientarte sobre las capacitaciones de CEPROC. El sitio no
                      guarda tus respuestas: el mensaje se arma en tu dispositivo y vos decidís enviarlo por WhatsApp.
                      {storage === "server" &&
                        ` Si adjuntás tu CV, se guarda en un almacenamiento privado y CEPROC lo descarga con un enlace que vence a los ${CV_LINK_DAYS} días.`}{" "}
                      Para pedir que se eliminen tus datos, escribí a{" "}
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                    </p>
                  </details>

                  <div className={styles.consent} data-invalid={!!errors.consent || undefined}>
                    <label>
                      <input
                        type="checkbox"
                        checked={consent}
                        aria-invalid={!!errors.consent}
                        aria-describedby={errors.consent ? "err-consent" : undefined}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          setErrors((x) => ({ ...x, consent: undefined }));
                        }}
                      />
                      <span>
                        Acepto que mis datos{file ? " y mi CV" : ""} se compartan con CEPROC por WhatsApp para responder mi consulta y
                        orientarme sobre las capacitaciones.
                      </span>
                    </label>
                    {errors.consent && (
                      <p id="err-consent" className={styles.error}>
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  {readyAfterUpload && (
                    <div className={styles.ready} role="status">
                      <p>
                        <Check size={18} aria-hidden="true" /> Tu CV se subió correctamente. Falta un paso: abrí WhatsApp y enviá el mensaje.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.actions}>
                {step > 0 && (
                  <button type="button" className={`btn btn-ghost ${styles.back}`} onClick={() => setStep((s) => s - 1)} disabled={busy}>
                    <ArrowLeft size={18} aria-hidden="true" />
                    <span className={styles.backText}>Volver</span>
                  </button>
                )}
                {step < 2 ? (
                  <button type="submit" className="btn btn-gold">
                    Siguiente
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                ) : readyAfterUpload ? (
                  <a
                    className="btn btn-gold"
                    href={readyAfterUpload.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDone({ ...readyAfterUpload, opened: true, cv: "link" })}
                  >
                    <WhatsappLogo size={20} aria-hidden="true" />
                    Enviar mi solicitud por WhatsApp
                  </a>
                ) : (
                  <button type="submit" className="btn btn-gold" disabled={busy} aria-busy={busy}>
                    <WhatsappLogo size={20} aria-hidden="true" />
                    {busy ? "Subiendo tu CV…" : "Enviar mi solicitud por WhatsApp"}
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      </dialog>
    </>
  );
}

/* ------------------------------------------------------------------ Campos */

type FieldProps = { id: string; "aria-invalid": boolean; "aria-describedby"?: string; required?: boolean };

function Field({
  label,
  hint,
  error,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: (p: FieldProps) => ReactNode;
}) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={styles.field} data-invalid={!!error || undefined}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional ? <span className={styles.optional}> (opcional)</span> : <span aria-hidden="true"> *</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {children({ id, "aria-invalid": !!error, "aria-describedby": describedBy, required: !optional || undefined })}
      {error && (
        <p id={`${id}-err`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

function Choices({
  legend,
  hint,
  type,
  name,
  options,
  value,
  error,
  onChange,
}: {
  legend: string;
  hint?: string;
  type: "radio" | "checkbox";
  name: string;
  options: readonly string[];
  value: string[];
  error?: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <fieldset className={styles.choices} data-invalid={!!error || undefined} aria-describedby={describedBy}>
      <legend className={styles.label}>
        {legend}
        <span aria-hidden="true"> *</span>
        {type === "checkbox" && <span className={styles.optional}> · podés elegir varias</span>}
      </legend>
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      <div className={styles.chips}>
        {options.map((o, i) => (
          <label key={o} className={styles.chip}>
            <input
              type={type}
              name={name}
              value={o}
              checked={value.includes(o)}
              aria-invalid={i === 0 ? !!error : undefined}
              onChange={() => onChange(o)}
            />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-err`} className={styles.error}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

function CvField({
  file,
  storage,
  upload,
  skipCv,
  error,
  fileRef,
  onPick,
  onRemove,
  onRetry,
  onSkip,
}: {
  file: File | null;
  storage: Storage;
  upload: Upload;
  skipCv: boolean;
  error?: string;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onPick: (f: File | null | undefined) => void;
  onRemove: () => void;
  onRetry: () => void;
  onSkip: () => void;
}) {
  const id = useId();
  const status =
    upload.status === "uploading"
      ? "Subiendo…"
      : upload.status === "done"
        ? "Subido"
        : skipCv
          ? "No se adjuntará"
          : storage === "server"
            ? "Se subirá al enviar"
            : "Lo adjuntás en el chat";
  return (
    <div className={styles.field} data-invalid={!!error || undefined}>
      <p className={styles.label} id={`${id}-label`}>
        Currículum vitae <span className={styles.optional}>(opcional)</span>
      </p>
      <p id={`${id}-hint`} className={styles.hint}>
        PDF o DOCX, hasta {CV_MAX_BYTES / 1048576} MB.{" "}
        {storage === "server"
          ? `Se guarda en un almacenamiento privado y CEPROC lo recibe como enlace que vence a los ${CV_LINK_DAYS} días.`
          : storage === "manual"
            ? "Cuando se abra WhatsApp, adjuntalo en el chat con el clip."
            : ""}
      </p>
      <input
        ref={fileRef}
        id={id}
        type="file"
        accept={CV_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-labelledby={`${id}-label`}
        onChange={(e) => onPick(e.target.files?.[0])}
      />
      {file ? (
        <div className={styles.file}>
          <FileText size={22} aria-hidden="true" className={styles.fileIcon} />
          <div className={styles.fileText}>
            <p className={styles.fileName}>{file.name}</p>
            <p className={styles.fileMeta}>
              {size(file.size)} · <span aria-live="polite">{status}</span>
            </p>
          </div>
          <div className={styles.fileActions}>
            <button type="button" className={styles.link} onClick={() => fileRef.current?.click()} disabled={upload.status === "uploading"}>
              Reemplazar
            </button>
            <button type="button" className={styles.link} onClick={onRemove} disabled={upload.status === "uploading"}>
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`btn btn-ghost ${styles.attach}`}
          aria-invalid={!!error}
          aria-describedby={[`${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ")}
          onClick={() => fileRef.current?.click()}
        >
          <Paperclip size={18} aria-hidden="true" />
          Adjuntar mi currículum
        </button>
      )}
      {error && (
        <p id={`${id}-err`} className={styles.error} role="alert">
          {error}
        </p>
      )}
      {upload.status === "failed" && (
        <div className={styles.failed} role="alert">
          <p>{upload.message} Tus respuestas siguen acá.</p>
          <div>
            <button type="button" className="btn btn-ghost" onClick={onRetry}>
              Reintentar
            </button>
            <button type="button" className="btn btn-ghost" onClick={onSkip}>
              Seguir sin el CV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Review({ data, onEdit }: { data: EnrollData; onEdit: (step: number) => void }) {
  const rows: [string, string, number][] = [
    ["Nombre", data.name, 0],
    ["WhatsApp", data.phone, 0],
    ["Correo", data.email || "No proporcionado", 0],
    ["Área", areaLabel(data.area), 1],
    ["Capacitación", data.workshop, 1],
    ["Objetivo", data.objective === "Otro" ? `Otro: ${data.objectiveOther}` : data.objective, 1],
    ["Experiencia", data.experience, 1],
    ["Disponibilidad", data.availability.join(", "), 1],
  ];
  return (
    <section className={styles.review} aria-labelledby="review-title">
      <div className={styles.reviewHead}>
        <h4 id="review-title">Revisá tus respuestas</h4>
        <span>
          <button type="button" className={styles.link} onClick={() => onEdit(0)}>
            Editar datos
          </button>
          <button type="button" className={styles.link} onClick={() => onEdit(1)}>
            Editar intereses
          </button>
        </span>
      </div>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function DonePanel({
  done,
  headingRef,
  file,
  canShareFile,
  copied,
  onCopy,
  onEdit,
}: {
  done: Done;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  file: File | null;
  canShareFile: boolean;
  copied: boolean;
  onCopy: () => void;
  onEdit: () => void;
}) {
  return (
    <div className={styles.done}>
      <h3 ref={headingRef} tabIndex={-1} className={styles.stepTitle}>
        Abrimos WhatsApp con tu solicitud
      </h3>
      <p id="enroll-intro" className={styles.intro}>
        El mensaje <strong>todavía no se envió</strong>: revisalo en WhatsApp y tocá <strong>Enviar</strong>. Hasta entonces, CEPROC no
        recibe nada.
      </p>
      {done.cv === "manual" && file && (
        <div className={styles.ready}>
          <p>
            Falta tu CV: en el chat de CEPROC tocá el clip y elegí <strong>{file.name}</strong>.
          </p>
          {canShareFile && (
            <button type="button" className="btn btn-ghost" onClick={() => navigator.share({ files: [file] }).catch(() => undefined)}>
              <Paperclip size={18} aria-hidden="true" />
              Compartir el CV
            </button>
          )}
        </div>
      )}
      {done.cv === "link" && (
        <p className={styles.hint}>Tu CV va como enlace privado dentro del mensaje (vence a los {CV_LINK_DAYS} días).</p>
      )}
      <div className={styles.actions}>
        <a className="btn btn-gold" href={done.url} target="_blank" rel="noopener noreferrer">
          <WhatsappLogo size={20} aria-hidden="true" />
          Abrir WhatsApp de nuevo
        </a>
        <button type="button" className="btn btn-ghost" onClick={onCopy}>
          {copied ? "Mensaje copiado" : "Copiar el mensaje"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onEdit}>
          <ArrowLeft size={18} aria-hidden="true" />
          Modificar respuestas
        </button>
      </div>
      <details className={styles.privacy}>
        <summary>Ver el mensaje</summary>
        <pre className={styles.preview}>{done.message}</pre>
      </details>
    </div>
  );
}
