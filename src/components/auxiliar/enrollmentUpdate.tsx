import { useState, useEffect, useRef } from "react";
import { apiUrl, buildHeaders } from "@/utils/api";

const enrollmentsListEndpoint = apiUrl("/api/enrollments/");

// ComboBox component (reutilizado)
const ComboBox = ({
  value,
  setValue,
  options,
  label,
  disabled,
  required,
}: any) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery(value || "");
    }
  }, [value, open]);

  const inputValue = typeof query === "string" ? query : "";

  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const filteredOptions =
    inputValue === ""
      ? options
      : options.filter((o: string) => {
          const normalizedOption = normalizeText(o);
          const normalizedInput = normalizeText(inputValue);
          if (normalizedOption.includes(normalizedInput)) {
            return true;
          }
          return false;
        });

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium text-gray-600">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={`input input-bordered w-full focus:input-primary transition-all ${
            disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
          }`}
          placeholder={label}
          value={inputValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery(value || "");
          }}
          onBlur={() => {
            setTimeout(() => setOpen(false), 200);
          }}
          disabled={disabled}
          required={required}
          autoComplete="off"
        />

        {open && filteredOptions.length > 0 && !disabled && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50"
          >
            {filteredOptions.map((o: string, index: number) => (
              <div
                key={`${o}-${index}`}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
                  o === value ? "bg-blue-500 text-white" : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setValue(o);
                  setQuery(o);
                  setOpen(false);
                }}
              >
                {o}
              </div>
            ))}
          </div>
        )}

        {open && filteredOptions.length === 0 && inputValue && !disabled && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-3 z-50">
            <p className="text-sm text-gray-500">
              No se encontraron estudiantes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function EnrollmentUpdate({
  onCancel,
  onSuccess,
  students = [],
  grades = [],
  allEnrollments = [],
  preselectedStudentEmail = "",
}: any) {
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedStudentEmail, setSelectedStudentEmail] = useState("");
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Form state
  const [form, setForm] = useState({
    grade_id: "",
    academic_year: new Date().getFullYear(),
    status: "",
    correction_comment: "",
  });

  const studentOptions = students.map(
    (student: any) =>
      `${student.email} - ${student.first_name} ${student.last_name}`,
  );

  // Auto-select student if preselectedStudentEmail is provided
  useEffect(() => {
    if (
      preselectedStudentEmail &&
      students.length > 0 &&
      allEnrollments.length > 0
    ) {
      const comboValue = studentOptions.find((opt: string) =>
        opt.startsWith(preselectedStudentEmail),
      );
      if (comboValue) {
        handleStudentSelect(comboValue);
      }
    }
  }, [preselectedStudentEmail, students, allEnrollments]);

  const handleStudentSelect = (comboValue: string) => {
    if (!comboValue) {
      setSelectedStudentEmail("");
      setSelectedEnrollment(null);
      return;
    }

    const email = comboValue.split(" - ")[0];
    setSelectedStudentEmail(email);

    // Filter enrollments by student email (more reliable than id)
    const studentEnrollments = allEnrollments.filter(
      (e: any) => e.student?.email === email,
    );

    if (studentEnrollments && studentEnrollments.length > 0) {
      // Sort by ID descending to get the latest enrollment
      const latest = studentEnrollments.sort(
        (a: any, b: any) => b.id - a.id,
      )[0];
      setSelectedEnrollment(latest);

      // Set form
      setForm({
        grade_id: latest.grade?.id?.toString() || "",
        academic_year: latest.academic_year,
        status: latest.status,
        correction_comment: latest.correction_comment || "",
      });
      setSuccessMsg("");
    } else {
      setSelectedEnrollment(null);
      setSuccessMsg("El estudiante no tiene matrículas en la lista cargada.");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedEnrollment) return;

    setLoadingSubmit(true);
    try {
      // Build request body - include correction_comment only when status is PENDING
      const requestBody: any = {
        grade_id: form.grade_id,
        academic_year: form.academic_year,
        status: form.status,
      };

      // Only send correction_comment if status is PENDING and there's a message
      if (form.status === "PENDING" && form.correction_comment.trim()) {
        requestBody.correction_comment = form.correction_comment;
      }

      const res = await fetch(
        `${enrollmentsListEndpoint}${selectedEnrollment.id}/`,
        {
          method: "PATCH",
          headers: buildHeaders(),
          body: JSON.stringify(requestBody),
          credentials: "include",
        },
      );

      if (res.ok) {
        setSuccessMsg("¡Matrícula actualizada exitosamente!");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1000);
      } else {
        const err = await res.json();
        setSuccessMsg(`Error: ${JSON.stringify(err)}`);
      }
    } catch (error) {
      setSuccessMsg("Error de conexión al actualizar.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <form className="space-y-4 bg-white" onSubmit={handleSubmit}>
      {successMsg && (
        <div
          className={`font-semibold mb-2 p-2 rounded ${
            successMsg.includes("Error") || successMsg.includes("no tiene")
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {successMsg}
        </div>
      )}

      {/* Selector de Estudiante */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
          1. Seleccionar Estudiante
        </h3>
        <ComboBox
          value={
            selectedStudentEmail
              ? studentOptions.find((opt: string) =>
                  opt.startsWith(selectedStudentEmail),
                ) || ""
              : ""
          }
          setValue={handleStudentSelect}
          options={studentOptions}
          label="Buscar por Email o Nombre"
          disabled={students.length === 0}
          required={true}
        />
        {students.length === 0 && (
          <p className="text-xs text-warning">No hay estudiantes cargados.</p>
        )}
      </div>

      {/* Detalle Matrícula */}
      {selectedEnrollment && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-4">
            2. Datos de la Matrícula (ID: {selectedEnrollment.id})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Grado */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Grado</span>
              </label>
              <select
                name="grade_id"
                className="select select-bordered w-full"
                value={form.grade_id}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                {grades.map((g: any) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Año Académico */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Año Académico</span>
              </label>
              <input
                type="number"
                name="academic_year"
                className="input input-bordered w-full"
                value={form.academic_year}
                onChange={handleChange}
              />
            </div>

            {/* Estado */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">Estado</span>
              </label>
              <select
                name="status"
                className="select select-bordered w-full"
                value={form.status}
                onChange={handleChange}
              >
                <option value="PENDING">PENDING (Pendiente)</option>
                <option value="IN_REVIEW">IN_REVIEW (En Revisión)</option>
                <option value="ACTIVE">ACTIVE (Activo/Matriculado)</option>
                <option value="REJECTED">REJECTED (Rechazado)</option>
                <option value="CANCELLED">CANCELLED (Cancelado)</option>
                <option value="INACTIVE">INACTIVE (Inactivo/Retirado)</option>
              </select>
            </div>

            {/* Campo de comentario de corrección - solo visible cuando status es PENDING */}
            {form.status === "PENDING" && (
              <div className="form-control md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="label">
                  <span className="label-text font-medium">
                    Mensaje de Corrección
                    <span className="text-orange-500 ml-1">*</span>
                  </span>
                </label>
                <textarea
                  name="correction_comment"
                  className="textarea textarea-bordered w-full h-24"
                  placeholder="Describe qué debe corregir el estudiante... (Ej: Corregir la foto del estudiante y adjuntar certificado de EPS)"
                  value={form.correction_comment}
                  onChange={handleChange}
                />
                <label className="label">
                  <span className="label-text-md text-primary">
                    ⚠️ Se enviará un correo al acudiente con este mensaje
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={loadingSubmit}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary text-white"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Actualizar Matrícula"
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
