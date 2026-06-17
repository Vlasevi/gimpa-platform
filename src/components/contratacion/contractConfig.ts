// Configuración compartida del módulo de contratación (espejo del backend).
import {
  DOCUMENT_TYPES, COUNTRIES, COLOMBIA_DEPARTMENTS, ATLANTICO_CITIES, EPS_LIST,
  GENDERS, BLOOD_ABO, BLOOD_RH, ACCOUNT_TYPES, EDUCATION_LEVELS,
} from "@/components/shared/formLists";

export type Widget = "text" | "number" | "date" | "email" | "select" | "search";

export interface FieldConfig {
  key: string;
  label: string;
  section: string;
  widget?: Widget;            // default "text"
  options?: string[];         // para select/search
  type?: "text" | "date" | "email" | "number"; // inputs simples / dinero (number)
  adminOnly?: boolean;        // nómina: solo la edita el admin
  employeeView?: boolean;     // el empleado lo VE (solo lectura) aunque sea adminOnly
  computed?: boolean;         // derivado, no editable (full_name, total, salary)
  auto?: "institutional_email" | "arl" | "bank"; // autocompletado, solo lectura
  cityOf?: string;            // ciudad dependiente de un departamento: desplegable si es "Atlántico", texto si no
}

export const DATA_SECTIONS = [
  { id: "personal", label: "Personales" },
  { id: "contacto", label: "Contacto / Residencia" },
  { id: "seguridad_social", label: "Seguridad Social" },
  { id: "bancario", label: "Bancario" },
  { id: "nomina", label: "Nómina" },
];

export const DATA_FIELDS: FieldConfig[] = [
  // Personales — nombre (full_name = unión, no editable)
  { key: "first_name1", label: "Primer Nombre", section: "personal" },
  { key: "first_name2", label: "Segundo Nombre", section: "personal" },
  { key: "last_name1", label: "Primer Apellido", section: "personal" },
  { key: "last_name2", label: "Segundo Apellido", section: "personal" },
  { key: "full_name", label: "Nombre Completo", section: "personal", computed: true },
  // Documento
  { key: "id_type", label: "Tipo de Documento", section: "personal", widget: "select", options: DOCUMENT_TYPES },
  { key: "id_number", label: "Número de Documento", section: "personal" },
  // Expedición
  { key: "id_issue_country", label: "País de Expedición", section: "personal", widget: "search", options: COUNTRIES },
  { key: "id_issue_department", label: "Departamento de Expedición", section: "personal", widget: "search", options: COLOMBIA_DEPARTMENTS },
  { key: "id_issue_city", label: "Ciudad de Expedición", section: "personal", widget: "search", options: ATLANTICO_CITIES, cityOf: "id_issue_department" },
  { key: "id_issue_date", label: "Fecha de Expedición", section: "personal", widget: "date" },
  // Nacimiento
  { key: "birth_country", label: "País de Nacimiento", section: "personal", widget: "search", options: COUNTRIES },
  { key: "birth_department", label: "Departamento de Nacimiento", section: "personal", widget: "search", options: COLOMBIA_DEPARTMENTS },
  { key: "birth_city", label: "Ciudad de Nacimiento", section: "personal", widget: "search", options: ATLANTICO_CITIES, cityOf: "birth_department" },
  { key: "birth_date", label: "Fecha de Nacimiento", section: "personal", widget: "date" },
  { key: "age", label: "Edad Actual", section: "personal", widget: "number", computed: true },
  // Otros
  { key: "gender", label: "Género", section: "personal", widget: "select", options: GENDERS },
  { key: "blood_abo", label: "Grupo Sanguíneo", section: "personal", widget: "select", options: BLOOD_ABO },
  { key: "blood_rh", label: "RH", section: "personal", widget: "select", options: BLOOD_RH },
  { key: "education_level", label: "Nivel Educativo", section: "personal", widget: "select", options: EDUCATION_LEVELS },
  { key: "years_of_study", label: "Años de Estudio", section: "personal", widget: "number" },
  // Contacto / residencia
  { key: "phone", label: "Número de Contacto", section: "contacto" },
  { key: "personal_email", label: "Correo Personal", section: "contacto", widget: "email" },
  { key: "institutional_email", label: "Correo Institucional", section: "contacto", widget: "email", auto: "institutional_email" },
  { key: "residence_address", label: "Dirección de Residencia", section: "contacto" },
  { key: "residence_department", label: "Departamento", section: "contacto", widget: "search", options: COLOMBIA_DEPARTMENTS },
  { key: "residence_city", label: "Ciudad", section: "contacto", widget: "search", options: ATLANTICO_CITIES, cityOf: "residence_department" },
  // Seguridad social
  { key: "eps", label: "E.P.S.", section: "seguridad_social", widget: "search", options: EPS_LIST },
  { key: "arl", label: "ARL", section: "seguridad_social", auto: "arl" },
  { key: "pension_fund", label: "Pensión", section: "seguridad_social" },
  // Bancario
  { key: "bank", label: "Banco", section: "bancario", auto: "bank" },
  { key: "account_number", label: "Número de Cuenta", section: "bancario" },
  { key: "account_type", label: "Tipo de Cuenta", section: "bancario", widget: "select", options: ACCOUNT_TYPES },
  // Nómina (solo admin). El salario va en letras + número; el total es la suma.
  { key: "salary_text", label: "Salario (en letras)", type: "text", section: "nomina", adminOnly: true },
  { key: "salary_number", label: "Salario (número)", type: "number", section: "nomina", adminOnly: true },
  { key: "transport_allowance", label: "Auxilio de Transporte", type: "number", section: "nomina", adminOnly: true },
  { key: "otros", label: "Otros", type: "number", section: "nomina", adminOnly: true },
  { key: "total", label: "Total", type: "number", section: "nomina", adminOnly: true, computed: true },
  // Derivado: "texto (número)". Es lo único de nómina que ve el empleado.
  { key: "salary", label: "Salario", type: "text", section: "nomina", adminOnly: true, employeeView: true, computed: true },
];

// Helpers de nómina (salario combinado + total)
const _num = (v: any) => parseInt(String(v ?? "").replace(/\D/g, ""), 10) || 0;

// Formatea dígitos con separador de miles (punto): "1750000" -> "1.750.000"
export const formatMoney = (v: any) => {
  const digits = String(v ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const computeNominaTotal = (d: Record<string, any>) =>
  _num(d.salary_number) + _num(d.transport_allowance) + _num(d.otros);

export const computeSalaryCombined = (d: Record<string, any>) => {
  const text = (d.salary_text || "").trim();
  const number = formatMoney(d.salary_number);
  if (!text && !number) return d.salary || "";
  return number ? `${text} (${number})`.trim() : text;
};

// full_name = unión de las partes; si no hay partes, conserva el existente.
export const computeFullName = (d: Record<string, any>) => {
  const parts = [d.first_name1, d.first_name2, d.last_name1, d.last_name2]
    .map((x) => String(x ?? "").trim())
    .filter(Boolean);
  return parts.length ? parts.join(" ") : (d.full_name || "");
};

// Edad calculada a partir de la fecha de nacimiento (YYYY-MM-DD).
export const computeAge = (birthDate?: string) => {
  if (!birthDate) return "";
  const b = new Date(birthDate);
  if (isNaN(b.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age >= 0 ? String(age) : "";
};

// Valores por defecto (variables de entorno con fallback)
export const CONTRACT_DEFAULTS = {
  arl: (import.meta.env.VITE_CONTRACT_ARL as string) || "SURA",
  bank: (import.meta.env.VITE_CONTRACT_BANK as string) || "Davivienda",
  accountType: (import.meta.env.VITE_CONTRACT_ACCOUNT_TYPE as string) || "Ahorros",
};

export interface DocConfig {
  key: string;
  label: string;
  cls: "normal" | "medical" | "sensitive";
  required: boolean;
  // Documento que sube el empleado en el wizard (vs generado/firmado o admin)
  employeeUpload: boolean;
}

export const CONTRACT_DOCUMENTS: DocConfig[] = [
  { key: "profile_photo", label: "Foto de Perfil", cls: "normal", required: true, employeeUpload: false },
  { key: "hoja_vida", label: "Hoja de Vida", cls: "normal", required: true, employeeUpload: true },
  { key: "titulos", label: "Títulos (diplomas/actas)", cls: "normal", required: true, employeeUpload: true },
  { key: "escalafon_docente", label: "Escalafón Docente (si aplica)", cls: "normal", required: false, employeeUpload: true },
  { key: "cert_estudios_complementarios", label: "Certificados Complementarios (opcional)", cls: "normal", required: false, employeeUpload: true },
  { key: "cedula", label: "Cédula de Ciudadanía", cls: "sensitive", required: true, employeeUpload: true },
  { key: "cert_pension", label: "Certificado de Pensión", cls: "sensitive", required: true, employeeUpload: true },
  { key: "antecedentes_fiscales", label: "Antecedentes Fiscales (Contraloría)", cls: "sensitive", required: true, employeeUpload: true },
  { key: "antecedentes_disciplinarios", label: "Antecedentes Disciplinarios (Procuraduría)", cls: "sensitive", required: true, employeeUpload: true },
  { key: "antecedentes_judiciales", label: "Antecedentes Judiciales (Policía)", cls: "sensitive", required: true, employeeUpload: true },
  { key: "cert_bancario", label: "Certificado de Cuenta Bancaria", cls: "sensitive", required: true, employeeUpload: true },
  { key: "manual_funciones_firmado", label: "Manual de Funciones (firmado)", cls: "normal", required: false, employeeUpload: false },
  { key: "contrato_firmado", label: "Contrato Firmado", cls: "sensitive", required: false, employeeUpload: false },
];

export const REQUIRED_EMPLOYEE_DOCS = CONTRACT_DOCUMENTS.filter(
  (d) => d.required,
).map((d) => d.key);

export const STATUS_LABELS: Record<string, string> = {
  ENABLED: "Habilitado",
  IN_REVIEW: "En Revisión",
  PENDING: "Pendiente (corrección)",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  INACTIVE: "Inactivo",
};

export const STATUS_BADGE: Record<string, string> = {
  ENABLED: "badge-info",
  IN_REVIEW: "badge-warning",
  PENDING: "badge-warning",
  APPROVED: "badge-success",
  REJECTED: "badge-error",
  INACTIVE: "badge-ghost",
};
