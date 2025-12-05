// components/Matriculas/MatriculasAdmin.tsx
import { useState, useEffect } from "react";
import { FilePlus, UserPlus } from "lucide-react";
import UserRegister from "@/components/auxiliar/userRegister";
import UserEnroll from "@/components/auxiliar/userEnroll";
import { X } from "lucide-react";
import { getStatusLabel, getStatusBadgeClass } from "@/utils/statusHelpers";
import { apiUrl, API_ENDPOINTS } from "@/utils/api";

// Helper para obtener CSRF token
const getCsrfToken = () => {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(name + "=")) {
      return decodeURIComponent(trimmedCookie.substring(name.length + 1));
    }
  }
  return null;
};

interface Grade {
  id: number;
  name: string;
  description: string;
}

interface Student {
  first_name: string;
  last_name: string;
  email: string;
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
}

interface EnrollmentsByGrade {
  [gradeName: string]: Enrollment[];
}

export const MatriculasAdmin = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [correctionMessage, setCorrectionMessage] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Fetch de matrículas y grados
  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch matrículas
      const enrollmentsRes = await fetch(
        apiUrl(`${API_ENDPOINTS.enrollments}?academic_year=${selectedYear}`),
        { credentials: "include" }
      );
      const enrollmentsData = await enrollmentsRes.json();

      // Fetch grados
      const gradesRes = await fetch(apiUrl(API_ENDPOINTS.grades), {
        credentials: "include",
      });
      const gradesData = await gradesRes.json();

      setEnrollments(enrollmentsData);
      setGrades(gradesData);
      setError(null);
    } catch (err) {
      setError("Error al cargar las matrículas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // API functions for enrollment management
  const approveEnrollment = async (enrollmentId: number) => {
    setActionLoading(enrollmentId);
    try {
      const response = await fetch(
        apiUrl(API_ENDPOINTS.enrollmentApprove(enrollmentId)),
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken() || "",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al aprobar matrícula");
      }

      await fetchData(); // Refresh data
      alert("Matrícula aprobada exitosamente");
    } catch (err: any) {
      alert(err.message || "Error al aprobar matrícula");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const requestCorrection = async () => {
    if (!selectedEnrollment || !correctionMessage.trim()) {
      alert("Debes proporcionar un mensaje de corrección");
      return;
    }

    setActionLoading(selectedEnrollment.id);
    try {
      const response = await fetch(
        apiUrl(
          API_ENDPOINTS.enrollmentRequestCorrection(selectedEnrollment.id)
        ),
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken() || "",
          },
          body: JSON.stringify({
            correction_comment: correctionMessage,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al solicitar corrección");
      }

      await fetchData(); // Refresh data
      setShowCorrectionModal(false);
      setCorrectionMessage("");
      setSelectedEnrollment(null);
      alert("Corrección solicitada exitosamente");
    } catch (err: any) {
      alert(err.message || "Error al solicitar corrección");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const cancelEnrollment = async (enrollmentId: number) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta matrícula?")) {
      return;
    }

    setActionLoading(enrollmentId);
    try {
      const response = await fetch(
        apiUrl(API_ENDPOINTS.enrollmentCancel(enrollmentId)),
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken() || "",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cancelar matrícula");
      }

      await fetchData(); // Refresh data
      alert("Matrícula cancelada exitosamente");
    } catch (err: any) {
      alert(err.message || "Error al cancelar matrícula");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteEnrollment = async (enrollmentId: number) => {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar permanentemente esta matrícula? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    setActionLoading(enrollmentId);
    try {
      const response = await fetch(
        apiUrl(API_ENDPOINTS.enrollmentDelete(enrollmentId)),
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "X-CSRFToken": getCsrfToken() || "",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar matrícula");
      }

      await fetchData(); // Refresh data
      alert("Matrícula eliminada exitosamente");
    } catch (err: any) {
      alert(err.message || "Error al eliminar matrícula");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const updateEnrollmentGradeYear = async (
    enrollmentId: number,
    gradeId: number,
    academicYear: number
  ) => {
    setActionLoading(enrollmentId);
    try {
      const response = await fetch(
        apiUrl(API_ENDPOINTS.enrollmentUpdateGradeYear(enrollmentId)),
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken() || "",
          },
          body: JSON.stringify({
            grade_id: gradeId,
            academic_year: academicYear,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar matrícula");
      }

      await fetchData(); // Refresh data
      setShowEditModal(false);
      setSelectedEnrollment(null);
      alert("Matrícula actualizada exitosamente");
    } catch (err: any) {
      alert(err.message || "Error al actualizar matrícula");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const generatePDFs = async (enrollmentId: number) => {
    if (!confirm("¿Generar contrato y pagaré para esta matrícula?")) {
      return;
    }

    setActionLoading(enrollmentId);
    try {
      const response = await fetch(
        apiUrl(API_ENDPOINTS.enrollmentGeneratePdfs(enrollmentId)),
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken() || "",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al generar PDFs");
      }

      const data = await response.json();
      alert(
        `✅ ${data.message}\n\nArchivos generados:\n- ${data.files[0]}\n- ${data.files[1]}\n\nRevisa la carpeta del estudiante en OneDrive.`
      );
    } catch (err: any) {
      alert(err.message || "Error al generar PDFs");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Agrupar matrículas por grado
  const enrollmentsByGrade: EnrollmentsByGrade = enrollments
    .filter(
      (enrollment) =>
        enrollment.academic_year === selectedYear &&
        (
          enrollment.student.first_name.toLowerCase() +
          " " +
          enrollment.student.last_name.toLowerCase() +
          " " +
          enrollment.student.email.toLowerCase()
        ).includes(searchTerm.toLowerCase())
    )
    .reduce((acc, enrollment) => {
      const gradeName = enrollment.grade.description;
      if (!acc[gradeName]) {
        acc[gradeName] = [];
      }
      acc[gradeName].push(enrollment);
      return acc;
    }, {} as EnrollmentsByGrade);

  // Función para obtener el color del badge según el estado (deprecated - usar getStatusBadgeClass)
  const getStatusBadge = (status: string) => {
    return getStatusBadgeClass(status);
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const enrollmentYears = Array.from(
    new Set(enrollments.map((e) => e.academic_year))
  ).sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Matrículas
        </h1>
        <div className="flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => setShowEnrollModal(true)}
          >
            <FilePlus size={18} className="mr-1" />
            Nueva Matrícula
          </button>
          <button
            className="btn btn-primary ml-0.5"
            onClick={() => setShowRegisterModal(true)}
          >
            <UserPlus size={18} className="mr-1" />
            Registrar estudiante
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        {/* Selector de año */}
        <select
          className="select select-bordered w-32"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {enrollmentYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar estudiante..."
          className="input input-bordered flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="stats shadow mb-6 w-full">
        <div className="stat">
          <div className="stat-title">Total Matrículas</div>
          <div className="stat-value text-primary">
            {enrollments.filter((e) => e.academic_year === selectedYear).length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Grados</div>
          <div className="stat-value text-secondary">
            {Object.keys(enrollmentsByGrade).length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Año Académico</div>
          <div className="stat-value text-accent">{selectedYear}</div>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(enrollmentsByGrade).map(
          ([gradeName, gradeEnrollments]) => (
            <div
              key={gradeName}
              className="collapse collapse-arrow bg-base-200"
            >
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium flex items-center gap-3">
                <span>{gradeName}</span>
                <span className="badge badge-neutral ml-auto">
                  {gradeEnrollments.length} Estudiantes
                </span>
              </div>
              <div className="collapse-content">
                <div className="overflow-x-auto mt-4">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th>Fecha de Matrícula</th>
                        <th>Estado</th>
                        <th>Editable</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradeEnrollments.map((enrollment) => (
                        <tr key={enrollment.id}>
                          <td>
                            <div className="font-medium">
                              {enrollment.student.first_name}{" "}
                              {enrollment.student.last_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {enrollment.student.email}
                            </div>
                          </td>
                          <td>{formatDate(enrollment.enrollment_date)}</td>
                          <td>
                            <span
                              className={`badge ${getStatusBadge(
                                enrollment.status
                              )}`}
                            >
                              {getStatusLabel(enrollment.status)}
                            </span>
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              className="checkbox checkbox-sm"
                              checked={enrollment.is_editable}
                              onChange={() => {
                                // TODO: Implementar toggle de is_editable
                                console.log("Toggle editable", enrollment.id);
                              }}
                            />
                          </td>
                          <td>
                            <div className="flex gap-2">
                              {enrollment.status === "IN_REVIEW" && (
                                <>
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() =>
                                      approveEnrollment(enrollment.id)
                                    }
                                    disabled={actionLoading === enrollment.id}
                                  >
                                    {actionLoading === enrollment.id ? (
                                      <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                      "✓ Aprobar"
                                    )}
                                  </button>
                                  <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => {
                                      setSelectedEnrollment(enrollment);
                                      setShowCorrectionModal(true);
                                    }}
                                    disabled={actionLoading === enrollment.id}
                                  >
                                    ✏️ Corregir
                                  </button>
                                  <button
                                    className="btn btn-sm btn-accent"
                                    onClick={() => generatePDFs(enrollment.id)}
                                    disabled={actionLoading === enrollment.id}
                                  >
                                    {actionLoading === enrollment.id ? (
                                      <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                      "📄 Generar PDFs"
                                    )}
                                  </button>
                                  <button
                                    className="btn btn-sm btn-error"
                                    onClick={() =>
                                      cancelEnrollment(enrollment.id)
                                    }
                                    disabled={actionLoading === enrollment.id}
                                  >
                                    {actionLoading === enrollment.id ? (
                                      <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                      "✕ Cancelar"
                                    )}
                                  </button>
                                </>
                              )}

                              {enrollment.status === "PENDING" && (
                                <>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setSelectedEnrollment(enrollment);
                                      setShowEditModal(true);
                                    }}
                                    disabled={actionLoading === enrollment.id}
                                  >
                                    ✏️ Editar
                                  </button>
                                  <button
                                    className="btn btn-sm btn-error"
                                    onClick={() =>
                                      cancelEnrollment(enrollment.id)
                                    }
                                    disabled={actionLoading === enrollment.id}
                                  >
                                    {actionLoading === enrollment.id ? (
                                      <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                      "✕ Cancelar"
                                    )}
                                  </button>
                                </>
                              )}

                              {enrollment.status === "ACTIVE" && (
                                <>
                                  <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => {
                                      setSelectedEnrollment(enrollment);
                                      setShowViewModal(true);
                                    }}
                                  >
                                    👁️ Ver
                                  </button>
                                  <button
                                    className="btn btn-sm btn-accent"
                                    onClick={() => generatePDFs(enrollment.id)}
                                    disabled={actionLoading === enrollment.id}
                                  >
                                    {actionLoading === enrollment.id ? (
                                      <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                      "📄 Generar PDFs"
                                    )}
                                  </button>
                                  <button
                                    className="btn btn-sm btn-error"
                                    onClick={() =>
                                      cancelEnrollment(enrollment.id)
                                    }
                                    disabled={actionLoading === enrollment.id}
                                  >
                                    {actionLoading === enrollment.id ? (
                                      <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                      "✕ Cancelar"
                                    )}
                                  </button>
                                </>
                              )}

                              {enrollment.status === "CANCELLED" && (
                                <button
                                  className="btn btn-sm btn-error"
                                  onClick={() =>
                                    deleteEnrollment(enrollment.id)
                                  }
                                  disabled={actionLoading === enrollment.id}
                                >
                                  {actionLoading === enrollment.id ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                  ) : (
                                    "🗑️ Eliminar"
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        )}

        {/* Mensaje si no hay matrículas */}
        {Object.keys(enrollmentsByGrade).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay matrículas para el año {selectedYear}
          </div>
        )}
      </div>

      {showRegisterModal && (
        <>
          {/* Fondo opaco */}
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"></div>
          {/* Modal */}
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-300 bg-white p-6 shadow-lg duration-200 animate-in sm:rounded-lg max-w-2xl"
            tabIndex={-1}
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Registrar estudiante
              </h2>
              <p className="text-sm text-muted-foreground">
                Completa la información para crear un nuevo estudiante
              </p>
            </div>
            <UserRegister
              onCancel={() => setShowRegisterModal(false)}
              onSuccess={() => setShowRegisterModal(false)}
            />
            <button
              type="button"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => setShowRegisterModal(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </button>
          </div>
        </>
      )}

      {showEnrollModal && (
        <>
          {/* Fondo opaco */}
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"></div>
          {/* Modal */}
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-300 bg-white p-6 shadow-lg duration-200 animate-in sm:rounded-lg max-w-2xl"
            tabIndex={-1}
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Matricular estudiante
              </h2>
              <p className="text-sm text-muted-foreground">
                Completa la información para matricular un nuevo estudiante
              </p>
            </div>
            <UserEnroll
              showEnrollModal={showEnrollModal}
              onCancel={() => setShowEnrollModal(false)}
              onSuccess={() => setShowEnrollModal(false)}
            />
            <button
              type="button"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => setShowEnrollModal(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </button>
          </div>
        </>
      )}

      {showCorrectionModal && selectedEnrollment && (
        <>
          {/* Fondo opaco */}
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"></div>
          {/* Modal */}
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-300 bg-white p-6 shadow-lg duration-200 animate-in sm:rounded-lg max-w-2xl"
            tabIndex={-1}
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Solicitar Correcciones
              </h2>
              <p className="text-sm text-muted-foreground">
                Estudiante: {selectedEnrollment.student.first_name}{" "}
                {selectedEnrollment.student.last_name} - Grado:{" "}
                {selectedEnrollment.grade.name}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mensaje de corrección
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-32"
                  placeholder="Describe qué debe corregir el estudiante..."
                  value={correctionMessage}
                  onChange={(e) => setCorrectionMessage(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowCorrectionModal(false);
                    setCorrectionMessage("");
                    setSelectedEnrollment(null);
                  }}
                  disabled={actionLoading === selectedEnrollment.id}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-warning"
                  onClick={requestCorrection}
                  disabled={
                    actionLoading === selectedEnrollment.id ||
                    !correctionMessage.trim()
                  }
                >
                  {actionLoading === selectedEnrollment.id ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Enviar Corrección"
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => {
                setShowCorrectionModal(false);
                setCorrectionMessage("");
                setSelectedEnrollment(null);
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </button>
          </div>
        </>
      )}

      {/* Modal de Editar Matrícula (PENDING) */}
      {showEditModal && selectedEnrollment && (
        <>
          {/* Fondo opaco */}
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"></div>
          {/* Modal */}
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-300 bg-white p-6 shadow-lg duration-200 animate-in sm:rounded-lg max-w-2xl"
            tabIndex={-1}
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Editar Matrícula
              </h2>
              <p className="text-sm text-muted-foreground">
                Estudiante: {selectedEnrollment.student.first_name}{" "}
                {selectedEnrollment.student.last_name}
              </p>
            </div>

            <UserEnroll
              onCancel={() => {
                setShowEditModal(false);
                setSelectedEnrollment(null);
              }}
              onSuccess={() => {
                setShowEditModal(false);
                setSelectedEnrollment(null);
                fetchData();
              }}
              initialEmail={selectedEnrollment.student.email}
              initialGradeId={selectedEnrollment.grade.id.toString()}
              initialYear={selectedEnrollment.academic_year.toString()}
              enrollmentId={selectedEnrollment.id}
              isEdit={true}
            />

            <button
              type="button"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => {
                setShowEditModal(false);
                setSelectedEnrollment(null);
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </button>
          </div>
        </>
      )}

      {/* Modal de Ver Matrícula (ACTIVE) */}
      {showViewModal && selectedEnrollment && (
        <>
          {/* Fondo opaco */}
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"></div>
          {/* Modal */}
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-300 bg-white p-6 shadow-lg duration-200 animate-in sm:rounded-lg max-w-2xl"
            tabIndex={-1}
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Información de Matrícula
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estudiante
                  </label>
                  <p className="text-sm">
                    {selectedEnrollment.student.first_name}{" "}
                    {selectedEnrollment.student.last_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-sm">{selectedEnrollment.student.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grado
                  </label>
                  <p className="text-sm">{selectedEnrollment.grade.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Año Académico
                  </label>
                  <p className="text-sm">{selectedEnrollment.academic_year}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <span
                    className={`badge ${getStatusBadge(
                      selectedEnrollment.status
                    )}`}
                  >
                    {selectedEnrollment.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Matrícula
                  </label>
                  <p className="text-sm">
                    {formatDate(selectedEnrollment.enrollment_date)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedEnrollment(null);
                }}
              >
                Cerrar
              </button>
            </div>

            <button
              type="button"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => {
                setShowViewModal(false);
                setSelectedEnrollment(null);
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
