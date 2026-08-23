/**
 * Bloques reutilizables del wizard: residencia con geo (api-colombia) y datos de una
 * persona. Se parametrizan con un `prefix` para reusarlos en estudiante, padre, madre
 * y acudiente sin repetir 60+ campos.
 *
 * Los dropdowns usan el `ComboBox` buscable (mismo estilo que matrículas). El orden y
 * los campos de residencia replican los de matrículas.
 */

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  COUNTRIES,
  BARRIOS_BARRANQUILLA,
  DOCUMENT_TYPES,
} from "@/components/shared/formLists";
import { apiFetch, API_ENDPOINTS } from "@/utils/api";
import { Field, FieldGrid, SelectField, type SectionValues } from "./formFields";
import { ComboBox } from "./ComboBox";

type GeoItem = { id: number; name: string };

interface PrefixProps {
  prefix: string;
  values: SectionValues;
  onChange: (name: string, value: unknown) => void;
}

const STRATA = ["1", "2", "3", "4", "5", "6"];

/**
 * Residencia con país/departamento/ciudad/barrio en cascada (api-colombia). Mismos
 * campos y orden que matrículas. Claves con `prefix`: p.ej.
 * prefix="father_residence_" → `father_residence_country`.
 */
export function GeoResidenceFields({ prefix, values, onChange }: PrefixProps) {
  const [departments, setDepartments] = useState<GeoItem[]>([]);
  const [cities, setCities] = useState<GeoItem[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const k = (name: string) => `${prefix}${name}`;
  const country = (values[k("country")] as string) ?? "";
  const isColombia = country === "Colombia";
  const departmentId = values[k("department_id")] as number | undefined;
  const department = (values[k("department")] as string) ?? "";
  const city = (values[k("city")] as string) ?? "";

  useEffect(() => {
    if (!isColombia) {
      setDepartments([]);
      return;
    }
    let active = true;
    setLoadingDepts(true);
    apiFetch(API_ENDPOINTS.geoDepartments)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => active && setDepartments(d))
      .catch(() => undefined)
      .finally(() => active && setLoadingDepts(false));
    return () => {
      active = false;
    };
  }, [isColombia]);

  useEffect(() => {
    if (!isColombia || !departmentId) {
      setCities([]);
      return;
    }
    let active = true;
    setLoadingCities(true);
    apiFetch(`${API_ENDPOINTS.geoCities}?department=${departmentId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((c) => active && setCities(c))
      .catch(() => undefined)
      .finally(() => active && setLoadingCities(false));
    return () => {
      active = false;
    };
  }, [isColombia, departmentId]);

  const onCountry = (v: string) => {
    onChange(k("country"), v);
    onChange(k("department"), "");
    onChange(k("department_id"), undefined);
    onChange(k("city"), "");
    onChange(k("barrio"), "");
  };
  const onDepartment = (name: string) => {
    const d = departments.find((x) => x.name === name);
    onChange(k("department"), name);
    onChange(k("department_id"), d ? d.id : undefined);
    onChange(k("city"), "");
    onChange(k("barrio"), "");
  };
  const onCity = (name: string) => {
    onChange(k("city"), name);
    onChange(k("barrio"), "");
  };

  return (
    <>
      {/* País */}
      <ComboBox label="País de Residencia" options={COUNTRIES}
        value={country} onChange={onCountry} />
      {country === "Otro" && (
        <Field name={k("country_other")} label="¿Cuál país?" values={values} onChange={onChange} />
      )}

      {/* Departamento */}
      {isColombia ? (
        <ComboBox label="Departamento" options={departments.map((d) => d.name)}
          value={department} onChange={onDepartment} loading={loadingDepts} />
      ) : country ? (
        <Field name={k("department")} label="Departamento / Estado" values={values} onChange={onChange} />
      ) : null}

      {/* Ciudad */}
      {isColombia ? (
        <ComboBox label="Ciudad" options={cities.map((c) => c.name)}
          value={city} onChange={onCity} disabled={!departmentId} loading={loadingCities} />
      ) : country ? (
        <Field name={k("city")} label="Ciudad" values={values} onChange={onChange} />
      ) : null}

      {/* Barrio */}
      {city === "Barranquilla" ? (
        <>
          <ComboBox label="Barrio de Residencia" options={BARRIOS_BARRANQUILLA}
            value={(values[k("barrio")] as string) ?? ""}
            onChange={(v) => onChange(k("barrio"), v)} />
          {(values[k("barrio")] as string) === "Otro" && (
            <Field name={k("barrio_other")} label="Especifique el barrio"
              values={values} onChange={onChange} />
          )}
        </>
      ) : (
        <Field name={k("barrio")} label="Barrio de Residencia" values={values} onChange={onChange} />
      )}

      {/* Dirección / complemento / estrato */}
      <Field name={k("address")} label="Dirección" values={values} onChange={onChange}
        placeholder="Cra 45 # 72-30" />
      <Field name={k("address_complement")} label="Complemento (Apto, Torre)"
        values={values} onChange={onChange} />
      <SelectField name={k("stratum")} label="Estrato" values={values} onChange={onChange}
        options={STRATA} />
    </>
  );
}

/**
 * Datos personales de una persona (nombres, documento, contacto). Claves con `prefix`:
 * p.ej. prefix="father_" → `father_firstname1`. El trabajo va aparte en `WorkFields`,
 * para que el orden sea: nombres → residencia → trabajo.
 */
export function PersonFields({ prefix, values, onChange }: PrefixProps) {
  const k = (name: string) => `${prefix}${name}`;
  return (
    <>
      <Field name={k("firstname1")} label="Primer nombre" values={values} onChange={onChange} />
      <Field name={k("firstname2")} label="Segundo nombre" values={values} onChange={onChange} />
      <Field name={k("lastname1")} label="Primer apellido" values={values} onChange={onChange} />
      <Field name={k("lastname2")} label="Segundo apellido" values={values} onChange={onChange} />
      <SelectField name={k("document_type")} label="Tipo de documento" values={values}
        onChange={onChange} options={DOCUMENT_TYPES} />
      <Field name={k("id_number")} label="Número de documento" values={values} onChange={onChange} />
      <Field name={k("email")} label="Correo electrónico" type="email" values={values} onChange={onChange} />
      <Field name={k("phone")} label="Celular" type="tel" values={values} onChange={onChange} />
      <Field name={k("religion")} label="Religión" values={values} onChange={onChange} />
    </>
  );
}

/** Datos laborales de una persona (van al final, después de la residencia). */
export function WorkFields({ prefix, values, onChange }: PrefixProps) {
  const k = (name: string) => `${prefix}${name}`;
  return (
    <>
      <Field name={k("profession")} label="Profesión / ocupación" values={values} onChange={onChange} />
      <Field name={k("work_phone")} label="Teléfono del trabajo" type="tel" values={values} onChange={onChange} />
      <Field name={k("company_name")} label="Empresa donde trabaja" values={values} onChange={onChange} />
      <Field name={k("company_address")} label="Dirección de la empresa" values={values} onChange={onChange} full />
    </>
  );
}

/**
 * Sub-sección plegable, **controlada** por el padre (acordeón: solo una abierta a la
 * vez). Estilo del `SectionCard` de matrículas.
 */
export function SubSection({
  title,
  children,
  open,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <h3 className="font-display text-base font-semibold text-secondary">{title}</h3>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-base-content/40 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-base-300 p-5">
          <FieldGrid>{children}</FieldGrid>
        </div>
      )}
    </div>
  );
}
