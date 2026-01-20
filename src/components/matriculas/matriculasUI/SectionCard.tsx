import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface SectionCardProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    icon?: ReactNode;
    iconColor?: string;
}

export const SectionCard = ({
    title,
    children,
    defaultOpen = false,
    icon,
    iconColor = "primary",
}: SectionCardProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Map color names to Tailwind classes
    const getIconBgClass = (color: string) => {
        const colorMap: Record<string, string> = {
            primary: "bg-primary/10",
            secondary: "bg-secondary/10",
            accent: "bg-accent/10",
            success: "bg-success/10",
            warning: "bg-warning/10",
            error: "bg-error/10",
            info: "bg-info/10",
        };
        return colorMap[color] || "bg-primary/10";
    };

    const getIconTextClass = (color: string) => {
        const colorMap: Record<string, string> = {
            primary: "text-primary",
            secondary: "text-secondary",
            accent: "text-accent",
            success: "text-success",
            warning: "text-warning",
            error: "text-error",
            info: "text-info",
        };
        return colorMap[color] || "text-primary";
    };

    return (
        <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden shadow-sm group">
            <button
                type="button"
                className="w-full list-none cursor-pointer bg-base-200 px-6 py-4 flex items-center justify-between border-b border-base-300 hover:bg-base-200/70 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div
                            className={`p-2 rounded-lg ${getIconBgClass(
                                iconColor
                            )} ${getIconTextClass(iconColor)}`}
                        >
                            {icon}
                        </div>
                    )}
                    <h3 className="font-bold text-base-content text-lg">
                        {title}
                    </h3>
                </div>
                <ChevronDown
                    className={`h-5 w-5 text-base-content/40 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
                        }`}
                />
            </button>

            {/* Animated content with grid technique */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default SectionCard;
