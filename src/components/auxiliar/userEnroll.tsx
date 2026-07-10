import { useState, useEffect } from "react";
import { apiUrl, API_ENDPOINTS, buildHeaders } from "@/utils/api";
export default function UserEnroll({
  showEnrollModal = false,
  onCancel,
  onSuccess,
  initialEmail = "",
  initialGradeId = "",
  initialYear = "",
  enrollmentId = null,
  isEdit = false,
}) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: initialEmail,
    grade_id: initialGradeId,
    academic_year: initialYear.toString(),
  });
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState(
    initialEmail ? `Estudiante seleccionado (${initialEmail})` : "",
  );
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1];
  const isFormValid = form.email && form.grade_id && form.academic_year;
  const filteredStudents =
    studentSearch && !isEdit
      ? students
          .filter((s) =>
            `${s.first_name} ${s.last_name} ${s.email}`
              .toLowerCase()
              .includes(studentSearch.toLowerCase()),
          )
          .slice(0, 5)
      : [];
  useEffect(() => {
    if (showEnrollModal || isEdit) {
      if (!isEdit) {
        fetch(apiUrl(API_ENDPOINTS.usersByRole("student")), {
          credentials: "include",
        })
          .then((res) => res.json())
          .then(setStudents);
      }
      fetch(apiUrl(API_ENDPOINTS.grades), { credentials: "include" })
        .then((res) => res.json())
        .then(setGrades);
    }
  }, [showEnrollModal, isEdit]);
  // Precargar datos cuando es modo edición
  useEffect(() => {
    if (isEdit && initialEmail && initialGradeId && initialYear) {
      setForm({
        first_name: "",
        last_name: "",
        email: initialEmail,
        grade_id: initialGradeId,
        academic_year: initialYear.toString(),
      });
      setStudentSearch(`Estudiante seleccionado (${initialEmail})`);
    }
  }, [isEdit, initialEmail, initialGradeId, initialYear]);
  const handleCancel = () => {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      grade_id: "",
      academic_year: "",
    });
    setStudentSearch("");
    if (onCancel) onCancel();
  };
  const [successMsg, setSuccessMsg] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && enrollmentId) {
        // Modo edición: usar el endpoint existente con PATCH
        const payload = {
          grade_id: form.grade_id,
          academic_year: parseInt(form.academic_year),
        };
        const res = await fetch(
          apiUrl(API_ENDPOINTS.enrollmentById(enrollmentId)),
          {
            method: "PATCH",
            headers: buildHeaders(),
            body: JSON.stringify(payload),
            credentials: "include",
          },
        );
        if (res.ok) {
          setSuccessMsg("¡Matrícula actualizada exitosamente!");
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 1000);
        } else {
          const errorData = await res.json();
          setSuccessMsg(
            typeof errorData.error === "string"
              ? `Error: ${errorData.error}`
              : `Error: ${JSON.stringify(errorData)}`,
          );
        }
      } else {
        // Modo creación: llamar al endpoint POST
        const payload = {
          student_email: form.email,
          grade_id: form.grade_id,
          academic_year: form.academic_year,
        };
        const res = await fetch(apiUrl(API_ENDPOINTS.enrollments), {
          method: "POST",
          headers: buildHeaders(),
          body: JSON.stringify(payload),
          credentials: "include",
        });
        if (res.ok) {
          setSuccessMsg("¡Estudiante matriculado exitosamente!");
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 1000);
        } else {
          const errorData = await res.json();
          setSuccessMsg(
            typeof errorData.detail === "string"
              ? `Error: ${errorData.detail}`
              : `Error: ${JSON.stringify(errorData)}`,
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {successMsg && (
        <div
          className={`font-medium p-3 rounded-lg text-sm ${
            successMsg.includes("Error")
              ? "bg-error/10 text-error"
              : "bg-success/10 text-success"
          }`}
        >
          {successMsg}
        </div>
      )}

      {/* Estudiante: input con búsqueda + lista filtrada */}
      <div className="form-control w-full">
        <label className="label" htmlFor="student-search">
          <span className="label-text font-medium text-base-content/70">
            Estudiante
          </span>
        </label>
        <div className="relative">
          <input
            id="student-search"
            type="text"
            placeholder={
              isEdit
                ? "Email del estudiante (no editable)"
                : "Buscar estudiante por nombre o email..."
            }
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            autoComplete="off"
            disabled={isEdit}
            className={`input input-bordered w-full transition-all focus:input-primary ${
              isEdit ? "bg-base-200 text-base-content/50 cursor-not-allowed" : ""
            }`}
          />
          {studentSearch && filteredStudents.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border border-base-300 bg-base-100 py-1 shadow-lg">
              {filteredStudents.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors hover:bg-primary hover:text-primary-content"
                    onMouseDown={() => {
                      setStudentSearch(
                        `${s.first_name} ${s.last_name} (${s.email})`,
                      );
                      setForm({
                        ...form,
                        first_name: s.first_name,
                        last_name: s.last_name,
                        email: s.email,
                      });
                    }}
                  >
                    {s.first_name} {s.last_name}{" "}
                    <span className="opacity-60">({s.email})</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Grado */}
      <div className="form-control w-full">
        <label className="label" htmlFor="grade-select">
          <span className="label-text font-medium text-base-content/70">
            Grado
          </span>
        </label>
        <select
          id="grade-select"
          className="select select-bordered w-full transition-all focus:select-primary"
          value={form.grade_id || ""}
          onChange={(e) => setForm({ ...form, grade_id: e.target.value })}
        >
          <option value="">Selecciona un grado</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.description}
            </option>
          ))}
        </select>
      </div>

      {/* Año escolar */}
      <div className="form-control w-full">
        <label className="label" htmlFor="year-select">
          <span className="label-text font-medium text-base-content/70">
            Año escolar
          </span>
        </label>
        <select
          id="year-select"
          className="select select-bordered w-full transition-all focus:select-primary"
          value={form.academic_year || ""}
          onChange={(e) =>
            setForm({ ...form, academic_year: e.target.value })
          }
        >
          <option value="">Selecciona año</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="btn btn-ghost"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="btn btn-primary text-primary-content shadow-sm"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : isEdit ? (
            "Actualizar matrícula"
          ) : (
            "Matricular estudiante"
          )}
        </button>
      </div>
    </form>
  );
}
