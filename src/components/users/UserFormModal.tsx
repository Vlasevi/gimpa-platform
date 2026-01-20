import { useState, useEffect } from "react";
import { UserPlus, User, Mail, Phone, Save, X, UserCog, Users, ChevronDown } from "lucide-react";
import { apiUrl, buildHeaders } from "@/utils/api";
import { useAuth } from "@/components/Login/loginLogic";

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userToEdit?: any;
    isLoadingData?: boolean;
}

export function UserFormModal({ isOpen, onClose, onSuccess, userToEdit, isLoadingData = false }: UserFormModalProps) {
    const { user } = useAuth();
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // Determine if user can assign roles (Admin only)
    const canAssignRole = user?.role === "admin";
    const isEditing = !!userToEdit;

    const [form, setForm] = useState({
        displayname: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "student",
        // Guardian fields
        guardian_full_name: "",
        guardian_email: "",
        guardian_phone: "",
        guardian_relationship: "",
    });

    // Reset form when modal opens or userToEdit changes
    useEffect(() => {
        if (isOpen) {
            setSuccessMsg("");
            setErrorMsg("");
            if (userToEdit) {
                setForm({
                    displayname: userToEdit.displayname || "",
                    first_name: userToEdit.first_name || "",
                    last_name: userToEdit.last_name || "",
                    email: userToEdit.email || "",
                    role: userToEdit.role || "student",
                    guardian_full_name: userToEdit.guardian_full_name || "",
                    guardian_email: userToEdit.guardian_email || "",
                    guardian_phone: userToEdit.guardian_phone || "",
                    guardian_relationship: userToEdit.guardian_relationship || "",
                });
            } else {
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
            }
        }
    }, [isOpen, userToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "first_name" && !isEditing) {
            setForm((prev) => ({
                ...prev,
                first_name: value,
                displayname: value + " " + prev.last_name,
            }));
        } else if (name === "last_name" && !isEditing) {
            setForm((prev) => ({
                ...prev,
                last_name: value,
                displayname: prev.first_name + " " + value,
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        const endpoint = apiUrl("/api/accounts/users/register/");
        const method = isEditing ? "PUT" : "POST";

        // Prepare data: clean guardian fields if not student
        const dataToSend: any = { ...form };
        if (dataToSend.role !== "student") {
            dataToSend.guardian_full_name = null;
            dataToSend.guardian_email = null;
            dataToSend.guardian_phone = null;
            dataToSend.guardian_relationship = null;
        }

        try {
            const res = await fetch(endpoint, {
                method: method,
                headers: buildHeaders(),
                body: JSON.stringify(dataToSend),
                credentials: "include",
            });

            if (res.ok) {
                setSuccessMsg(isEditing ? "¡Usuario actualizado!" : "¡Usuario registrado exitosamente!");
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                const errorData = await res.json();
                let errorText = "Error en la operación.";
                if (typeof errorData.detail === "string") {
                    errorText = `Error: ${errorData.detail}`;
                } else if (errorData.email) {
                    errorText = `Error Email: ${errorData.email}`;
                } else {
                    errorText = `Error: ${JSON.stringify(errorData)}`;
                }
                setErrorMsg(errorText);
            }
        } catch (error) {
            setErrorMsg("Error de conexión al servidor.");
        } finally {
            setLoading(false);
        }
    };

    const isStudent = form.role === "student";

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Wait for animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const modalAnimation = isOpen
        ? "animate-in fade-in slide-in-from-bottom-16 duration-500"
        : "animate-out fade-out slide-out-to-bottom-16 duration-300";

    const backdropAnimation = isOpen
        ? "animate-in fade-in duration-300"
        : "animate-out fade-out duration-300";

    // Common input styles (Compact version)
    const inputClass = "w-full pl-9 pr-3 py-2 border border-[#e9ecef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b4aa0]/20 focus:border-[#3b4aa0] transition-all placeholder:text-gray-300 text-sm";

    // Select class with custom arrow handling
    const selectClass = "w-full pl-3 pr-8 py-2 border border-[#e9ecef] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3b4aa0]/20 focus:border-[#3b4aa0] transition-all appearance-none cursor-pointer text-sm";

    const labelClass = "text-xs font-bold text-[#2a2a2a] mb-1 block";
    const iconClass = "absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-[#3b4aa0] pointer-events-none transition-colors";

    // Chevron for select
    const ChevronIcon = () => (
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-500">
            <ChevronDown className="h-4 w-4" />
        </div>
    );

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto ${backdropAnimation}`}>
            {/* Removed border from modal container to clean up contour */}
            <div className={`max-w-3xl w-full bg-[#f8f9fa] rounded-lg shadow-2xl overflow-hidden font-sans ${modalAnimation}`}>

                {/* HEADER (Compact) */}
                <div className="bg-[#3b4aa0] px-5 py-3 flex items-center justify-between text-white">
                    <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-white/10 rounded-lg">
                            {isEditing ? (
                                <UserCog className="h-5 w-5" />
                            ) : (
                                <UserPlus className="h-5 w-5" />
                            )}
                        </div>
                        <h2 className="text-lg font-bold tracking-tight">
                            {isEditing ? "Editar Usuario" : "Registrar Nuevo Usuario"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 transition-colors text-white/70 hover:text-white focus:outline-none"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* CONTENT */}
                {isLoadingData ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-[#3b4aa0]"></span>
                    </div>
                ) : (
                    <form className="p-5 space-y-5" onSubmit={handleSubmit}>

                        {/* Messages */}
                        {successMsg && (
                            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg text-sm">
                                {successMsg}
                            </div>
                        )}
                        {errorMsg && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg text-sm">
                                {errorMsg}
                            </div>
                        )}

                        {/* SECTION 1: USER DATA - Removed border */}
                        <div className="bg-white p-5 rounded-lg shadow-sm">
                            <h3 className="text-[#3b4aa0] font-bold text-base mb-4 flex items-center border-b border-[#f8f9fa] pb-2">
                                Datos del Usuario
                                <span className="text-[#dc3545] ml-1">*</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* First Name */}
                                <div>
                                    <label className={labelClass}>
                                        Nombre <span className="text-[#dc3545]">*</span>
                                    </label>
                                    <div className="relative group">
                                        <span className={iconClass}>
                                            <User className="h-4 w-4" />
                                        </span>
                                        <input
                                            type="text"
                                            name="first_name"
                                            required
                                            placeholder="Ej: Juan"
                                            value={form.first_name}
                                            onChange={handleChange}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className={labelClass}>
                                        Apellido <span className="text-[#dc3545]">*</span>
                                    </label>
                                    <div className="relative group">
                                        <span className={iconClass}>
                                            <User className="h-4 w-4" />
                                        </span>
                                        <input
                                            type="text"
                                            name="last_name"
                                            required
                                            placeholder="Ej: Pérez"
                                            value={form.last_name}
                                            onChange={handleChange}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className={labelClass}>
                                        Email <span className="text-[#dc3545]">*</span>
                                    </label>
                                    <div className="relative group">
                                        <span className={iconClass}>
                                            <Mail className="h-4 w-4" />
                                        </span>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="ejemplo@correo.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            readOnly={isEditing}
                                            className={`${inputClass} ${isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                            title={isEditing ? "El email no se puede cambiar" : ""}
                                        />
                                    </div>
                                </div>

                                {/* Role */}
                                {canAssignRole ? (
                                    <div>
                                        <label className={labelClass}>
                                            Rol <span className="text-[#dc3545]">*</span>
                                        </label>
                                        <div className="relative group">
                                            <select
                                                name="role"
                                                required
                                                value={form.role}
                                                onChange={handleChange}
                                                disabled={isEditing}
                                                className={`${selectClass} ${isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                            >
                                                <option value="student">Estudiante</option>
                                                <option value="teacher">Profesor</option>
                                                <option value="rector">Rector</option>
                                                <option value="admin">Administrador</option>
                                            </select>
                                            <ChevronIcon />
                                        </div>
                                    </div>
                                ) : (
                                    <input type="hidden" name="role" value="student" />
                                )}
                            </div>
                        </div>

                        {/* SECTION 2: GUARDIAN DATA (Only for students) - Removed border */}
                        {isStudent && (
                            <div className="bg-white p-5 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <h3 className="text-[#3b4aa0] font-bold text-base mb-4 flex items-center border-b border-[#f8f9fa] pb-2">
                                    Datos del Acudiente
                                    <span className="text-[#dc3545] ml-1">*</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Guardian Full Name */}
                                    <div>
                                        <label className={labelClass}>
                                            Nombre Completo <span className="text-[#dc3545]">*</span>
                                        </label>
                                        <div className="relative group">
                                            <span className={iconClass}>
                                                <Users className="h-4 w-4" />
                                            </span>
                                            <input
                                                type="text"
                                                name="guardian_full_name"
                                                required={isStudent}
                                                placeholder="Ej: María García"
                                                value={form.guardian_full_name}
                                                onChange={handleChange}
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    {/* Guardian Relationship */}
                                    <div>
                                        <label className={labelClass}>
                                            Relación <span className="text-[#dc3545]">*</span>
                                        </label>
                                        <div className="relative group">
                                            <select
                                                name="guardian_relationship"
                                                required={isStudent}
                                                value={form.guardian_relationship}
                                                onChange={handleChange}
                                                className={selectClass}
                                            >
                                                <option value="">Seleccione...</option>
                                                <option value="Padre">Padre</option>
                                                <option value="Madre">Madre</option>
                                                <option value="Abuelo/a">Abuelo/a</option>
                                                <option value="Tío/a">Tío/a</option>
                                                <option value="Tutor Legal">Tutor Legal</option>
                                                <option value="Otro">Otro</option>
                                            </select>
                                            <ChevronIcon />
                                        </div>
                                    </div>

                                    {/* Guardian Email */}
                                    <div>
                                        <label className={labelClass}>
                                            Email Acudiente <span className="text-[#dc3545]">*</span>
                                        </label>
                                        <div className="relative group">
                                            <span className={iconClass}>
                                                <Mail className="h-4 w-4" />
                                            </span>
                                            <input
                                                type="email"
                                                name="guardian_email"
                                                required={isStudent}
                                                placeholder="acudiente@correo.com"
                                                value={form.guardian_email}
                                                onChange={handleChange}
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    {/* Guardian Phone */}
                                    <div>
                                        <label className={labelClass}>
                                            Teléfono Acudiente <span className="text-[#dc3545]">*</span>
                                        </label>
                                        <div className="relative group">
                                            <span className={iconClass}>
                                                <Phone className="h-4 w-4" />
                                            </span>
                                            <input
                                                type="tel"
                                                name="guardian_phone"
                                                required={isStudent}
                                                placeholder="Ej: 3001234567"
                                                value={form.guardian_phone}
                                                onChange={handleChange}
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FOOTER / BUTTONS */}
                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#e9ecef]">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-5 py-2 text-[#2a2a2a] text-sm font-bold bg-transparent border border-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500 rounded-lg transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center space-x-2 bg-[#3b4aa0] text-white border border-[#3b4aa0] hover:bg-white hover:text-[#3b4aa0] px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#3b4aa0]/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <>
                                        <span>{isEditing ? "Guardar" : "Registrar"}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
