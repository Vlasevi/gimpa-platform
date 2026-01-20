import { useState } from "react";
import { UserPlus, Save, X } from "lucide-react";
import { apiUrl, buildHeaders } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/Login/loginLogic";

const endpoint = apiUrl("/api/accounts/users/register/");

export default function RegisterUser() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const inputBorder = "border border-gray-300";
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // Determine if user can assign roles (Admin only)
    // Assuming 'role' property exists on user object (e.g. "admin", "rector")
    // You might need to check how exactly role is stored (Enum string mostly)
    const canAssignRole = user?.role === "admin";

    const [form, setForm] = useState({
        displayname: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "student", // Default role
        // Guardian fields
        guardian_full_name: "",
        guardian_email: "",
        guardian_phone: "",
        guardian_relationship: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "first_name") {
            // Auto-fill displayname if empty or previously matching
            // Simple logic: just update displayname to match first_name + last_name if needed
            // For now, let's keep the userRegister logic of mapping first_name to displayname
            setForm((prev) => ({ ...prev, first_name: value, displayname: value + " " + prev.last_name }));
        } else if (name === "last_name") {
            setForm((prev) => ({ ...prev, last_name: value, displayname: prev.first_name + " " + value }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: buildHeaders(),
                body: JSON.stringify(form),
                credentials: "include",
            });

            if (res.ok) {
                setSuccessMsg("¡Usuario registrado exitosamente!");
                // Reset form or navigate? currently reset
                setForm({
                    displayname: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    role: "student",
                    guardian_full_name: "",
                    guardian_email: "",
                    guardian_phone: "",
                    guardian_relationship: "",
                });
                window.scrollTo(0, 0);
            } else {
                const errorData = await res.json();
                let errorText = "Error al registrar usuario.";
                if (typeof errorData.detail === "string") {
                    errorText = `Error: ${errorData.detail}`;
                } else if (errorData.email) {
                    errorText = `Error Email: ${errorData.email}`;
                } else {
                    // Generic error join
                    errorText = `Error: ${JSON.stringify(errorData)}`;
                }
                setErrorMsg(errorText);
                window.scrollTo(0, 0);
            }
        } catch (error) {
            setErrorMsg("Error de conexión al servidor.");
        } finally {
            setLoading(false);
        }
    };

    const isStudent = form.role === "student";

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
                <UserPlus className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-gray-800">Registrar Nuevo Usuario</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Messages */}
                    {successMsg && (
                        <div className="alert alert-success shadow-lg">
                            <span>{successMsg}</span>
                        </div>
                    )}
                    {errorMsg && (
                        <div className="alert alert-error shadow-lg">
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Section: User Data */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                            Datos del Usuario
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="first_name">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={`input input-bordered w-full ${inputBorder}`}
                                    id="first_name"
                                    name="first_name"
                                    required
                                    placeholder="Ej: Juan"
                                    value={form.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="last_name">
                                    Apellido <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={`input input-bordered w-full ${inputBorder}`}
                                    id="last_name"
                                    name="last_name"
                                    required
                                    placeholder="Ej: Pérez"
                                    value={form.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="email">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    className={`input input-bordered w-full ${inputBorder}`}
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="ejemplo@correo.com"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>

                            {canAssignRole && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="role">
                                        Rol <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className={`select select-bordered w-full ${inputBorder}`}
                                        id="role"
                                        name="role"
                                        required
                                        value={form.role}
                                        onChange={handleChange}
                                    >
                                        <option value="student">Estudiante</option>
                                        <option value="teacher">Profesor</option>
                                        <option value="rector">Rector</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                    <p className="text-xs text-gray-500">Solo administradores pueden asignar roles diferentes a Estudiante.</p>
                                </div>
                            )}
                            {!canAssignRole && (
                                // Hidden input implies Rector can only create students (handled by backend too)
                                <input type="hidden" name="role" value="student" />
                            )}
                        </div>

                        {/* Display Name Auto-generated mostly */}
                        <div className="mt-4">
                            <label className="text-sm font-medium" htmlFor="displayname">
                                Nombre para mostrar
                            </label>
                            <input
                                className={`input input-bordered w-full ${inputBorder} bg-gray-50`}
                                id="displayname"
                                name="displayname"
                                value={form.displayname}
                                readOnly
                                tabIndex={-1}
                            />
                        </div>
                    </div>

                    {/* Section: Guardian Data (Only for Students) */}
                    {isStudent && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4 mt-2">
                                Datos del Acudiente
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="guardian_full_name">
                                        Nombre Completo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className={`input input-bordered w-full ${inputBorder}`}
                                        id="guardian_full_name"
                                        name="guardian_full_name"
                                        required={isStudent}
                                        placeholder="Ej: María García"
                                        value={form.guardian_full_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="guardian_relationship">
                                        Relación <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className={`select select-bordered w-full ${inputBorder}`}
                                        id="guardian_relationship"
                                        name="guardian_relationship"
                                        required={isStudent}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="guardian_email">
                                        Email Acudiente <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`input input-bordered w-full ${inputBorder}`}
                                        id="guardian_email"
                                        name="guardian_email"
                                        required={isStudent}
                                        placeholder="acudiente@correo.com"
                                        value={form.guardian_email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="guardian_phone">
                                        Teléfono Acudiente <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        className={`input input-bordered w-full ${inputBorder}`}
                                        id="guardian_phone"
                                        name="guardian_phone"
                                        required={isStudent}
                                        placeholder="Ej: 3001234567"
                                        value={form.guardian_phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                        <button
                            className="btn btn-ghost"
                            type="button"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <>
                                    <Save size={18} className="mr-2" />
                                    Registrar Usuario
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
