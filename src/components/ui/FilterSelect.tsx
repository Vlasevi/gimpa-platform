import { ChevronDown } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  /** Utilidades de ancho para el contenedor, p. ej. "w-56" o "min-w-[160px]". */
  className?: string;
  ariaLabel?: string;
}

/**
 * Select de filtro basado en el `dropdown` de daisyui (no en `<select>` nativo),
 * para que la opción seleccionada se resalte con el color del tema en vez del
 * ✓ que dibuja el navegador. El menú se cierra al elegir (blur) o al perder foco.
 */
export const FilterSelect = ({
  value,
  onChange,
  options,
  placeholder = "Seleccionar…",
  className = "",
  ariaLabel,
}: FilterSelectProps) => {
  const selected = options.find((o) => o.value === value);
  const close = () => (document.activeElement as HTMLElement | null)?.blur();

  return (
    <div className={`dropdown ${className}`}>
      <div
        tabIndex={0}
        role="button"
        aria-label={ariaLabel}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-base-300 bg-base-100 px-3 text-sm font-medium text-base-content transition-colors hover:border-base-content/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <span className={`truncate ${selected ? "" : "text-base-content/50"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-base-content/40" />
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-base-300 bg-base-100 p-1 shadow-lg"
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  close();
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? "bg-primary font-semibold text-primary-content"
                    : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                {o.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterSelect;
