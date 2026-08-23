/**
 * Pasos del wizard de solicitud de admisión.
 *
 * Cada paso edita **una sección** de `AdmissionApplication.data` y se guarda con
 * `PATCH { sections: { <clave>: {...} } }`.
 *
 * ⚠️ Los campos de Salud (`has_medical_condition`, `takes_medication`,
 * `has_diagnosis`, `receives_therapy`, `needs_learning_support`) deben conservar
 * estos nombres: son los que lee `apply_alert_rules` en el backend.
 */

import { useEffect, useState } from "react";

import { useAuth } from "@/components/Login/loginLogic";
import {
  EPS_LIST,
  BLOOD_ABO,
  BLOOD_RH,
  DOCUMENT_TYPES,
} from "@/components/shared/formLists";

import {
  Field,
  FieldGrid,
  SelectField,
  TextAreaField,
  YesNoField,
  WhenYes,
  controlClass,
  inputClass,
  textareaClass,
  labelClass,
  type SectionValues,
} from "./formFields";
import { GeoResidenceFields, PersonFields, WorkFields, SubSection } from "./guardianFields";

export interface StepProps {
  values: SectionValues;
  onChange: (name: string, value: unknown) => void;
}

// Grados del colegio (para "último grado cursado"). Coincide con `seed_grades`.
const GRADE_OPTIONS = [
  "Prejardín", "Jardín", "Transición", "Primero", "Segundo", "Tercero", "Cuarto",
  "Quinto", "Sexto", "Séptimo", "Octavo", "Noveno", "Décimo", "Undécimo", "Otro",
];

const CHANGE_REASONS = [
  "Traslado de ciudad o domicilio", "Motivos académicos", "Convivencia",
  "Económico", "Familiar", "Inclusión o apoyo", "Otro",
];

const DIFFICULTY_AREAS = [
  "Matemáticas", "Lectura", "Escritura", "Inglés", "Convivencia", "Atención", "Otra",
];

const RELATIONSHIPS = ["Madre", "Padre", "Abuelo/a", "Tío/a", "Tutor/a legal", "Otro"];

// Sufijos de los campos de una persona / su residencia (para el auto-llenado del acudiente).
const PERSON_SUFFIXES = [
  "firstname1", "firstname2", "lastname1", "lastname2", "document_type",
  "id_number", "email", "phone", "work_phone", "profession", "religion",
  "company_name", "company_address",
];
const RESIDENCE_SUFFIXES = [
  "address", "address_complement", "stratum", "country", "country_other",
  "department", "department_id", "city", "barrio", "barrio_other",
];

// ---------------------------------------------------------------- Residencia
export function ResidenceStep({ values, onChange }: StepProps) {
  return (
    <FieldGrid>
      <GeoResidenceFields prefix="" values={values} onChange={onChange} />
    </FieldGrid>
  );
}

// -------------------------------------------------------- Historial académico
export function AcademicHistoryStep({ values, onChange }: StepProps) {
  const repeated = (values.repeated as Record<string, unknown>) ?? {};
  const difficulties = (values.difficulties as Record<string, unknown>) ?? {};

  const setRepeated = (patch: Record<string, unknown>) =>
    onChange("repeated", { ...repeated, ...patch });
  const setDifficulties = (patch: Record<string, unknown>) =>
    onChange("difficulties", { ...difficulties, ...patch });

  const lastGrade = (values.last_grade_completed as string) ?? "";
  const areas = Array.isArray(difficulties.dificulties)
    ? (difficulties.dificulties as string[])
    : [];
  const toggleArea = (area: string) =>
    setDifficulties({
      dificulties: areas.includes(area) ? areas.filter((a) => a !== area) : [...areas, area],
    });

  return (
    <FieldGrid>
      <Field name="previous_school" label="Colegio anterior" values={values}
        onChange={onChange} placeholder="Nombre de la institución" full />

      <SelectField name="last_grade_completed" label="Último grado cursado"
        values={values} onChange={onChange} options={GRADE_OPTIONS} />
      {lastGrade === "Otro" && (
        <Field name="last_grade_other" label="¿Cuál grado?" values={values} onChange={onChange} />
      )}

      <Field name="last_year" label="Año en que lo cursó" type="number"
        values={values} onChange={onChange} placeholder="2025" />
      <SelectField name="change_reason" label="Motivo del cambio de colegio"
        values={values} onChange={onChange} options={CHANGE_REASONS} full />
      {(values.change_reason as string) === "Otro" && (
        <Field name="change_reason_other" label="¿Cuál motivo?" values={values}
          onChange={onChange} full />
      )}

      {/* Repitió año → { hasRepeated, grade, reason } */}
      <BoolYesNo label="¿Ha repetido algún grado?"
        value={repeated.hasRepeated as boolean | undefined}
        onChange={(v) => setRepeated({ hasRepeated: v })} />
      {repeated.hasRepeated === true && (
        <>
          <div>
            <label htmlFor="repeated_grade" className={labelClass}>¿Qué grado repitió?</label>
            <select id="repeated_grade" className={controlClass}
              value={(repeated.grade as string) ?? ""}
              onChange={(e) => setRepeated({ grade: e.target.value })}>
              <option value="">Selecciona…</option>
              {GRADE_OPTIONS.filter((g) => g !== "Otro").map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="repeated_reason" className={labelClass}>Motivo</label>
            <textarea id="repeated_reason" rows={2} className={textareaClass}
              value={(repeated.reason as string) ?? ""}
              onChange={(e) => setRepeated({ reason: e.target.value })} />
          </div>
        </>
      )}

      {/* Dificultades → { hasDificulties, dificulties[], other } */}
      <BoolYesNo label="¿Ha presentado dificultades académicas?"
        value={difficulties.hasDificulties as boolean | undefined}
        onChange={(v) => setDifficulties({ hasDificulties: v })} />
      {difficulties.hasDificulties === true && (
        <>
          <fieldset className="sm:col-span-2">
            <legend className={labelClass}>¿En qué áreas?</legend>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_AREAS.map((area) => {
                const active = areas.includes(area);
                return (
                  <label key={area}
                    className={`flex h-10 cursor-pointer items-center rounded-lg border px-4 text-sm font-medium transition-all duration-200 ease-out focus-within:ring-2 focus-within:ring-primary/40 ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-base-300 bg-base-200 text-base-content/70 hover:bg-base-300/50"
                    }`}>
                    <input type="checkbox" checked={active} onChange={() => toggleArea(area)}
                      className="sr-only" />
                    {area}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="sm:col-span-2">
            <label htmlFor="dif_other" className={labelClass}>Otra dificultad (opcional)</label>
            <input id="dif_other" className={inputClass}
              value={(difficulties.other as string) ?? ""}
              onChange={(e) => setDifficulties({ other: e.target.value })} />
          </div>
        </>
      )}
    </FieldGrid>
  );
}

/** Sí/No que guarda un booleano (no "Si"/"No"), para las formas anidadas de la DB. */
function BoolYesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | undefined;
  onChange: (v: boolean) => void;
}) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className={labelClass}>{label}</legend>
      <div className="flex gap-2">
        {[
          { text: "Sí", val: true },
          { text: "No", val: false },
        ].map((o) => {
          const active = value === o.val;
          return (
            <label key={o.text}
              className={`flex h-11 min-w-24 cursor-pointer items-center justify-center rounded-lg border px-5 text-sm font-medium transition-all duration-200 ease-out focus-within:ring-2 focus-within:ring-primary/40 ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-base-300 bg-base-200 text-base-content/70 hover:bg-base-300/50"
              }`}>
              <input type="radio" checked={active} onChange={() => onChange(o.val)} className="sr-only" />
              {o.text}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// ---------------------------------------------------------------- Acudientes
export function GuardiansStep({ values, onChange }: StepProps) {
  const { user } = useAuth();
  const guardianType = (values.guardian_type as string) ?? "";

  // Acordeón: solo una sección abierta a la vez. `null` = todas plegadas (estado inicial).
  const [openSection, setOpenSection] = useState<string | null>(null);
  const section = (key: string) => ({
    open: openSection === key,
    onToggle: () => setOpenSection((s) => (s === key ? null : key)),
  });

  // El acudiente principal ES la cuenta: pre-llenamos una vez, si está vacío.
  useEffect(() => {
    if (!user) return;
    const empty = !values.guardian_email && !values.guardian_firstname1 && !guardianType;
    if (empty) {
      onChange("guardian_firstname1", user.first_name ?? "");
      onChange("guardian_lastname1", user.last_name ?? "");
      onChange("guardian_email", user.email ?? "");
    }
    // Solo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-llenado del acudiente desde Padre/Madre (o limpieza si Empresa).
  const srcPrefix =
    guardianType === "Padre" ? "father_" : guardianType === "Madre" ? "mother_" : "";
  const srcSignature = srcPrefix
    ? JSON.stringify([
        ...PERSON_SUFFIXES.map((s) => values[`${srcPrefix}${s}`]),
        ...RESIDENCE_SUFFIXES.map((s) => values[`${srcPrefix}residence_${s}`]),
      ])
    : "";

  // Solo COPIA (Padre/Madre); nunca limpia aquí, para no borrar data al reanudar.
  useEffect(() => {
    if (!srcPrefix) return;
    PERSON_SUFFIXES.forEach((s) => {
      const val = values[`${srcPrefix}${s}`] ?? "";
      if (values[`guardian_${s}`] !== val) onChange(`guardian_${s}`, val);
    });
    RESIDENCE_SUFFIXES.forEach((s) => {
      const val = values[`${srcPrefix}residence_${s}`] ?? "";
      if (values[`guardian_residence_${s}`] !== val) onChange(`guardian_residence_${s}`, val);
    });
    if (values.guardian_relationship !== guardianType) {
      onChange("guardian_relationship", guardianType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guardianType, srcSignature]);

  // Borra lo autollenado. Se llama al cambiar el tipo (acción del usuario), no en un
  // efecto, para que reanudar una solicitud guardada no pierda datos.
  const clearGuardian = () => {
    PERSON_SUFFIXES.forEach((s) => onChange(`guardian_${s}`, ""));
    RESIDENCE_SUFFIXES.forEach((s) => onChange(`guardian_residence_${s}`, ""));
    onChange("guardian_relationship", "");
    onChange("guardian_full_name", "");
  };

  const onGuardianType = (t: string) => {
    onChange("guardian_type", t);
    // "Otra persona" o "Empresa": limpiar lo copiado de padre/madre.
    if (t === "Otro" || t === "Empresa") clearGuardian();
  };

  const isCopied = guardianType === "Padre" || guardianType === "Madre";
  const isEmpresa = guardianType === "Empresa";

  return (
    <div className="space-y-4">
      {/* ¿Con quién vive? */}
      <SubSection title="¿Con quién vive el estudiante?" {...section("lives")}>
        <BoolYesNo label="¿Vive con el padre?"
          value={values.father_lives_with_student as boolean | undefined}
          onChange={(v) => onChange("father_lives_with_student", v)} />
        <BoolYesNo label="¿Vive con la madre?"
          value={values.mother_lives_with_student as boolean | undefined}
          onChange={(v) => onChange("mother_lives_with_student", v)} />
        <Field name="lives_with_other" label="¿Con quién más vive? (opcional)"
          values={values} onChange={onChange} full />
      </SubSection>

      {/* Padre: nombres → residencia → trabajo */}
      <SubSection title="Información del padre" {...section("father")}>
        <PersonFields prefix="father_" values={values} onChange={onChange} />
        <GeoResidenceFields prefix="father_residence_" values={values} onChange={onChange} />
        <WorkFields prefix="father_" values={values} onChange={onChange} />
      </SubSection>

      {/* Madre */}
      <SubSection title="Información de la madre" {...section("mother")}>
        <PersonFields prefix="mother_" values={values} onChange={onChange} />
        <GeoResidenceFields prefix="mother_residence_" values={values} onChange={onChange} />
        <WorkFields prefix="mother_" values={values} onChange={onChange} />
      </SubSection>

      {/* Acudiente / Adulto responsable */}
      <SubSection title="Acudiente / Adulto responsable" {...section("guardian")}>
        <div>
          <label htmlFor="guardian_type" className={labelClass}>Tipo de acudiente</label>
          <select id="guardian_type" className={controlClass} value={guardianType}
            onChange={(e) => onGuardianType(e.target.value)}>
            <option value="">Selecciona…</option>
            <option value="Padre">El padre</option>
            <option value="Madre">La madre</option>
            <option value="Otro">Otra persona</option>
            <option value="Empresa">Una empresa</option>
          </select>
        </div>

        {isCopied && (
          <p className="text-sm text-base-content/60 sm:col-span-2">
            Se tomaron los datos del {guardianType === "Padre" ? "padre" : "la madre"}. Puedes ajustarlos abajo.
          </p>
        )}

        {isEmpresa ? (
          <>
            <Field name="guardian_full_name" label="Razón social" values={values}
              onChange={onChange} full />
            <Field name="guardian_id_number" label="NIT" values={values} onChange={onChange} />
            <Field name="guardian_email" label="Correo de contacto" type="email"
              values={values} onChange={onChange} />
            <Field name="guardian_phone" label="Teléfono" type="tel" values={values} onChange={onChange} />
            <GeoResidenceFields prefix="guardian_residence_" values={values} onChange={onChange} />
          </>
        ) : (
          <>
            <SelectField name="guardian_relationship" label="Parentesco" values={values}
              onChange={onChange} options={RELATIONSHIPS} />
            {(values.guardian_relationship as string) === "Otro" && (
              <Field name="guardian_relationship_other" label="¿Cuál parentesco?"
                values={values} onChange={onChange} />
            )}
            <PersonFields prefix="guardian_" values={values} onChange={onChange} />
            <GeoResidenceFields prefix="guardian_residence_" values={values} onChange={onChange} />
            <WorkFields prefix="guardian_" values={values} onChange={onChange} />
          </>
        )}
      </SubSection>
    </div>
  );
}

// --------------------------------------------------------------------- Salud
export function HealthStep({ values, onChange }: StepProps) {
  return (
    <FieldGrid>
      <SelectField name="eps" label="EPS" values={values} onChange={onChange}
        options={EPS_LIST} full />
      <SelectField name="blood_abo" label="Grupo sanguíneo" values={values}
        onChange={onChange} options={BLOOD_ABO} />
      <SelectField name="blood_rh" label="RH" values={values} onChange={onChange}
        options={BLOOD_RH} />

      {/* ⚠️ Estos nombres los lee `apply_alert_rules` en el backend. */}
      <YesNoField name="has_medical_condition"
        label="¿Tiene alguna condición médica relevante?" values={values} onChange={onChange} />
      <WhenYes when="has_medical_condition" values={values}>
        <TextAreaField name="medical_condition_detail" label="¿Cuál?" values={values}
          onChange={onChange} placeholder="Describa la condición y los cuidados que requiere" />
      </WhenYes>

      <YesNoField name="takes_medication" label="¿Toma algún medicamento?"
        values={values} onChange={onChange} />
      <WhenYes when="takes_medication" values={values}>
        <TextAreaField name="medication_detail" label="¿Cuál y con qué frecuencia?"
          values={values} onChange={onChange} />
      </WhenYes>

      <YesNoField name="has_diagnosis"
        label="¿Tiene algún diagnóstico (aprendizaje, atención, u otro)?"
        values={values} onChange={onChange} />
      <WhenYes when="has_diagnosis" values={values}>
        <TextAreaField name="diagnosis_detail" label="¿Cuál?" values={values} onChange={onChange} />
      </WhenYes>

      <YesNoField name="receives_therapy" label="¿Recibe alguna terapia?"
        values={values} onChange={onChange} />
      <WhenYes when="receives_therapy" values={values}>
        <TextAreaField name="therapy_detail" label="¿Cuál?" values={values} onChange={onChange} />
      </WhenYes>

      <YesNoField name="needs_learning_support"
        label="¿Requiere apoyos para el aprendizaje?" values={values} onChange={onChange} />
      <WhenYes when="needs_learning_support" values={values}>
        <TextAreaField name="learning_support_detail" label="¿Cuáles?" values={values} onChange={onChange} />
      </WhenYes>
    </FieldGrid>
  );
}

// -------------------------------------------------------------- Declaraciones
export function DeclarationsStep({ values, onChange }: StepProps) {
  return (
    <FieldGrid>
      <YesNoField name="accepts_truthfulness"
        label="Declaro que la información suministrada es veraz y completa."
        values={values} onChange={onChange} />
      <YesNoField name="accepts_data_policy"
        label="Autorizo el tratamiento de datos personales conforme a la política de la institución."
        values={values} onChange={onChange} />
      <Field name="signed_by" label="Nombre de quien declara" values={values}
        onChange={onChange} placeholder="Tu nombre completo" full />
    </FieldGrid>
  );
}
