import {
    Eye,
    MoreVertical,
    Check,
    MessageSquare,
    FileText,
    Ban,
    Pencil,
    Trash2,
} from "lucide-react";
import { getStatusLabel, getStatusBadgeClass } from "@/utils/statusHelpers";

// Types
interface Student {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
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
        <tr>
            {/* Estudiante */}
            <td>
                <div className="font-medium">
                    {enrollment.student.first_name} {enrollment.student.last_name}
                </div>
                <div className="text-xs text-gray-500">{enrollment.student.email}</div>
            </td>

            {/* Fecha de Matrícula */}
            <td>{formatDate(enrollment.enrollment_date)}</td>

            {/* Estado */}
            <td>
                <span
                    className={`badge ${getStatusBadgeClass(
                        enrollment.status
                    )} whitespace-nowrap`}
                >
                    {getStatusLabel(enrollment.status)}
                </span>
            </td>

            {/* Acciones */}
            <td>
                <div className="flex items-center gap-1">
                    {/* Botón Ver Detalles */}
                    <button
                        className="btn btn-ghost btn-sm btn-circle text-info"
                        onClick={() => onViewDetails(enrollment)}
                        disabled={isLoading}
                        title="Ver detalles"
                    >
                        <Eye size={18} />
                    </button>

                    {/* Dropdown de Acciones */}
                    <div
                        className={`dropdown dropdown-end ${isLastRows ? "dropdown-top" : "dropdown-bottom"
                            }`}
                    >
                        <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                            <MoreVertical size={18} />
                        </label>
                        <ul
                            tabIndex={0}
                            className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            {/* ESTADO: IN_REVIEW */}
                            {enrollment.status === "IN_REVIEW" && (
                                <>
                                    <li>
                                        <button
                                            onClick={() => onApprove(enrollment.id)}
                                            className="text-success"
                                            disabled={isLoading}
                                        >
                                            <Check size={16} /> Aprobar
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => onRequestCorrection(enrollment)}
                                            className="text-warning"
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
                                            className="text-error"
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
                                            className="text-error"
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
                                        className="text-error"
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
