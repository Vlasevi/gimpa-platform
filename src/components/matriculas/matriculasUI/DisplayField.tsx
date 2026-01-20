interface DisplayFieldProps {
    label: string;
    value: string | number | boolean | null | undefined;
}

export const DisplayField = ({ label, value }: DisplayFieldProps) => {
    // Don't render if value is empty (but allow 0 and false)
    if (value === null || value === undefined || value === "") return null;

    // Format boolean values
    const displayValue =
        typeof value === "boolean" ? (value ? "Sí" : "No") : value;

    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text font-medium text-gray-600">{label}</span>
            </label>
            <div className="input input-bordered w-full bg-gray-50 cursor-default flex items-center">
                {displayValue}
            </div>
        </div>
    );
};

export default DisplayField;
