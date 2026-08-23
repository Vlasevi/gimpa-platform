/**
 * Pestaña de Agenda + Evaluación (P10–P13) del panel de staff.
 *
 * Quien agenda fija fecha/hora/modalidad/enlace **y asigna un usuario** a cada entrevista
 * (se notifica al acudiente y al asignado). El **usuario asignado** —desde su propia
 * sesión— es el único que registra las respuestas del formulario (preguntas dinámicas del
 * esquema sembrado). Un usuario que no agenda solo ve las entrevistas que le asignaron.
 */

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  CalendarClock,
  Video,
  MapPin,
  Lock,
  CheckCircle2,
  ClipboardList,
  UserCheck,
} from "lucide-react";

import { apiFetch, API_ENDPOINTS } from "@/utils/api";
import type { SectionPermissions } from "@/components/Login/loginLogic";

type QuestionType = "text" | "textarea" | "select" | "bool" | "scale";

interface Question {
  key: string;
  label: string;
  type: QuestionType;
  options?: string[];
}

interface InterviewRow {
  kind: string;
  label: string;
  status: string;
  status_label: string;
  scheduled_at: string | null;
  modality: string;
  meeting_link: string;
  sensitivity: string;
  form?: { version: number; questions: Question[] };
  can_conduct?: boolean;
  assigned_to?: number | null;
  assigned_to_name?: string;
  answers?: Record<string, unknown>;
  concept?: string;
  concept_label?: string;
  general_note?: string;
  registered_at?: string | null;
  restricted?: boolean;
}

interface StaffUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const CONCEPTS = [
  { value: "FAVORABLE", label: "Favorable" },
  { value: "FAVORABLE_CON_OBSERVACIONES", label: "Favorable con observaciones" },
  { value: "REQUIERE_COMITE", label: "Requiere comité" },
  { value: "DESFAVORABLE", label: "Desfavorable" },
];

const inputClass = "input input-bordered w-full focus:input-primary transition-all";
const selectClass = "select select-bordered w-full focus:select-primary transition-all";
const textareaClass = "textarea textarea-bordered w-full focus:textarea-primary transition-all";
const labelClass = "mb-1.5 block text-sm font-medium text-base-content/70";
const primaryBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-content transition-all hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60";
const ghostBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-base-300 bg-base-100 px-4 text-sm font-medium text-base-content transition-colors hover:bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60";

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function formatWhen(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
}

export function InterviewsPanel({
  code,
  perms,
  flash,
  onChanged,
}: {
  code: string;
  perms: SectionPermissions;
  flash: (type: "success" | "error", msg: string) => void;
  onChanged: () => void;
}) {
  const canSchedule = Boolean(perms.canScheduleInterviews);

  const [interviews, setInterviews] = useState<InterviewRow[]>([]);
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);

  const [sched, setSched] = useState<
    Record<
      string,
      { scheduled_at: string; modality: string; meeting_link: string; assigned_to: string }
    >
  >({});
  const [answers, setAnswers] = useState<Record<string, Record<string, unknown>>>({});
  const [concepts, setConcepts] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const res = await apiFetch(API_ENDPOINTS.admissionsInterviews(code));
      if (!res.ok) return;
      const rows: InterviewRow[] = (await res.json()).interviews ?? [];
      setInterviews(rows);
      const s: typeof sched = {};
      const a: typeof answers = {};
      const c: typeof concepts = {};
      const n: typeof notes = {};
      for (const row of rows) {
        s[row.kind] = {
          scheduled_at: toLocalInput(row.scheduled_at),
          modality: row.modality || "VIRTUAL",
          meeting_link: row.meeting_link || "",
          assigned_to: row.assigned_to ? String(row.assigned_to) : "",
        };
        a[row.kind] = { ...(row.answers ?? {}) };
        c[row.kind] = row.concept ?? "";
        n[row.kind] = row.general_note ?? "";
      }
      setSched(s);
      setAnswers(a);
      setConcepts(c);
      setNotes(n);
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  // Lista de usuarios asignables (solo para quien agenda).
  useEffect(() => {
    if (!canSchedule) return;
    apiFetch(API_ENDPOINTS.admissionsAssignableUsers)
      .then((r) => (r.ok ? r.json() : { users: [] }))
      .then((d) => setStaff(d.users ?? []))
      .catch(() => undefined);
  }, [canSchedule]);

  const post = async (
    path: string,
    body: unknown,
    pendingKey: string,
    successMsg: string,
  ) => {
    setPending(pendingKey);
    try {
      const res = await apiFetch(path, { method: "POST", body: JSON.stringify(body) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        flash(
          "error",
          typeof data?.detail === "string" ? data.detail : "No se pudo completar la acción.",
        );
        return;
      }
      setInterviews((await res.json()).interviews ?? []);
      onChanged();
      flash("success", successMsg);
    } catch {
      flash("error", "No pudimos conectar con el servidor.");
    } finally {
      setPending(null);
    }
  };

  const schedule = (kind: string) => {
    const form = sched[kind];
    if (!form?.scheduled_at) {
      flash("error", "Indica la fecha y hora de la cita.");
      return;
    }
    if (!form.assigned_to) {
      flash("error", "Asigna un usuario a la entrevista.");
      return;
    }
    post(
      API_ENDPOINTS.admissionsInterviews(code),
      {
        kind,
        scheduled_at: form.scheduled_at,
        modality: form.modality,
        meeting_link: form.meeting_link,
        assigned_to: Number(form.assigned_to),
      },
      `sched-${kind}`,
      "Cita agendada y asignada.",
    );
  };

  const register = (kind: string) => {
    post(
      API_ENDPOINTS.admissionsInterviewRegister(code),
      {
        kind,
        answers: answers[kind] ?? {},
        concept: concepts[kind] ?? "",
        general_note: notes[kind] ?? "",
      },
      `reg-${kind}`,
      "Entrevista registrada.",
    );
  };

  const setAnswer = (kind: string, key: string, value: unknown) =>
    setAnswers((prev) => ({ ...prev, [kind]: { ...prev[kind], [key]: value } }));

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-8 text-base-content/60">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        Cargando agenda…
      </div>
    );
  }

  // Quien no agenda (un asignado) solo ve las entrevistas que le tocan.
  const visible = canSchedule ? interviews : interviews.filter((iv) => iv.can_conduct);

  if (visible.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-base-content/60">
        No tienes entrevistas asignadas en este expediente.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {visible.map((iv) => {
        const isDone = iv.status === "REALIZADA";
        const form = sched[iv.kind];
        return (
          <div key={iv.kind} className="rounded-xl border border-base-300 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 font-display font-semibold text-secondary">
                {iv.label}
                {iv.sensitivity === "sensitive" && (
                  <span className="rounded-full border border-base-300 px-2 py-0.5 text-xs text-base-content/50">
                    sensible
                  </span>
                )}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isDone
                    ? "bg-accent/10 text-accent"
                    : iv.status === "PROGRAMADA"
                      ? "bg-primary/10 text-primary"
                      : "bg-base-200 text-base-content/60"
                }`}
              >
                {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                {iv.status_label}
              </span>
            </div>

            {/* Asignado actual */}
            {iv.assigned_to_name && (
              <p className="mb-3 flex items-center gap-1.5 text-sm text-base-content/60">
                <UserCheck className="h-4 w-4 text-primary" />
                Asignada a: {iv.assigned_to_name}
              </p>
            )}

            {/* --- Agenda + asignación (solo quien agenda) --- */}
            {canSchedule ? (
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Fecha y hora</label>
                  <input
                    type="datetime-local"
                    className={inputClass}
                    value={form?.scheduled_at ?? ""}
                    onChange={(e) =>
                      setSched((p) => ({
                        ...p,
                        [iv.kind]: { ...p[iv.kind], scheduled_at: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Modalidad</label>
                  <select
                    className={selectClass}
                    value={form?.modality ?? "VIRTUAL"}
                    onChange={(e) =>
                      setSched((p) => ({
                        ...p,
                        [iv.kind]: { ...p[iv.kind], modality: e.target.value },
                      }))
                    }
                  >
                    <option value="VIRTUAL">Virtual (Teams)</option>
                    <option value="PRESENCIAL">Presencial</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Asignar a</label>
                  <select
                    className={selectClass}
                    value={form?.assigned_to ?? ""}
                    onChange={(e) =>
                      setSched((p) => ({
                        ...p,
                        [iv.kind]: { ...p[iv.kind], assigned_to: e.target.value },
                      }))
                    }
                  >
                    <option value="">Elige un usuario…</option>
                    {staff.map((u) => (
                      <option key={u.id} value={String(u.id)}>
                        {u.name} · {u.role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Enlace de Teams o lugar</label>
                  <input
                    className={inputClass}
                    placeholder="https://teams.microsoft.com/…"
                    value={form?.meeting_link ?? ""}
                    onChange={(e) =>
                      setSched((p) => ({
                        ...p,
                        [iv.kind]: { ...p[iv.kind], meeting_link: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => schedule(iv.kind)}
                    disabled={pending !== null}
                    className={ghostBtn}
                  >
                    {pending === `sched-${iv.kind}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CalendarClock className="h-4 w-4" />
                    )}
                    {iv.scheduled_at ? "Reprogramar / reasignar" : "Agendar y asignar"}
                  </button>
                </div>
              </div>
            ) : (
              iv.scheduled_at && (
                <p className="mb-4 flex items-center gap-2 text-sm text-base-content/70">
                  {iv.modality === "VIRTUAL" ? (
                    <Video className="h-4 w-4 text-primary" />
                  ) : (
                    <MapPin className="h-4 w-4 text-primary" />
                  )}
                  {formatWhen(iv.scheduled_at)}
                  {iv.meeting_link && iv.meeting_link.startsWith("http") && (
                    <a
                      href={iv.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      · Abrir enlace
                    </a>
                  )}
                </p>
              )
            )}

            {/* --- Registro de respuestas --- */}
            {iv.restricted ? (
              <p className="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2 text-sm text-base-content/60">
                <Lock className="h-4 w-4" />
                Contenido restringido para tu rol.
              </p>
            ) : iv.can_conduct && iv.form ? (
              <div className="space-y-3 rounded-lg border border-base-300 bg-base-100 p-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-base-content/70">
                  <ClipboardList className="h-4 w-4" />
                  Registro de la entrevista
                </h4>
                {iv.form.questions.map((q) => (
                  <QuestionField
                    key={q.key}
                    question={q}
                    value={answers[iv.kind]?.[q.key]}
                    onChange={(v) => setAnswer(iv.kind, q.key, v)}
                  />
                ))}
                <div>
                  <label className={labelClass}>Concepto</label>
                  <select
                    className={selectClass}
                    value={concepts[iv.kind] ?? ""}
                    onChange={(e) =>
                      setConcepts((p) => ({ ...p, [iv.kind]: e.target.value }))
                    }
                  >
                    <option value="">Sin concepto</option>
                    {CONCEPTS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Observación general</label>
                  <textarea
                    rows={2}
                    className={textareaClass}
                    value={notes[iv.kind] ?? ""}
                    onChange={(e) => setNotes((p) => ({ ...p, [iv.kind]: e.target.value }))}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => register(iv.kind)}
                  disabled={pending !== null}
                  className={primaryBtn}
                >
                  {pending === `reg-${iv.kind}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {isDone ? "Actualizar registro" : "Guardar registro"}
                </button>
              </div>
            ) : (
              isDone && (
                <ReadOnlyAnswers
                  form={iv.form}
                  answers={iv.answers}
                  conceptLabel={iv.concept_label}
                  note={iv.general_note}
                />
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{question.label}</label>
      {question.type === "textarea" ? (
        <textarea
          rows={2}
          className={textareaClass}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : question.type === "select" ? (
        <select
          className={selectClass}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">—</option>
          {(question.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : question.type === "bool" ? (
        <select
          className={selectClass}
          value={value === true ? "si" : value === false ? "no" : ""}
          onChange={(e) => onChange(e.target.value === "" ? null : e.target.value === "si")}
        >
          <option value="">—</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
      ) : question.type === "scale" ? (
        <select
          className={selectClass}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">—</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={inputClass}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function ReadOnlyAnswers({
  form,
  answers,
  conceptLabel,
  note,
}: {
  form?: { questions: Question[] };
  answers?: Record<string, unknown>;
  conceptLabel?: string;
  note?: string;
}) {
  if (!form) return null;
  const render = (v: unknown) =>
    v === true
      ? "Sí"
      : v === false
        ? "No"
        : v === null || v === undefined || v === ""
          ? "—"
          : String(v);
  return (
    <dl className="grid gap-x-6 rounded-lg bg-base-200 p-3 sm:grid-cols-2">
      {form.questions.map((q) => (
        <div key={q.key} className="py-1">
          <dt className="text-xs text-base-content/50">{q.label}</dt>
          <dd className="text-sm text-base-content">{render(answers?.[q.key])}</dd>
        </div>
      ))}
      {conceptLabel && (
        <div className="py-1">
          <dt className="text-xs text-base-content/50">Concepto</dt>
          <dd className="text-sm text-base-content">{conceptLabel}</dd>
        </div>
      )}
      {note && (
        <div className="py-1 sm:col-span-2">
          <dt className="text-xs text-base-content/50">Observación</dt>
          <dd className="text-sm text-base-content">{note}</dd>
        </div>
      )}
    </dl>
  );
}
