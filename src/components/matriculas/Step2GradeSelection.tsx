// components/matriculas/steps/Step2GradeSelection.tsx

import type { EnrollmentResponse } from "@/components/matriculas/MatriculasEstudiantes";

interface Step2Props {
  next: () => void;
  back: () => void;
  enrollmentInfo: EnrollmentResponse;
}

export const Step2GradeSelection = ({
  next,
  back,
  enrollmentInfo,
}: Step2Props) => {
  const suggestedGrade = enrollmentInfo?.eligibility?.suggested_grade;
  const targetYear = enrollmentInfo?.eligibility?.target_academic_year;
  const currentEnrollment = enrollmentInfo?.current_enrollment;

  const isFirstEnrollment = currentEnrollment?.is_first_enrollment === true;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-secondary">
        Confirmación de Matrícula
      </h2>

      {/* Matrícula actual: solo si NO es primera matrícula */}
      {!isFirstEnrollment && currentEnrollment && (
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3 className="font-bold">Matrícula Actual</h3>
            <div className="text-sm">
              Grado: <strong>{currentEnrollment.grade?.description}</strong> -
              Año: <strong>{currentEnrollment.academic_year}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Nueva Matrícula */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-primary">Nueva Matrícula</h3>

          <div className="space-y-4">
            {/* Año Académico */}
            <div className="form-control flex items-center space-x-1">
              <label className="label">
                <span className="label-text font-semibold">Año Académico</span>
              </label>
              <input
                type="text"
                value={targetYear ?? ""}
                className="input input-bordered bg-base-100 w-40"
                disabled
              />
            </div>

            {/* Grado sugerido */}
            <div className="form-control flex items-center space-x-1">
              <label className="label">
                <span className="label-text font-semibold">Grado a Cursar</span>
              </label>
              <input
                type="text"
                value={suggestedGrade?.description ?? ""}
                className="input input-bordered bg-base-100 w-40"
                disabled
              />
            </div>
          </div>

          <div className="alert alert-success mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Puedes matricularte en el grado{" "}
              <strong>{suggestedGrade?.description}</strong> para el año{" "}
              <strong>{targetYear}</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* Botones navegación */}
      <div className="flex justify-between mt-8">
        <button className="btn btn-ghost" onClick={back}>
          Atrás
        </button>
        <button className="btn btn-primary" onClick={next}>
          Continuar
        </button>
      </div>
    </div>
  );
};
