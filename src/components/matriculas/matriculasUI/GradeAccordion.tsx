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
    return (
        <div className="collapse collapse-arrow bg-base-200 overflow-visible">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium flex items-center gap-3">
                <span>{gradeName}</span>
                <span className="badge badge-neutral ml-auto">
                    {enrollments.length} Estudiantes
                </span>
            </div>
            <div className="collapse-content overflow-visible">
                <div className="overflow-x-auto mt-4 lg:overflow-visible">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Estudiante</th>
                                <th>Fecha de Matrícula</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
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
                </div>
            </div>
        </div>
    );
};

export default GradeAccordion;