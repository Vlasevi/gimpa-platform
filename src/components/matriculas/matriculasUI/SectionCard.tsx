import { useState } from "react";

interface SectionCardProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const SectionCard = ({
    title,
    children,
    defaultOpen = false,
}: SectionCardProps) => {
    const [isOpen, setIsOpen] = useState(
        defaultOpen || title === "Información del Estudiante"
    );

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
            <button
                type="button"
                className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                    {title}
                </h3>
                <span
                    className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                        }`}
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </span>
            </button>
            <div
                className={`border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default SectionCard;
