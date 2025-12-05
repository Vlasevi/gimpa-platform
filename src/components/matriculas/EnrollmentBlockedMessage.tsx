import { AlertCircle, XCircle } from "lucide-react";
import { getStatusLabel } from "../../utils/statusHelpers";

interface EnrollmentBlockedMessageProps {
    message: string;
    targetYear: number;
    existingEnrollment?: {
        grade: {
            name: string;
        };
        status: string;
    };
}

export const EnrollmentBlockedMessage = ({
    message,
    targetYear,
    existingEnrollment,
}: EnrollmentBlockedMessageProps) => {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                {/* Icon and Title */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                            Matrícula No Disponible
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Año Académico {targetYear}
                        </p>
                    </div>
                </div>

                {/* Message */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-gray-700">{message}</p>
                </div>

                {/* Existing Enrollment Info (if applicable) */}
                {existingEnrollment && existingEnrollment.grade && existingEnrollment.status && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">
                            Matrícula Actual
                        </h3>
                        <div className="space-y-1 text-sm text-blue-800">
                            <p>
                                <span className="font-medium">Grado:</span>{" "}
                                {existingEnrollment.grade.name}
                            </p>
                            <p>
                                <span className="font-medium">Estado:</span>{" "}
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {getStatusLabel(existingEnrollment.status)}
                                </span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Help Text */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Si tienes alguna pregunta o crees que esto es un error, por favor
                        contacta a la rectoría.
                    </p>
                </div>
            </div>
        </div>
    );
};
