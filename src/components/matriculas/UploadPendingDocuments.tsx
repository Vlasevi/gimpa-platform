// components/matriculas/UploadPendingDocuments.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Step5Documents } from "./Step5Documents";
import { useAuth } from "@/components/Login/loginLogic";
import { apiUrl, API_ENDPOINTS, buildHeaders } from "@/utils/api";
import { EnrollmentResponse } from "./MatriculasEstudiantes";

export const UploadPendingDocuments = () => {
  const [enrollmentInfo, setEnrollmentInfo] =
    useState<EnrollmentResponse | null>(null);
  const [documents, setDocuments] = useState<any>({});
  const [uploadedFiles, setUploadedFiles] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const updateUploadedFiles = (files: any) => {
    setUploadedFiles((prev: any) => ({ ...prev, ...files }));
  };

  useEffect(() => {
    const loadEnrollmentAndDocuments = async () => {
      setLoading(true);
      try {
        // Cargar información de matrícula
        const enrollmentRes = await fetch(apiUrl(API_ENDPOINTS.enrollments), {
          credentials: "include",
        });

        if (enrollmentRes.ok) {
          const enrollmentData = await enrollmentRes.json();
          setEnrollmentInfo(enrollmentData);

          // Si hay una matrícula activa, cargar documentos
          if (enrollmentData.current_enrollment?.id) {
            const docsRes = await fetch(
              apiUrl(
                API_ENDPOINTS.enrollmentDocuments(
                  enrollmentData.current_enrollment.id
                )
              ),
              { credentials: "include" }
            );

            if (docsRes.ok) {
              const docsData = await docsRes.json();
              setDocuments(docsData.documents || {});
            }
          }
        }
      } catch (error) {
        console.error("Error loading enrollment:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEnrollmentAndDocuments();
  }, []);

  const handleSubmit = async () => {
    if (!enrollmentInfo?.current_enrollment?.id) {
      alert("No se encontró una matrícula activa");
      return;
    }

    const formData = new FormData();

    // Agregar archivos nuevos
    Object.entries(uploadedFiles).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file as Blob);
      }
    });

    setSubmitting(true);
    try {
      // Construir headers sin Content-Type (FormData lo establece automáticamente)
      const headers = buildHeaders();
      delete headers["Content-Type"];

      const response = await fetch(
        apiUrl(
          API_ENDPOINTS.enrollmentDocuments(
            enrollmentInfo.current_enrollment.id
          )
        ),
        {
          method: "POST",
          credentials: "include",
          headers: headers,
          body: formData,
        }
      );

      if (response.ok) {
        alert("✅ Documentos subidos correctamente");
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        alert(
          `❌ Error: ${
            errorData.error || "No se pudieron subir los documentos"
          }`
        );
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      alert("❌ Error al subir documentos");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center min-h-[60vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  // Verificar si hay matrícula activa
  const hasActiveEnrollment =
    enrollmentInfo?.current_enrollment?.status === "ACTIVE";

  if (!hasActiveEnrollment) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No hay matrícula activa
            </h2>
            <p className="text-gray-600">
              Debes tener una matrícula activa para subir documentos pendientes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Subir Documentos Pendientes
          </h1>

          <Step5Documents
            next={handleSubmit}
            back={() => window.history.back()}
            data={{}}
            update={() => {}}
            uploadedFiles={uploadedFiles}
            updateUploadedFiles={updateUploadedFiles}
            enrollmentInfo={enrollmentInfo}
            preloadedDocuments={documents}
            nextButtonText="Guardar Documentos"
            isSubmitting={submitting}
          />
        </div>
      </div>
    </div>
  );
};
