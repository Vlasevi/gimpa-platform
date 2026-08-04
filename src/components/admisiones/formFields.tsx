/** Campos compartidos del wizard de admisión (tokens del DESIGN_SYSTEM). */

export type SectionValues = Record<string, unknown>;

export const labelClass = "mb-1.5 block text-sm font-medium text-base-content/70";

export const controlClass =
  "h-12 w-full rounded-lg border border-base-300 bg-base-200 px-4 text-base text-base-content placeholder:text-base-content/40 transition-colors focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40";

/** Rejilla responsive de campos. */
export function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

type BaseProps = {
  name: string;
  label: string;
  values: SectionValues;
  onChange: (name: string, value: unknown) => void;
  placeholder?: string;
  full?: boolean;
};

export function Field({
  name,
  label,
  values,
  onChange,
  type = "text",
  placeholder,
  full,
}: BaseProps & { type?: string }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        className={controlClass}
        placeholder={placeholder}
        value={(values[name] as string) ?? ""}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  );
}

export function SelectField({
  name,
  label,
  values,
  onChange,
  options,
  full,
}: BaseProps & { options: readonly string[] }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <select
        id={name}
        className={controlClass}
        value={(values[name] as string) ?? ""}
        onChange={(e) => onChange(name, e.target.value)}
      >
        <option value="">Selecciona…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextAreaField({
  name,
  label,
  values,
  onChange,
  placeholder,
}: BaseProps) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <textarea
        id={name}
        rows={3}
        className="w-full rounded-lg border border-base-300 bg-base-200 px-4 py-3 text-base text-base-content placeholder:text-base-content/40 transition-colors focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
        placeholder={placeholder}
        value={(values[name] as string) ?? ""}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  );
}

/**
 * Pregunta de Sí/No.
 *
 * Guarda `"Si"` / `"No"` — el backend interpreta ese texto en las reglas de alerta
 * de P4 (`_is_yes`). Radios reales para que funcione con teclado y lector de pantalla.
 */
export function YesNoField({
  name,
  label,
  values,
  onChange,
  full = true,
}: BaseProps) {
  const current = (values[name] as string) ?? "";
  return (
    <fieldset className={full ? "sm:col-span-2" : undefined}>
      <legend className={labelClass}>{label}</legend>
      <div className="flex gap-2">
        {["Si", "No"].map((option) => {
          const active = current === option;
          return (
            <label
              key={option}
              className={`flex h-11 min-w-24 cursor-pointer items-center justify-center rounded-lg border px-5 text-sm font-medium transition-all duration-200 ease-out focus-within:ring-2 focus-within:ring-primary/40 motion-reduce:transition-none ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-base-300 bg-base-200 text-base-content/70 hover:bg-base-300/50"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={active}
                onChange={() => onChange(name, option)}
                className="sr-only"
              />
              {option === "Si" ? "Sí" : "No"}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Selección múltiple (se guarda como lista de strings). */
export function CheckboxGroupField({
  name,
  label,
  values,
  onChange,
  options,
}: BaseProps & { options: readonly string[] }) {
  const selected = Array.isArray(values[name]) ? (values[name] as string[]) : [];

  const toggle = (option: string) => {
    const next = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    onChange(name, next);
  };

  return (
    <fieldset className="sm:col-span-2">
      <legend className={labelClass}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <label
              key={option}
              className={`flex h-10 cursor-pointer items-center rounded-lg border px-4 text-sm font-medium transition-all duration-200 ease-out focus-within:ring-2 focus-within:ring-primary/40 motion-reduce:transition-none ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-base-300 bg-base-200 text-base-content/70 hover:bg-base-300/50"
              }`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggle(option)}
                className="sr-only"
              />
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Muestra un campo solo cuando la pregunta previa fue "Sí". */
export function WhenYes({
  when,
  values,
  children,
}: {
  when: string;
  values: SectionValues;
  children: React.ReactNode;
}) {
  if (((values[when] as string) ?? "") !== "Si") return null;
  return <>{children}</>;
}
