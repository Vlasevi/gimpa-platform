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
  const [showGradeList, setShowGradeList] = useState(false);
  const [studentSearch, setStudentSearch] = useState(
    initialEmail ? `Estudiante seleccionado (${initialEmail})` : ""
  );
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1];
  const [showYearList, setShowYearList] = useState(false);
  const isFormValid = form.email && form.grade_id && form.academic_year;
  const filteredStudents =
    studentSearch && !isEdit
      ? students
          .filter((s) =>
            `${s.first_name} ${s.last_name} ${s.email}`
              .toLowerCase()
              .includes(studentSearch.toLowerCase())
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
          }
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
              : `Error: ${JSON.stringify(errorData)}`
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
              : `Error: ${JSON.stringify(errorData)}`
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      className="space-y-6 bg-white"
      onSubmit={handleSubmit}
      style={{ position: "relative" }}
    >
      {successMsg && (
        <div
          className={`font-semibold mb-2 ${
            successMsg.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {successMsg}
        </div>
      )}
      {/* Estudiante: input + lista filtrada */}
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="student-search">
          Estudiante
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="student-search"
            type="text"
            placeholder={
              isEdit
                ? "Email del estudiante (no editable)"
                : "Buscar estudiante..."
            }
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            autoComplete="off"
            disabled={isEdit}
            className={`border border-gray-300 rounded-md px-3 py-2 w-full ${
              isEdit ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          {studentSearch && filteredStudents.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "0 0 8px 8px",
                zIndex: 10,
                maxHeight: "200px",
                overflowY: "auto",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                margin: 0,
                padding: 0,
                listStyle: "none",
              }}
            >
              {filteredStudents.map((s) => (
                <li
                  key={s.id}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseDown={() => {
                    setStudentSearch(
                      `${s.first_name} ${s.last_name} (${s.email})`
                    );
                    setForm({
                      ...form,
                      first_name: s.first_name,
                      last_name: s.last_name,
                      email: s.email,
                    });
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#f3f4f6")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  {s.first_name} {s.last_name} ({s.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="grade-list">
          Grado
        </label>
        <div style={{ position: "relative" }}>
          <div
            className="border border-gray-300 rounded-md px-3 py-2 w-full cursor-pointer bg-white"
            tabIndex={0}
            onClick={() => setShowGradeList(true)}
            onBlur={() => setTimeout(() => setShowGradeList(false), 100)}
          >
            {grades.find((g) => g.id === form.grade_id)?.description ||
              "Selecciona un grado"}
          </div>
          {showGradeList && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "0 0 8px 8px",
                zIndex: 10,
                maxHeight: "200px",
                overflowY: "auto",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                margin: 0,
                padding: 0,
                listStyle: "none",
              }}
            >
              {grades.map((g) => (
                <li
                  key={g.id}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseDown={() => {
                    setForm({ ...form, grade_id: g.id });
                    setShowGradeList(false);
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#f3f4f6")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  {g.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="year-list">
          Año escolar
        </label>
        <div style={{ position: "relative" }}>
          <div
            className="border border-gray-300 rounded-md px-3 py-2 w-full cursor-pointer bg-white"
            tabIndex={0}
            onClick={() => setShowYearList(true)}
            onBlur={() => setTimeout(() => setShowYearList(false), 100)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowYearList(false);
            }}
          >
            {form.academic_year || "Selecciona año"}
          </div>
          {showYearList && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "0 0 8px 8px",
                zIndex: 10,
                maxHeight: "200px",
                overflowY: "auto",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                margin: 0,
                padding: 0,
                listStyle: "none",
              }}
            >
              {years.map((year) => (
                <li
                  key={year}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseDown={() => {
                    setForm({ ...form, academic_year: year.toString() });
                    setShowYearList(false);
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#f3f4f6")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  {year}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2
    ${
      isFormValid && !loading
        ? "bg-primary text-white hover:bg-accent hover:text-accent-foreground"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
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
