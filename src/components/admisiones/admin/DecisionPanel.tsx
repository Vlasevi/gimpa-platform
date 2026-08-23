/**
 * Pestaña de Comité / Decisión final (P14–P15) del panel de staff.
 *
 * El comité es la decisión final: un formulario con preguntas dinámicas (esquema
 * sembrado en el backend) más la decisión, el grado/ruta aprobados, las condiciones y el
 * mensaje al acudiente. Registrar mueve el expediente a su estado terminal y notifica.
 */

import { useCallback, useEffect, useState } from "react";
import { Loader2, Gavel, CheckCircle2, Lock } from "lucide-react";

import { apiFetch, API_ENDPOINTS } from "@/utils/api";
import type { SectionPermissions } from "@/components/Login/loginLogic";

type QuestionType = "text" | "textarea" | "select" | "bool" | "scale";

interface Question {
  key: string;
  label: string;
  type: QuestionType;
  options?: string[];
}

interface DecisionData {
  form: { version: number; questions: Question[] };
  decided: boolean;
  decision: string;
  decision_label: string;
  answers: Record<string, unknown>;
  grade_approved: number | null;
  route_approved: string;
  conditions: string;
  message_public: string;
  decided_at: string | null;
}

const DECISIONS = [
  { value: "ADMITIDO", label: "Admitido" },
  { value: "ADMITIDO_CON_CONDICIONES", label: "Admitido con condiciones" },
  { value: "LISTA_ESPERA", label: "Lista de espera" },
  { value: "REQUIERE_NUEVA_VALORACION", label: "Requiere nueva valoración" },
  { value: "NO_ADMITIDO", label: "No admitido" },
  { value: "DESISTIDO", label: "Desistido" },
];

const ROUTES = [
  { value: "REGULAR", label: "Regular" },
  { value: "FLEXIBLE", label: "Flexible" },
  { value: "DIAGNOSTICO", label: "Diagnóstico" },
  { value: "PREESCOLAR", label: "Preescolar" },
  { value: "OTRA", label: "Otra" },
];

const inputClass = "input input-bordered w-full focus:input-primary transition-all";
const selectClass = "select select-bordered w-full focus:select-primary transition-all";
const textareaClass = "textarea textarea-bordered w-full focus:textarea-primary transition-all";
const labelClass = "mb-1.5 block text-sm font-medium text-base-content/70";
const primaryBtn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-content transition-all hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60";

export function DecisionPanel({
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
  const [data, setData] = useState<DecisionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [decision, setDecision] = useState("");
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [route, setRoute] = useState("");
  const [conditions, setConditions] = useState("");
  const [messagePublic, setMessagePublic] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await apiFetch(API_ENDPOINTS.admissionsDecision(code));
      if (!res.ok) return;
      const d: DecisionData = await res.json();
      setData(d);
      setDecision(d.decision ?? "");
      setAnswers({ ...(d.answers ?? {}) });
      setRoute(d.route_approved ?? "");
      setConditions(d.conditions ?? "");
      setMessagePublic(d.message_public ?? "");
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    if (!decision) {
      flash("error", "Elige una decisión.");
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch(API_ENDPOINTS.admissionsDecision(code), {
        method: "POST",
        body: JSON.stringify({
          decision,
          answers,
          route_approved: route,
          conditions,
          message_public: messagePublic,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        flash(
          "error",
          typeof err?.detail === "string" ? err.detail : "No se pudo registrar la decisión.",
        );
        return;
      }
      onChanged();
      flash("success", "Decisión registrada.");
      await load();
    } catch {
      flash("error", "No pudimos conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  const setAnswer = (key: string, value: unknown) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-8 text-base-content/60">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        Cargando decisión…
      </div>
    );
  }

  if (!data) {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2 text-sm text-base-content/60">
        <Lock className="h-4 w-4" />
        No autorizado para ver la decisión.
      </p>
    );
  }

  const needsConditions = decision === "ADMITIDO_CON_CONDICIONES";
  const canDecide = perms.canDecide;

  return (
    <div className="space-y-4">
      {data.decided && (
        <div className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Decisión registrada: <strong>{data.decision_label}</strong>
        </div>
      )}

      {/* Formulario del comité (preguntas sembradas) */}
      <div className="space-y-3 rounded-xl border border-base-300 p-4">
        <h3 className="flex items-center gap-2 font-display font-semibold text-secondary">
          <Gavel className="h-4 w-4" />
          Comité de admisión
        </h3>
        {data.form.questions.map((q) => (
          <QuestionField
            key={q.key}
            question={q}
            value={answers[q.key]}
            disabled={!canDecide}
            onChange={(v) => setAnswer(q.key, v)}
          />
        ))}
      </div>

      {/* Decisión */}
      <div className="grid gap-3 rounded-xl border border-base-300 p-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Decisión *</label>
          <select
            className={selectClass}
            value={decision}
            disabled={!canDecide}
            onChange={(e) => setDecision(e.target.value)}
          >
            <option value="">Elige…</option>
            {DECISIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Ruta aprobada</label>
          <select
            className={selectClass}
            value={route}
            disabled={!canDecide}
            onChange={(e) => setRoute(e.target.value)}
          >
            <option value="">—</option>
            {ROUTES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        {needsConditions && (
          <div className="sm:col-span-2">
            <label className={labelClass}>Condiciones *</label>
            <textarea
              rows={2}
              className={textareaClass}
              value={conditions}
              disabled={!canDecide}
              onChange={(e) => setConditions(e.target.value)}
            />
          </div>
        )}
        <div className="sm:col-span-2">
          <label className={labelClass}>
            Mensaje para el acudiente (lo recibirá por correo)
          </label>
          <textarea
            rows={2}
            className={textareaClass}
            value={messagePublic}
            disabled={!canDecide}
            onChange={(e) => setMessagePublic(e.target.value)}
          />
        </div>
      </div>

      {canDecide ? (
        <button type="button" onClick={submit} disabled={saving} className={primaryBtn}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Gavel className="h-4 w-4" />
          )}
          {data.decided ? "Actualizar decisión" : "Registrar decisión"}
        </button>
      ) : (
        <p className="text-sm text-base-content/60">
          Solo el rector/administrador puede registrar la decisión.
        </p>
      )}
    </div>
  );
}

function QuestionField({
  question,
  value,
  disabled,
  onChange,
}: {
  question: Question;
  value: unknown;
  disabled?: boolean;
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
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : question.type === "select" ? (
        <select
          className={selectClass}
          value={(value as string) ?? ""}
          disabled={disabled}
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
          disabled={disabled}
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
          disabled={disabled}
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
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
