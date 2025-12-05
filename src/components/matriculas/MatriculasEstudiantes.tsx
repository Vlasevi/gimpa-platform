// components/matriculas/MatriculasEstudiantes.tsx
import { useState, useEffect } from "react";
import { Step1Verification } from "./Step1Verification";
import { Step2GradeSelection } from "./Step2GradeSelection";
import { Step3StudentData } from "./Step3StudentData";
import { Step4Documents } from "./Step4Documents";
import { Step5Documents } from "./Step5Documents";
import { Step6Confirmation } from "./Step6Confirmation";
import { EnrollmentBlockedMessage } from "./EnrollmentBlockedMessage";
import { useAuth } from "@/components/Login/loginLogic";
import { apiUrl, API_ENDPOINTS } from "@/utils/api";

// Tipado de la respuesta del backend
export interface EnrollmentResponse {
  current_enrollment: {
    id: number | null;
    student: {
      email: string;
      first_name: string;
      last_name: string;
    } | null;
    grade: {
      id: number;
      name: string;
      description: string;
    } | null;
    academic_year: number | null;
    enrollment_date: string | null;
    status: string | null;
    is_editable: boolean | null;
    is_first_enrollment: boolean | null;
  } | null;
  eligibility: {
    can_enroll: boolean;
    is_completing: boolean;
    is_new_enrollment: boolean;
    existing_enrollment_id: number | null;
    target_academic_year: number | null;
    suggested_grade: {
      id: number;
      name: string;
      description: string;
    } | null;
    existing_data: Record<string, any>;
    needs_correction: boolean;
    correction_message: string;
    enrollment_status: string | null;
    message: string;
  };
}

export const MatriculasEstudiantes = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [enrollmentInfo, setEnrollmentInfo] =
    useState<EnrollmentResponse | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [documents, setDocuments] = useState<any>({}); // Store all preloaded documents
  const [uploadedFiles, setUploadedFiles] = useState<any>({}); // Store new uploaded files separately
  const [loadingEligibility, setLoadingEligibility] = useState(true); // Loading state
  const { user } = useAuth();

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const updateFormData = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  const updateUploadedFiles = (files: any) => {
    setUploadedFiles((prev: any) => ({ ...prev, ...files }));
  };

  // Load eligibility on mount (before OTP)
  useEffect(() => {
    const loadEligibility = async () => {
      setLoadingEligibility(true);
      try {
        const response = await fetch(apiUrl(API_ENDPOINTS.enrollments), {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setEnrollmentInfo(data);
        }
      } catch (error) {
        console.error("Error loading eligibility:", error);
      } finally {
        setLoadingEligibility(false);
      }
    };

    loadEligibility();
  }, []);

  // Use eligibility logic from backend
  const canEnroll = enrollmentInfo?.eligibility?.can_enroll ?? true;
  const eligibilityMessage = enrollmentInfo?.eligibility?.message ?? "";
  const enrollmentStatus = enrollmentInfo?.current_enrollment?.status;

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Show loading spinner while checking eligibility */}
        {loadingEligibility ? (
          <div className="bg-white rounded-lg shadow-lg p-12 flex flex-col items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-gray-600">Verificando elegibilidad...</p>
          </div>
        ) : (
          <>
            {/* Show eligibility message if user cannot enroll */}
            {enrollmentInfo && !canEnroll && eligibilityMessage ? (
              <EnrollmentBlockedMessage
                message={eligibilityMessage}
                targetYear={
                  enrollmentInfo.eligibility.target_academic_year ||
                  new Date().getFullYear()
                }
                existingEnrollment={
                  enrollmentInfo.current_enrollment
                    ? {
                        grade: enrollmentInfo.current_enrollment.grade!,
                        status: enrollmentInfo.current_enrollment.status!,
                      }
                    : undefined
                }
              />
            ) : (
              <>
                {/* Progress Steps */}
                <ul className="steps steps-horizontal w-full mb-8">
                  <li
                    className={`step ${currentStep >= 1 ? "step-primary" : ""}`}
                  >
                    Verificación
                  </li>
                  <li
                    className={`step ${currentStep >= 2 ? "step-primary" : ""}`}
                  >
                    Grado
                  </li>
                  <li
                    className={`step ${currentStep >= 3 ? "step-primary" : ""}`}
                  >
                    Datos
                  </li>
                  <li
                    className={`step ${currentStep >= 4 ? "step-primary" : ""}`}
                  >
                    Firmas
                  </li>
                  <li
                    className={`step ${currentStep >= 5 ? "step-primary" : ""}`}
                  >
                    Documentos
                  </li>
                  <li
                    className={`step ${currentStep >= 6 ? "step-primary" : ""}`}
                  >
                    Confirmación
                  </li>
                </ul>

                {/* Step Content */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  {currentStep === 1 && (
                    <Step1Verification
                      next={nextStep}
                      userEmail={user?.email}
                      onEnrollmentInfoLoaded={setEnrollmentInfo}
                      onDocumentsLoaded={setDocuments}
                    />
                  )}

                  {currentStep === 2 && enrollmentInfo && (
                    <Step2GradeSelection
                      next={nextStep}
                      back={prevStep}
                      enrollmentInfo={enrollmentInfo}
                    />
                  )}

                  {currentStep === 3 && enrollmentInfo && (
                    <Step3StudentData
                      next={nextStep}
                      back={prevStep}
                      data={formData}
                      update={updateFormData}
                      uploadedFiles={uploadedFiles}
                      updateUploadedFiles={updateUploadedFiles}
                      enrollmentInfo={enrollmentInfo}
                      enrollmentId={
                        enrollmentInfo.current_enrollment?.id ?? null
                      }
                      preloadedDocuments={documents}
                    />
                  )}

                  {currentStep === 4 && enrollmentInfo && (
                    <Step4Documents
                      next={nextStep}
                      back={prevStep}
                      data={formData}
                      update={updateFormData}
                      uploadedFiles={uploadedFiles}
                      updateUploadedFiles={updateUploadedFiles}
                      enrollmentInfo={enrollmentInfo}
                      preloadedDocuments={documents}
                    />
                  )}

                  {currentStep === 5 && enrollmentInfo && (
                    <Step5Documents
                      next={nextStep}
                      back={prevStep}
                      data={formData}
                      update={updateFormData}
                      uploadedFiles={uploadedFiles}
                      updateUploadedFiles={updateUploadedFiles}
                      enrollmentInfo={enrollmentInfo}
                      preloadedDocuments={documents}
                    />
                  )}

                  {currentStep === 6 && enrollmentInfo && (
                    <Step6Confirmation
                      back={prevStep}
                      data={formData}
                      uploadedFiles={uploadedFiles}
                      enrollmentInfo={enrollmentInfo}
                      preloadedDocuments={documents}
                    />
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
