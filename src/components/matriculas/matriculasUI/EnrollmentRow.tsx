import {
    Eye,
    MoreHorizontal,
    Check,
    MessageSquare,
    FileText,
    Ban,
    Pencil,
    Trash2,
    User,
} from "lucide-react";
import { getStatusLabel } from "@/utils/statusHelpers";

// Types
interface Student {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    photo_url?: string;
}

interface Grade {
    id: number;
    name: string;
    description: string;
}

interface Enrollment {
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

interface EnrollmentRowProps {
    enrollment: Enrollment;
    isLastRows: boolean;
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

// Helper function for status badge styles using theme colors with opacity and border
const getStatusBadgeStyle = (status: string) => {
    switch (status) {
        case "ACTIVE":
            return "bg-success/15 text-success border border-success/20";
        case "PENDING":
            return "bg-warning/15 text-warning border border-warning/20";
        case "IN_REVIEW":
            return "bg-info/15 text-info border border-info/20";
        case "CANCELLED":
            return "bg-error/15 text-error border border-error/20";
        default:
            return "bg-base-300 text-base-content border border-base-300";
    }
};

export const EnrollmentRow = ({
    enrollment,
    isLastRows,
    onViewDetails,
    onApprove,
    onRequestCorrection,
    onCancel,
    onDelete,
    onEdit,
    onGeneratePDFs,
    actionLoading,
    formatDate,
}: EnrollmentRowProps) => {
    const isLoading = actionLoading === enrollment.id;

    return (
        <tr className="hover:bg-base-200/50 transition-colors">
            {/* Estudiante con Avatar */}
            <td className="py-4 px-6 align-middle">
                <div className="flex items-center gap-3">
                    {/* Avatar más grande con borde */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 shrink-0 border border-base-300 overflow-hidden flex items-center justify-center">
                        {enrollment.student.photo_url ? (
                            <img
                                src={enrollment.student.photo_url}
                                alt={enrollment.student.first_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-5 h-5 text-primary/60" />
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-base-content leading-tight">
                            {enrollment.student.first_name} {enrollment.student.last_name}
                        </p>
                        <p className="text-xs text-base-content/50">
                            {enrollment.student.email}
                        </p>
                    </div>
                </div>
            </td>

            {/* Fecha de Matrícula */}
            <td className="py-4 px-6 text-base-content text-sm align-middle">
                {formatDate(enrollment.enrollment_date)}
            </td>

            {/* Estado */}
            <td className="py-4 px-6 text-center align-middle">
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeStyle(
                        enrollment.status
                    )}`}
                >
                    {getStatusLabel(enrollment.status)}
                </span>
            </td>

            {/* Acciones */}
            <td className="py-4 px-6 text-right align-middle">
                <div className="flex justify-end gap-2">
                    {/* Botón Ver Detalles */}
                    <button
                        className="p-2 text-base-content/40 hover:text-primary hover:bg-primary/10 rounded-full transition-all"
                        onClick={() => onViewDetails(enrollment)}
                        disabled={isLoading}
                        title="Ver detalles"
                    >
                        <Eye className="h-5 w-5" />
                    </button>

                    {/* Dropdown de Acciones */}
                    <div
                        className={`dropdown dropdown-end ${isLastRows ? "dropdown-top" : "dropdown-bottom"
                            }`}
                    >
                        <label
                            tabIndex={0}
                            className="p-2 text-base-content/40 hover:text-base-content hover:bg-base-200 rounded-full transition-all cursor-pointer inline-flex"
                        >
                            <MoreHorizontal className="h-5 w-5" />
                        </label>
                        <ul
                            tabIndex={0}
                            className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-lg w-52 border border-base-300"
                        >
                            {/* ESTADO: IN_REVIEW */}
                            {enrollment.status === "IN_REVIEW" && (
                                <>
                                    <li>
                                        <button
                                            onClick={() => onApprove(enrollment.id)}
                                            disabled={isLoading}
                                        >
                                            <Check size={16} /> Aprobar
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => onRequestCorrection(enrollment)}
                                            disabled={isLoading}
                                        >
                                            <MessageSquare size={16} /> Solicitar cambios
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => onGeneratePDFs(enrollment.id)}
                                            disabled={isLoading}
                                        >
                                            <FileText size={16} /> Generar PDFs
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => onCancel(enrollment.id)}
                                            disabled={isLoading}
                                        >
                                            <Ban size={16} /> Cancelar matrícula
                                        </button>
                                    </li>
                                </>
                            )}

                            {/* ESTADO: PENDING */}
                            {enrollment.status === "PENDING" && (
                                <>
                                    <li>
                                        <button
                                            onClick={() => onEdit(enrollment)}
                                            disabled={isLoading}
                                        >
                                            <Pencil size={16} /> Editar
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => onCancel(enrollment.id)}
                                            disabled={isLoading}
                                        >
                                            <Ban size={16} /> Cancelar matrícula
                                        </button>
                                    </li>
                                </>
                            )}

                            {/* ESTADO: ACTIVE */}
                            {enrollment.status === "ACTIVE" && (
                                <>
                                    <li>
                                        <button
                                            onClick={() => onGeneratePDFs(enrollment.id)}
                                            disabled={isLoading}
                                        >
                                            <FileText size={16} /> Generar PDFs
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => onCancel(enrollment.id)}
                                            className="text-error"
                                            disabled={isLoading}
                                        >
                                            <Ban size={16} /> Cancelar matrícula
                                        </button>
                                    </li>
                                </>
                            )}

                            {/* ESTADO: CANCELLED */}
                            {enrollment.status === "CANCELLED" && (
                                <li>
                                    <button
                                        onClick={() => onDelete(enrollment.id)}
                                        disabled={isLoading}
                                    >
                                        <Trash2 size={16} /> Eliminar permanentemente
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default EnrollmentRow;
