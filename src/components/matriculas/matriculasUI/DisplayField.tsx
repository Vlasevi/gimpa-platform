interface DisplayFieldProps {
    label: string;
    value: string | number | boolean | null | undefined;
    highlight?: boolean;
}

export const DisplayField = ({
    label,
    value,
    highlight = false,
}: DisplayFieldProps) => {
    // Don't render if value is empty (but allow 0 and false)
    if (value === null || value === undefined || value === "") return null;

    // Format boolean values
    const displayValue =
        typeof value === "boolean" ? (value ? "Sí" : "No") : value;

    return (
        <div className="flex flex-col gap-1 py-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/40">
                {label}
            </span>
            <span
                className={`border-b border-base-200 pb-1 text-sm font-medium leading-snug ${
                    highlight ? "font-bold text-error" : "text-base-content/80"
                }`}
            >
                {displayValue}
            </span>
        </div>
    );
};

export default DisplayField;
