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
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {label}
            </span>
            <span
                className={`font-medium text-sm text-gray-700 leading-snug border-b border-gray-100 pb-1 ${highlight ? "text-red-500 font-bold" : ""
                    }`}
            >
                {displayValue}
            </span>
        </div>
    );
};

export default DisplayField;
