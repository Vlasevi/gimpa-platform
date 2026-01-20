import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { EnrollmentRow } from "./EnrollmentRow";

// Types (exported for reuse)
export interface Student {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export interface Grade {
    id: number;
    name: string;
    description: string;
}

export interface Enrollment {
    id: number;
    student: Student;
    grade: Grade;
    academic_year: number;
    enrollment_date: string;
    status: "PENDING" | "IN_REVIEW" | "ACTIVE" | "CANCELLED";
    is_editable: boolean;
    correction_comment?: string;
    submitted_at?: string;
    approved_at?: string;
    documents_folder_url?: string | null;
}

interface GradeAccordionProps {
    gradeName: string;
    enrollments: Enrollment[];
    isOpen: boolean;
    onToggle: () => void;
    onViewDetails: (enrollment: Enrollment) => void;
    onApprove: (id: number) => void;
    onRequestCorrection: (enrollment: Enrollment) => void;
    onCancel: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (enrollment: Enrollment) => void;
    onGeneratePDFs: (id: number) => void;
    actionLoading: number | null;
    formatDate: (dateString: string) => string;
}

export const GradeAccordion = ({
    gradeName,
    enrollments,
    isOpen,
    onToggle,
    onViewDetails,
    onApprove,
    onRequestCorrection,
    onCancel,
    onDelete,
    onEdit,
    onGeneratePDFs,
    actionLoading,
    formatDate,
}: GradeAccordionProps) => {
    const studentCount = enrollments.length;
    const studentLabel = studentCount === 1 ? "Estudiante" : "Estudiantes";
    const [allowOverflow, setAllowOverflow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setAllowOverflow(true), 350);
            return () => clearTimeout(timer);
        } else {
            setAllowOverflow(false);
        }
    }, [isOpen]);

    return (
        <div className="bg-base-100 border border-base-300 rounded-lg">
            {/* Header del acordeón */}
            <button
                type="button"
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-base-200 transition-colors rounded-t-lg"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    {isOpen ? (
                        <ChevronDown className="h-4 w-4 text-base-content/50" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-base-content/50" />
                    )}
                    <span className="font-bold text-base-content">{gradeName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-base-content/60">
                        {studentCount} {studentLabel}
                    </span>
                </div>
            </button>

            {/* Contenido del acordeón (Tabla) con animación */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    } ${allowOverflow ? "overflow-visible" : "overflow-hidden"}`}
            >
                <div className={allowOverflow ? "overflow-visible" : "overflow-hidden"}>
                    <div className="border-t border-base-300">
                        <div className={`bg-base-100 ${allowOverflow ? "overflow-visible" : "overflow-hidden"}`}>
                            {enrollments.length === 0 ? (
                                <div className="py-8 text-center text-base-content/50">
                                    No hay estudiantes matriculados
                                </div>
                            ) : (
                                <table className="w-full text-left border-separate border-spacing-0">
                                    <thead className="bg-base-200 border-b border-base-300">
                                        <tr className="text-base-content font-bold text-sm">
                                            <th className="py-4 px-6 align-middle">Estudiante</th>
                                            <th className="py-4 px-6 align-middle">
                                                Fecha de Matrícula
                                            </th>
                                            <th className="py-4 px-6 text-center align-middle">
                                                Estado
                                            </th>
                                            <th className="py-4 px-6 text-right align-middle">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-base-300">
                                        {enrollments.map((enrollment, index) => (
                                            <EnrollmentRow
                                                key={enrollment.id}
                                                enrollment={enrollment}
                                                isLastRows={index >= enrollments.length - 3}
                                                onViewDetails={onViewDetails}
                                                onApprove={onApprove}
                                                onRequestCorrection={onRequestCorrection}
                                                onCancel={onCancel}
                                                onDelete={onDelete}
                                                onEdit={onEdit}
                                                onGeneratePDFs={onGeneratePDFs}
                                                actionLoading={actionLoading}
                                                formatDate={formatDate}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradeAccordion;