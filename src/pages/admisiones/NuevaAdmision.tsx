import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";

import { apiFetch, API_ENDPOINTS } from "@/utils/api";
import { ID_DOC_TYPES, SEXES } from "@/components/admisiones/admissionTypes";

const labelClass = "mb-1.5 block text-sm font-medium text-base-content/70";

const fieldClass =
  "h-12 w-full rounded-lg border border-base-300 bg-base-200 px-4 text-base text-base-content placeholder:text-base-content/40 transition-colors focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40";

const primaryBtnClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-medium text-primary-content shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

interface Grade {
  id: number;
  name: string;
  description: string | null;
}

/**
 * Etiqueta visible del grado. Convención del sistema (la que usa matrículas): el texto
 * que ve el usuario vive en `description`; `name` es el respaldo si viene vacío.
 */
const gradeLabel = (g: Grade) => g.description || g.name;

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = [currentYear, currentYear + 1];

export default function NuevaAdmision() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    first_name1: "",
    first_name2: "",
    last_name1: "",
    last_name2: "",
    id_type: "RC",
    id_number: "",
    birth_date: "",
    sex: "",
    academic_year: String(currentYear + 1),
    grade_applied: "",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    let active = true;
    apiFetch(API_ENDPOINTS.grades)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) setGrades(data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoadingGrades(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      applicant: {
        first_name1: form.first_name1,
        first_name2: form.first_name2,
        last_name1: form.last_name1,
        last_name2: form.last_name2,
        id_type: form.id_type,
        id_number: form.id_number,
        birth_date: form.birth_date || null,
        sex: form.sex,
      },
      academic_year: Number(form.academic_year),
      grade_applied: Number(form.grade_applied),
      aspirant_type: "NUEVO",
    };

    try {
      const res = await apiFetch(API_ENDPOINTS.admissionsApplications, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        navigate(`/admisiones/${data.code}`, { replace: true });
      } else {
        setError(
          typeof data?.detail === "string"
            ? data.detail
            : "Revisa los datos: hay campos incompletos o inválidos.",
        );
        setSubmitting(false);
      }
    } catch {
      setError("No pudimos conectar con el servidor. Intenta de nuevo.");
      setSubmitting(false);
    }
  };

  const canSubmit =
    form.first_name1 &&
    form.last_name1 &&
    form.id_number &&
    form.grade_applied &&
    !submitting;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate("/admisiones")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-base-content/60 transition-colors hover:text-base-content focus-visible:outline-none focus-visible:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis solicitudes
      </button>

      <div>
        <h1 className="font-display text-3xl font-bold text-secondary">
          Nueva admisión
        </h1>
        <p className="mt-1 text-base-content/60">
          Empecemos con los datos básicos del aspirante. Podrás completar el
          resto del formulario después.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-error/25 bg-error/5 p-4 text-sm text-base-content/80"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm"
      >
        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold text-secondary">
            Datos del aspirante
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fn1" className={labelClass}>
                Primer nombre *
              </label>
              <input
                id="fn1"
                className={fieldClass}
                value={form.first_name1}
                onChange={(e) => set("first_name1")(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="fn2" className={labelClass}>
                Segundo nombre
              </label>
              <input
                id="fn2"
                className={fieldClass}
                value={form.first_name2}
                onChange={(e) => set("first_name2")(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="ln1" className={labelClass}>
                Primer apellido *
              </label>
              <input
                id="ln1"
                className={fieldClass}
                value={form.last_name1}
                onChange={(e) => set("last_name1")(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="ln2" className={labelClass}>
                Segundo apellido
              </label>
              <input
                id="ln2"
                className={fieldClass}
                value={form.last_name2}
                onChange={(e) => set("last_name2")(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="idtype" className={labelClass}>
                Tipo de documento *
              </label>
              <select
                id="idtype"
                className={fieldClass}
                value={form.id_type}
                onChange={(e) => set("id_type")(e.target.value)}
              >
                {ID_DOC_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="idnum" className={labelClass}>
                Número de documento *
              </label>
              <input
                id="idnum"
                className={fieldClass}
                value={form.id_number}
                onChange={(e) => set("id_number")(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="bdate" className={labelClass}>
                Fecha de nacimiento
              </label>
              <input
                id="bdate"
                type="date"
                className={fieldClass}
                value={form.birth_date}
                onChange={(e) => set("birth_date")(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sex" className={labelClass}>
                Sexo
              </label>
              <select
                id="sex"
                className={fieldClass}
                value={form.sex}
                onChange={(e) => set("sex")(e.target.value)}
              >
                <option value="">Selecciona…</option>
                {SEXES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-base-300 pt-6">
          <legend className="font-display text-lg font-semibold text-secondary">
            Grado al que aspira
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="grade" className={labelClass}>
                Grado *
              </label>
              <select
                id="grade"
                className={fieldClass}
                value={form.grade_applied}
                onChange={(e) => set("grade_applied")(e.target.value)}
                required
                disabled={loadingGrades}
              >
                <option value="">
                  {loadingGrades ? "Cargando grados…" : "Selecciona un grado"}
                </option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {gradeLabel(g)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year" className={labelClass}>
                Año lectivo *
              </label>
              <select
                id="year"
                className={fieldClass}
                value={form.academic_year}
                onChange={(e) => set("academic_year")(e.target.value)}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end border-t border-base-300 pt-6">
          <button type="submit" disabled={!canSubmit} className={primaryBtnClass}>
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creando solicitud…
              </>
            ) : (
              "Crear solicitud"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
