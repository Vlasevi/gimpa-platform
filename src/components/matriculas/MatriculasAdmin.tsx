// components/Matriculas/MatriculasAdmin.tsx
import { useState, useEffect } from "react";
import { FilePlus, UserPlus, UserCog, X } from "lucide-react";
import UserRegister from "@/components/auxiliar/userRegister";
import UserUpdate from "@/components/auxiliar/userUpdate";
import UserEnroll from "@/components/auxiliar/userEnroll";
import { getStatusLabel, getStatusBadgeClass } from "@/utils/statusHelpers";
import { apiUrl, API_ENDPOINTS, buildHeaders } from "@/utils/api";
import { GradeAccordion } from "./matriculasUI/GradeAccordion";
import { SectionCard } from "./matriculasUI/SectionCard";
import { DisplayField } from "./matriculasUI/DisplayField";

interface Grade {
  id: number;
  name: string;
  description: string;
}

interface Student {
  id: number;
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
  documents_folder_url?: string | null;
}

interface EnrollmentsByGrade {
  [gradeName: string]: Enrollment[];
}

export const MatriculasAdmin = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [correctionMessage, setCorrectionMessage] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [folderLoading, setFolderLoading] = useState<number | null>(null);
  const [showStudentDataModal, setShowStudentDataModal] = useState(false);
  const [selectedEnrollmentData, setSelectedEnrollmentData] =
    useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch de matrículas y grados (solo una vez al montar)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch matrículas (sin filtro de año, traer todas)
      const enrollmentsRes = await fetch(apiUrl(API_ENDPOINTS.enrollments), {
        credentials: "include",
      });
      const enrollmentsData = await enrollmentsRes.json();

      // Fetch grados
      const gradesRes = await fetch(apiUrl(API_ENDPOINTS.grades), {
        credentials: "include",
      });
      const gradesData = await gradesRes.json();

      setEnrollments(enrollmentsData);
      setGrades(gradesData);

      // Establecer año actual por defecto
      if (selectedYear === null) {
        const currentYear = new Date().getFullYear();
        setSelectedYear(currentYear);
      }

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
        apiUrl(API_ENDPOINTS.enrollmentById(enrollmentId)),
        {
          method: "PATCH",
          credentials: "include",
          headers: buildHeaders(),
          body: JSON.stringify({ status: "ACTIVE" }),
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
        apiUrl(API_ENDPOINTS.enrollmentById(selectedEnrollment.id)),
        {
          method: "PATCH",
          credentials: "include",
          headers: buildHeaders(),
          body: JSON.stringify({
            status: "PENDING",
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
        apiUrl(API_ENDPOINTS.enrollmentById(enrollmentId)),
        {
          method: "PATCH",
          credentials: "include",
          headers: buildHeaders(),
          body: JSON.stringify({ status: "CANCELLED" }),
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
        apiUrl(API_ENDPOINTS.enrollmentById(enrollmentId)),
        {
          method: "DELETE",
          credentials: "include",
          headers: buildHeaders(),
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
        apiUrl(API_ENDPOINTS.enrollmentById(enrollmentId)),
        {
          method: "PATCH",
          credentials: "include",
          headers: buildHeaders(),
          body: JSON.stringify({
            grade: gradeId,
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
          headers: buildHeaders(),
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

  const openDocumentsFolder = () => {
    // Usar documents_folder_url directamente del estado (ya viene de GET /api/enrollments/{id})
    if (selectedEnrollmentData?.documents_folder_url) {
      window.open(selectedEnrollmentData.documents_folder_url, "_blank");
    } else {
      alert("No se encontró la carpeta del estudiante en OneDrive");
    }
  };

  const fetchEnrollmentDetails = async (enrollment: Enrollment) => {
    // Abrir modal inmediatamente con spinner
    setSelectedEnrollmentData(null);
    setDetailsLoading(true);
    setShowStudentDataModal(true);

    try {
      const studentEmail = enrollment.student.email;

      if (!studentEmail) {
        throw new Error("No se encontró el email del estudiante");
      }

      // Fetch enrollment details to get documents_folder_url
      const enrollmentResponse = await fetch(
        apiUrl(`${API_ENDPOINTS.enrollments}${enrollment.id}/`),
        {
          credentials: "include",
          headers: buildHeaders(),
        }
      );

      if (!enrollmentResponse.ok) {
        throw new Error("Error al obtener detalles de la matrícula");
      }

      const enrollmentData = await enrollmentResponse.json();

      // Fetch the complete student data using email in URL path (same as userUpdate.tsx)
      const studentResponse = await fetch(
        apiUrl(`${API_ENDPOINTS.users}${encodeURIComponent(studentEmail)}/`),
        {
          credentials: "include",
          headers: buildHeaders(),
        }
      );

      if (!studentResponse.ok) {
        const errorData = await studentResponse.json();
        throw new Error(errorData.error || "Error al obtener datos del estudiante");
      }

      const studentData = await studentResponse.json();

      // Combine enrollment info with student data for the modal
      const combinedData = {
        ...enrollmentData,
        student: studentData,
      };

      setSelectedEnrollmentData(combinedData);
    } catch (err: any) {
      alert(err.message || "Error al obtener datos del estudiante");
      console.error(err);
      setShowStudentDataModal(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Agrupar matrículas por grado
  const enrollmentsByGradeTemp: EnrollmentsByGrade = enrollments
    .filter(
      (enrollment) =>
        selectedYear !== null &&
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

  // Crear objeto con TODOS los grados de la DB, ordenados por el campo 'order'
  const enrollmentsByGrade: EnrollmentsByGrade = {};

  // Ordenar grados por el campo 'order' y crear entradas para todos
  grades
    .sort((a, b) => (a as any).order - (b as any).order)
    .forEach((grade) => {
      const gradeName = grade.description;
      enrollmentsByGrade[gradeName] = enrollmentsByGradeTemp[gradeName] || [];
    });

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

  // Si no hay años, agregar el año seleccionado por defecto
  if (enrollmentYears.length === 0 && selectedYear) {
    enrollmentYears.push(selectedYear);
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center min-h-[60vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
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
          <button
            className="btn btn-success ml-0.5"
            onClick={() => setShowUpdateModal(true)}
          >
            <UserCog size={18} className="mr-1" />
            Actualizar estudiante
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
            <GradeAccordion
              key={gradeName}
              gradeName={gradeName}
              enrollments={gradeEnrollments}
              onViewDetails={fetchEnrollmentDetails}
              onApprove={approveEnrollment}
              onRequestCorrection={(enrollment) => {
                setSelectedEnrollment(enrollment);
                setShowCorrectionModal(true);
              }}
              onCancel={cancelEnrollment}
              onDelete={deleteEnrollment}
              onEdit={(enrollment) => {
                setSelectedEnrollment(enrollment);
                setShowEditModal(true);
              }}
              onGeneratePDFs={generatePDFs}
              actionLoading={actionLoading}
              formatDate={formatDate}
            />
          )
        )}

        {/* Mensaje si no hay matrículas */}
        {Object.keys(enrollmentsByGrade).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {enrollments.length === 0
              ? "No hay matrículas registradas"
              : `No hay matrículas para el año ${selectedYear}`}
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
              onSuccess={() => {
                setShowRegisterModal(false);
                fetchData();
              }}
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

      {showUpdateModal && (
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
                Actualizar estudiante
              </h2>
              <p className="text-sm text-muted-foreground">
                Selecciona un estudiante y completa los datos del acudiente
              </p>
            </div>
            <UserUpdate
              onCancel={() => setShowUpdateModal(false)}
              onSuccess={() => {
                setShowUpdateModal(false);
                fetchData();
              }}
            />
            <button
              type="button"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => setShowUpdateModal(false)}
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
              onSuccess={() => {
                setShowEnrollModal(false);
                fetchData();
              }}
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
                    )} whitespace-nowrap`}
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

      {/* Modal de Ver Datos Completos del Estudiante (Step3 Style) */}
      {
        showStudentDataModal && (
          <>
            {/* Fondo opaco */}
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"></div>
            {/* Modal */}
            <div
              role="dialog"
              aria-modal="true"
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-5xl max-h-[90vh] translate-x-[-50%] translate-y-[-50%] border border-gray-300 bg-white shadow-lg duration-200 animate-in sm:rounded-lg overflow-hidden flex flex-col"
              tabIndex={-1}
            >
              {/* Header - Fixed */}
              <div className="flex-shrink-0 p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Información Completa
                    </h2>
                    {!detailsLoading && selectedEnrollmentData && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedEnrollmentData.student.first_name}{" "}
                        {selectedEnrollmentData.student.last_name} -{" "}
                        {selectedEnrollmentData.grade.description || selectedEnrollmentData.grade.name} - {selectedEnrollmentData.academic_year}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Botón Ver Documentos (Solo si hay data) */}
                    {!detailsLoading && selectedEnrollmentData && (
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost gap-2"
                        onClick={() => openDocumentsFolder()}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Documentos
                      </button>
                    )}
                    {/* Botón Cerrar */}
                    <button
                      type="button"
                      className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={() => {
                        setShowStudentDataModal(false);
                        setSelectedEnrollmentData(null);
                      }}
                    >
                      <X className="h-5 w-5" />
                      <span className="sr-only">Cerrar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {detailsLoading ? (
                  <div className="flex justify-center items-center h-full min-h-[300px]">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </div>
                ) : (
                  selectedEnrollmentData && (() => {
                    const studentData = selectedEnrollmentData.student?.student_data || {};
                    const student = selectedEnrollmentData.student || {};
                    return (
                      <div className="space-y-4">
                        {/* Sección: Información del Estudiante */}
                        <SectionCard title="Información del Estudiante">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DisplayField label="Primer Nombre" value={studentData.student_firstname1} />
                            <DisplayField label="Segundo Nombre" value={studentData.student_firstname2} />
                            <DisplayField label="Primer Apellido" value={studentData.student_lastname1} />
                            <DisplayField label="Segundo Apellido" value={studentData.student_lastname2} />
                            <DisplayField label="Email" value={student.email} />
                            <DisplayField label="Tipo de Documento" value={studentData.student_id_type} />
                            <DisplayField label="Número de Documento" value={studentData.student_id_number} />
                            <DisplayField label="Fecha de Nacimiento" value={studentData.student_birth_date} />
                            <DisplayField label="Edad" value={studentData.student_age} />
                            <DisplayField label="Género" value={studentData.student_gender} />
                            <DisplayField label="Grupo Sanguíneo" value={studentData.student_blood_abo} />
                            <DisplayField label="RH" value={studentData.student_blood_rh} />
                            <DisplayField label="Ciudad de Nacimiento" value={studentData.student_birth_city} />
                            <DisplayField label="Religión" value={studentData.student_religion} />
                          </div>
                        </SectionCard>
                        {/* Sección: Datos de Residencia */}
                        <SectionCard title="Datos de Residencia">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DisplayField label="Dirección" value={studentData.residence_address} />
                            <DisplayField label="Complemento" value={studentData.residence_address_complement} />
                            <DisplayField label="Barrio" value={studentData.residence_barrio} />
                            <DisplayField label="Estrato" value={studentData.residence_stratum} />
                            <DisplayField label="Ciudad" value={studentData.residence_city} />
                            <DisplayField label="Departamento" value={studentData.residence_department} />
                            <DisplayField label="País" value={studentData.residence_country} />
                          </div>
                        </SectionCard>
                        {/* Sección: Información Médica */}
                        <SectionCard title="Información Médica">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DisplayField label="EPS" value={studentData.student_health_eps} />
                            <DisplayField label="Tiene Alergias" value={studentData.medical_has_allergies} />
                            <DisplayField label="Detalle de Alergias" value={studentData.medical_allergies_detail} />
                            <DisplayField label="Toma Medicamentos" value={studentData.medical_has_medications} />
                            <DisplayField label="Detalle de Medicamentos" value={studentData.medical_medications_detail} />
                            <DisplayField label="Tiene Historial Médico" value={studentData.medical_has_history} />
                            <DisplayField label="Detalle de Historial" value={studentData.medical_history_detail} />
                            <DisplayField label="Tiene Diagnóstico" value={studentData.medical_has_diagnosis} />
                            <DisplayField label="Información Adicional" value={studentData.medical_diagnosis_additional_info} />
                          </div>
                        </SectionCard>
                        {/* Sección: Datos del Padre */}
                        <SectionCard title="Datos del Padre">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DisplayField label="Primer Nombre" value={studentData.father_firstname1} />
                            <DisplayField label="Segundo Nombre" value={studentData.father_firstname2} />
                            <DisplayField label="Primer Apellido" value={studentData.father_lastname1} />
                            <DisplayField label="Segundo Apellido" value={studentData.father_lastname2} />
                            <DisplayField label="Tipo de Documento" value={studentData.father_document_type} />
                            <DisplayField label="Número de Documento" value={studentData.father_id_number} />
                            <DisplayField label="Ciudad de Expedición" value={studentData.father_id_city} />
                            <DisplayField label="Email" value={studentData.father_email} />
                            <DisplayField label="Teléfono" value={studentData.father_phone} />
                            <DisplayField label="Ocupación" value={studentData.father_occupation} />
                            <DisplayField label="Lugar de Trabajo" value={studentData.father_workplace} />
                            <DisplayField label="Dirección de Trabajo" value={studentData.father_work_address} />
                            <DisplayField label="Teléfono de Trabajo" value={studentData.father_work_phone} />
                            <DisplayField label="País" value={studentData.father_country} />
                            <DisplayField label="Departamento" value={studentData.father_department} />
                            <DisplayField label="Ciudad" value={studentData.father_city} />
                            <DisplayField label="Vive con el Estudiante" value={studentData.father_lives_with_student} />
                          </div>
                        </SectionCard>
                        {/* Sección: Datos de la Madre */}
                        <SectionCard title="Datos de la Madre">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DisplayField label="Primer Nombre" value={studentData.mother_firstname1} />
                            <DisplayField label="Segundo Nombre" value={studentData.mother_firstname2} />
                            <DisplayField label="Primer Apellido" value={studentData.mother_lastname1} />
                            <DisplayField label="Segundo Apellido" value={studentData.mother_lastname2} />
                            <DisplayField label="Tipo de Documento" value={studentData.mother_document_type} />
                            <DisplayField label="Número de Documento" value={studentData.mother_id_number} />
                            <DisplayField label="Ciudad de Expedición" value={studentData.mother_id_city} />
                            <DisplayField label="Email" value={studentData.mother_email} />
                            <DisplayField label="Teléfono" value={studentData.mother_phone} />
                            <DisplayField label="Ocupación" value={studentData.mother_occupation} />
                            <DisplayField label="Lugar de Trabajo" value={studentData.mother_workplace} />
                            <DisplayField label="Dirección de Trabajo" value={studentData.mother_work_address} />
                            <DisplayField label="Teléfono de Trabajo" value={studentData.mother_work_phone} />
                            <DisplayField label="País" value={studentData.mother_country} />
                            <DisplayField label="Departamento" value={studentData.mother_department} />
                            <DisplayField label="Ciudad" value={studentData.mother_city} />
                            <DisplayField label="Vive con el Estudiante" value={studentData.mother_lives_with_student} />
                          </div>
                        </SectionCard>
                        {/* Sección: Datos del Acudiente */}
                        <SectionCard title="Datos del Acudiente">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DisplayField label="Tipo de Acudiente" value={studentData.guardian_type} />
                            <DisplayField label="Relación" value={studentData.guardian_relationship} />
                            <DisplayField label="Primer Nombre" value={studentData.guardian_firstname1} />
                            <DisplayField label="Segundo Nombre" value={studentData.guardian_firstname2} />
                            <DisplayField label="Primer Apellido" value={studentData.guardian_lastname1} />
                            <DisplayField label="Segundo Apellido" value={studentData.guardian_lastname2} />
                            <DisplayField label="Nombre Completo" value={studentData.guardian_full_name} />
                            <DisplayField label="Tipo de Documento" value={studentData.guardian_document_type} />
                            <DisplayField label="Número de Documento" value={studentData.guardian_id_number} />
                            <DisplayField label="Ciudad de Expedición" value={studentData.guardian_id_city} />
                            <DisplayField label="Email" value={studentData.guardian_email} />
                            <DisplayField label="Teléfono" value={studentData.guardian_phone} />
                            <DisplayField label="Ocupación" value={studentData.guardian_occupation} />
                            <DisplayField label="Lugar de Trabajo" value={studentData.guardian_workplace} />
                            <DisplayField label="País" value={studentData.guardian_country} />
                            <DisplayField label="Departamento" value={studentData.guardian_department} />
                            <DisplayField label="Ciudad" value={studentData.guardian_city} />
                          </div>
                        </SectionCard>
                        {/* Sección: Información Académica y Otros Datos */}
                        <SectionCard title="Información Académica y Otros Datos">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DisplayField label="Grado" value={studentData.grade} />
                            <DisplayField label="Año Escolar" value={studentData.school_year} />
                            <DisplayField label="Estado Civil de los Padres" value={studentData.parents_marital_status} />
                            <DisplayField label="Tiene Hermanos" value={studentData.student_has_siblings} />
                            <DisplayField label="Hermanos en el Colegio" value={studentData.student_siblings_in_school} />
                            <DisplayField label="Tiene Celular" value={studentData.student_has_cellphone} />
                            <DisplayField label="Fecha del Formulario" value={studentData.form_date} />
                          </div>
                        </SectionCard>
                      </div>
                    );
                  })()
                )}
              </div>
              {/* Footer - Fixed */}
              <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end">
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      setShowStudentDataModal(false);
                      setSelectedEnrollmentData(null);
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

