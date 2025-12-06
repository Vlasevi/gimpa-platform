import { useState } from "react";
import { apiUrl, buildHeaders } from "@/utils/api";

const endpoint = apiUrl("/api/accounts/users/register/");

export default function UserRegister({ onCancel, onSuccess }) {
  const inputBorder = "border border-gray-300";
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({
    displayname: "",
    first_name: "",
    last_name: "",
    email: "",
    guardian_full_name: "",
    guardian_email: "",
    guardian_phone: "",
    guardian_relationship: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "first_name") {
      setForm({ ...form, first_name: value, displayname: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCancel = () => {
    setForm({
      displayname: "",
      first_name: "",
      last_name: "",
      email: "",
      guardian_full_name: "",
      guardian_email: "",
      guardian_phone: "",
      guardian_relationship: "",
    });
    if (onCancel) onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(form),
        credentials: "include",
      });
      if (res.ok) {
        setSuccessMsg("¡Estudiante matriculado exitosamente!");
        setForm({
          displayname: "",
          first_name: "",
          last_name: "",
          email: "",
          guardian_full_name: "",
          guardian_email: "",
          guardian_phone: "",
          guardian_relationship: "",
        });
        if (onSuccess) onSuccess();
      } else {
        const errorData = await res.json();
        let errorMsg = "";
        if (typeof errorData.detail === "string") {
          errorMsg = `Error: ${errorData.detail}`;
        } else if (errorData.email && Array.isArray(errorData.email)) {
          errorMsg = `Error: ${errorData.email[0]}`;
        } else {
          errorMsg = `Error: ${JSON.stringify(errorData)}`;
        }
        setSuccessMsg(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="space-y-6 bg-white" onSubmit={handleSubmit}>
      {successMsg && (
        <div
          className={`font-semibold mb-2 ${
            successMsg.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {successMsg}
        </div>
      )}

      {/* Sección: Datos del Estudiante */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Datos del Estudiante
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="first_name"
            >
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              className={`flex h-10 w-full rounded-md border ${inputBorder} bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              id="first_name"
              name="first_name"
              required
              placeholder="Ej: Juan"
              value={form.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="last_name"
            >
              Apellido <span className="text-red-500">*</span>
            </label>
            <input
              className={`flex h-10 w-full rounded-md border ${inputBorder} bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              id="last_name"
              name="last_name"
              required
              placeholder="Ej: Pérez"
              value={form.last_name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className={`flex h-10 w-full rounded-md border ${inputBorder} bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            id="email"
            name="email"
            required
            placeholder="ejemplo@correo.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Sección: Datos del Acudiente */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Datos del Acudiente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="guardian_full_name"
            >
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <input
              className={`flex h-10 w-full rounded-md border ${inputBorder} bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              id="guardian_full_name"
              name="guardian_full_name"
              required
              placeholder="Ej: María García"
              value={form.guardian_full_name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="guardian_relationship"
            >
              Relación <span className="text-red-500">*</span>
            </label>
            <select
              className={`flex h-10 w-full rounded-md border ${inputBorder} bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              id="guardian_relationship"
              name="guardian_relationship"
              required
              value={form.guardian_relationship}
              onChange={handleChange}
            >
              <option value="">Seleccione...</option>
              <option value="Padre">Padre</option>
              <option value="Madre">Madre</option>
              <option value="Abuelo/a">Abuelo/a</option>
              <option value="Tío/a">Tío/a</option>
              <option value="Tutor Legal">Tutor Legal</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="guardian_email"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={`flex h-10 w-full rounded-md border ${inputBorder} bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              id="guardian_email"
              name="guardian_email"
              required
              placeholder="acudiente@correo.com"
              value={form.guardian_email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="guardian_phone"
            >
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className={`flex h-10 w-full rounded-md border ${inputBorder} bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              id="guardian_phone"
              name="guardian_phone"
              required
              placeholder="Ej: 3001234567"
              value={form.guardian_phone}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border ${inputBorder} bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2`}
          type="button"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-white hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Registrar estudiante"
          )}
        </button>
      </div>
    </form>
  );
}
