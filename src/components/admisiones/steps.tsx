/**
 * Pasos del wizard de solicitud de admisión (P1–P6).
 *
 * Cada paso edita **una sección** de `AdmissionApplication.data` y se guarda con
 * `PATCH { sections: { <clave>: {...} } }`.
 *
 * ⚠️ Los campos de Salud (`has_medical_condition`, `takes_medication`,
 * `has_diagnosis`, `receives_therapy`, `needs_learning_support`) deben conservar
 * estos nombres: son los que lee `apply_alert_rules` en el backend para marcar
 * `alert_health` / `alert_psychopedagogical`.
 */

import {
  COUNTRIES,
  COLOMBIA_DEPARTMENTS,
  ATLANTICO_CITIES,
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
  CheckboxGroupField,
  type SectionValues,
} from "./formFields";

export interface StepProps {
  values: SectionValues;
  onChange: (name: string, value: unknown) => void;
}

const STRATA = ["1", "2", "3", "4", "5", "6"];

const CHANGE_REASONS = [
  "Traslado de ciudad o domicilio",
  "Motivos académicos",
  "Convivencia",
  "Económico",
  "Familiar",
  "Inclusión o apoyo",
  "Otro",
];

const DIFFICULTY_AREAS = [
  "Matemáticas",
  "Lectura",
  "Escritura",
  "Inglés",
  "Convivencia",
  "Atención",
  "Otra",
];

const ROUTES = [
  "Regular",
  "Flexible",
  "Diagnóstico",
  "Preescolar",
  "Otra",
];

const RELATIONSHIPS = ["Madre", "Padre", "Abuelo/a", "Tío/a", "Tutor/a legal", "Otro"];

// ---------------------------------------------------------------- Residencia
export function ResidenceStep({ values, onChange }: StepProps) {
  return (
    <FieldGrid>
      <Field name="address" label="Dirección" values={values} onChange={onChange}
        placeholder="Cra 45 # 72-30" full />
      <Field name="address_complement" label="Complemento (apto, torre…)"
        values={values} onChange={onChange} />
      <Field name="barrio" label="Barrio" values={values} onChange={onChange} />
      <SelectField name="city" label="Ciudad" values={values} onChange={onChange}
        options={ATLANTICO_CITIES} />
      <SelectField name="department" label="Departamento" values={values}
        onChange={onChange} options={COLOMBIA_DEPARTMENTS} />
      <SelectField name="country" label="País" values={values} onChange={onChange}
        options={COUNTRIES} />
      <SelectField name="stratum" label="Estrato" values={values} onChange={onChange}
        options={STRATA} />
    </FieldGrid>
  );
}

// -------------------------------------------------------- Historial académico
export function AcademicHistoryStep({ values, onChange }: StepProps) {
  return (
    <FieldGrid>
      <Field name="previous_school" label="Colegio anterior" values={values}
        onChange={onChange} placeholder="Nombre de la institución" full />
      <Field name="last_grade_completed" label="Último grado cursado"
        values={values} onChange={onChange} />
      <Field name="last_year" label="Año en que lo cursó" type="number"
        values={values} onChange={onChange} placeholder="2025" />
      <SelectField name="change_reason" label="Motivo del cambio de colegio"
        values={values} onChange={onChange} options={CHANGE_REASONS} full />
      <YesNoField name="has_repeated_grade" label="¿Ha repetido algún grado?"
        values={values} onChange={onChange} />
      <WhenYes when="has_repeated_grade" values={values}>
        <Field name="repeated_grade_detail" label="¿Cuál grado y por qué?"
          values={values} onChange={onChange} full />
      </WhenYes>
      <YesNoField name="has_academic_difficulties"
        label="¿Ha presentado dificultades académicas?" values={values}
        onChange={onChange} />
      <WhenYes when="has_academic_difficulties" values={values}>
        <CheckboxGroupField name="difficulty_areas" label="¿En qué áreas?"
          values={values} onChange={onChange} options={DIFFICULTY_AREAS} />
      </WhenYes>
    </FieldGrid>
  );
}

// ---------------------------------------------------------------- Acudientes
export function GuardiansStep({ values, onChange }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-display text-base font-semibold text-secondary">
          Acudiente principal
        </h3>
        <FieldGrid>
          <Field name="principal_name" label="Nombre completo" values={values}
            onChange={onChange} full />
          <SelectField name="principal_relationship" label="Parentesco"
            values={values} onChange={onChange} options={RELATIONSHIPS} />
          <SelectField name="principal_document_type" label="Tipo de documento"
            values={values} onChange={onChange} options={DOCUMENT_TYPES} />
          <Field name="principal_id_number" label="Número de documento"
            values={values} onChange={onChange} />
          <Field name="principal_phone" label="Celular" type="tel" values={values}
            onChange={onChange} />
          <Field name="principal_email" label="Correo electrónico" type="email"
            values={values} onChange={onChange} full />
          <Field name="principal_occupation" label="Ocupación" values={values}
            onChange={onChange} />
        </FieldGrid>
      </div>

      <div className="border-t border-base-300 pt-6">
        <h3 className="mb-4 font-display text-base font-semibold text-secondary">
          Responsable financiero
        </h3>
        <FieldGrid>
          <YesNoField name="financial_same_as_principal"
            label="¿Es la misma persona que el acudiente principal?"
            values={values} onChange={onChange} />
          {((values.financial_same_as_principal as string) ?? "") === "No" && (
            <>
              <Field name="financial_name" label="Nombre completo" values={values}
                onChange={onChange} full />
              <SelectField name="financial_relationship" label="Parentesco"
                values={values} onChange={onChange} options={RELATIONSHIPS} />
              <Field name="financial_id_number" label="Número de documento"
                values={values} onChange={onChange} />
              <Field name="financial_phone" label="Celular" type="tel"
                values={values} onChange={onChange} />
              <Field name="financial_email" label="Correo electrónico" type="email"
                values={values} onChange={onChange} />
            </>
          )}
        </FieldGrid>
      </div>
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
        label="¿Tiene alguna condición médica relevante?" values={values}
        onChange={onChange} />
      <WhenYes when="has_medical_condition" values={values}>
        <TextAreaField name="medical_condition_detail" label="¿Cuál?"
          values={values} onChange={onChange}
          placeholder="Describa la condición y los cuidados que requiere" />
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
        <TextAreaField name="diagnosis_detail" label="¿Cuál?" values={values}
          onChange={onChange} />
      </WhenYes>

      <YesNoField name="receives_therapy" label="¿Recibe alguna terapia?"
        values={values} onChange={onChange} />
      <WhenYes when="receives_therapy" values={values}>
        <TextAreaField name="therapy_detail" label="¿Cuál?" values={values}
          onChange={onChange} />
      </WhenYes>

      <YesNoField name="needs_learning_support"
        label="¿Requiere apoyos para el aprendizaje?" values={values}
        onChange={onChange} />
      <WhenYes when="needs_learning_support" values={values}>
        <TextAreaField name="learning_support_detail" label="¿Cuáles?"
          values={values} onChange={onChange} />
      </WhenYes>
    </FieldGrid>
  );
}

// ------------------------------------------------------------ Ruta y jornada
export function RouteRequestStep({ values, onChange }: StepProps) {
  return (
    <FieldGrid>
      <SelectField name="requested_route" label="Ruta solicitada" values={values}
        onChange={onChange} options={ROUTES} full />
      <YesNoField name="needs_transport" label="¿Requiere transporte escolar?"
        values={values} onChange={onChange} />
      <TextAreaField name="notes" label="Comentarios adicionales" values={values}
        onChange={onChange}
        placeholder="Cuéntanos cualquier cosa que debamos tener en cuenta" />
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
