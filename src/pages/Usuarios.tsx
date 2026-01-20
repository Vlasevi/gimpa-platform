import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Users, UserPlus, Pencil, Trash2, Search, RefreshCw, AlertTriangle } from "lucide-react";
import { apiUrl, buildHeaders } from "@/utils/api";
import { useAuth } from "@/components/Login/loginLogic";
import { UserFormModal } from "@/components/users/UserFormModal";

interface User {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    displayname?: string;
    guardian_full_name?: string;
    guardian_email?: string;
    guardian_phone?: string;
    guardian_relationship?: string;
}

export default function Usuarios() {
    const { user } = useAuth();

    // Verificar permisos de gestión de usuarios
    const requiredPermissions = ["create_user", "edit_user", "delete_user"];
    const hasPermission = user?.permissions?.some((perm: string) =>
        requiredPermissions.includes(perm)
    );

    // Redirigir si no tiene permisos
    if (!hasPermission) {
        return <Navigate to="/unauthorized" replace />;
    }

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
    const [loadingUserDetail, setLoadingUserDetail] = useState(false);

    // Delete modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);

    useEffect(() => {
        if (isDeleteModalOpen) {
            setIsDeleteVisible(true);
        } else {
            const timer = setTimeout(() => setIsDeleteVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isDeleteModalOpen]);

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(apiUrl("/api/accounts/users/"), {
                credentials: "include",
                headers: buildHeaders(),
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Error al cargar usuarios");
            }
        } catch (err) {
            setError("Error de conexión al servidor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = () => {
        setEditingUser(undefined);
        setIsFormModalOpen(true);
    };

    const handleEdit = async (user: User) => {
        // Open modal immediately with loading state
        setEditingUser(undefined);
        setLoadingUserDetail(true);
        setIsFormModalOpen(true);

        try {
            const response = await fetch(apiUrl(`/api/accounts/users/${user.email}/`), {
                credentials: "include",
                headers: buildHeaders(),
            });

            if (response.ok) {
                const fullUserData = await response.json();
                setEditingUser(fullUserData);
            } else {
                const errorData = await response.json();
                alert(errorData.detail || "Error al cargar datos del usuario");
                setIsFormModalOpen(false);
            }
        } catch (error) {
            alert("Error de conexión al cargar usuario");
            setIsFormModalOpen(false);
        } finally {
            setLoadingUserDetail(false);
        }
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        setDeleteLoading(true);
        try {
            const response = await fetch(apiUrl("/api/accounts/users/register/"), {
                method: "DELETE",
                headers: buildHeaders(),
                body: JSON.stringify({ email: userToDelete.email }),
                credentials: "include",
            });

            if (response.ok) {
                setUserToDelete(null);
                setIsDeleteModalOpen(false);
                fetchUsers();
            } else {
                const data = await response.json();
                alert(data.detail || "Error al eliminar usuario");
            }
        } catch (error) {
            alert("Error de conexión al eliminar usuario");
        } finally {
            setDeleteLoading(false);
        }
    };

    // Filter users by search term (frontend search)
    const filteredUsers = users.filter((u) =>
        `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Helper function to get display name
    const getUserDisplayName = (user: User) => {
        if (user.first_name || user.last_name) {
            return `${user.first_name} ${user.last_name}`.trim();
        }
        return user.email;
    };

    // Role badge color
    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            admin: "badge-error",
            rector: "badge-warning",
            teacher: "badge-info",
            student: "badge-success",
        };
        const labels: Record<string, string> = {
            admin: "Administrador",
            rector: "Rector",
            teacher: "Profesor",
            student: "Estudiante",
        };
        return (
            <span className={`badge ${colors[role] || "badge-ghost"} badge-sm`}>
                {labels[role] || role}
            </span>
        );
    };

    return (
        <div className="container mx-auto px-6 pt-2 pb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    className="input input-bordered w-96"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="flex items-center gap-2">
                    <button className="btn btn-primary" onClick={handleCreate}>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Nuevo Usuario
                    </button>
                    <button className="btn" onClick={fetchUsers}>
                        <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                        Actualizar
                    </button>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            {/* Users table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <table className="table w-full table-fixed">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-[30%]">Nombre</th>
                            <th className="w-[40%]">Email</th>
                            <th className="w-[15%]">Rol</th>
                            <th className="w-[15%] text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                </td>
                            </tr>
                        ) : paginatedUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                    {filteredUsers.length === 0 && searchTerm
                                        ? "No se encontraron usuarios que coincidan con tu búsqueda"
                                        : "No se encontraron usuarios"}
                                </td>
                            </tr>
                        ) : (
                            paginatedUsers.map((u) => (
                                <tr key={u.email} className="hover:bg-gray-50">
                                    <td className="font-medium truncate" title={getUserDisplayName(u)}>
                                        {getUserDisplayName(u)}
                                    </td>
                                    <td className="text-gray-600 truncate" title={u.email}>
                                        {u.email}
                                    </td>
                                    <td>{getRoleBadge(u.role)}</td>
                                    <td className="text-right">
                                        <div className="flex justify-center gap-1">
                                            <button
                                                className="p-1 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                                                title="Editar"
                                                onClick={() => handleEdit(u)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-1 text-gray-500 hover:text-error transition-colors cursor-pointer"
                                                title="Eliminar"
                                                onClick={() => handleDeleteClick(u)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!loading && filteredUsers.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-m text-gray-500">
                        Mostrando {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} usuarios
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className="btn"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            «
                        </button>

                        <div className="join">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <input
                                    key={page}
                                    type="radio"
                                    name="pagination"
                                    className="join-item btn btn-square"
                                    aria-label={String(page)}
                                    checked={page === currentPage}
                                    onChange={() => setCurrentPage(page)}
                                />
                            ))}
                        </div>

                        <button
                            className="btn"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            »
                        </button>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            <UserFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSuccess={fetchUsers}
                userToEdit={editingUser}
                isLoadingData={loadingUserDetail}
            />

            {/* Delete Confirmation Modal */}
            {isDeleteVisible && userToDelete && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 ${isDeleteModalOpen ? "animate-in fade-in duration-300" : "animate-out fade-out duration-300"}`}>
                    <div className={`bg-white rounded-lg shadow-xl w-full max-w-md ${isDeleteModalOpen ? "animate-in fade-in slide-in-from-bottom-16 duration-500" : "animate-out fade-out slide-out-to-bottom-16 duration-300"}`}>
                        <div className="p-6 text-center">
                            <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                ¿Eliminar usuario?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Estás a punto de eliminar al usuario <strong>{getUserDisplayName(userToDelete)}</strong> ({userToDelete.email}). Esta acción no se puede deshacer.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={deleteLoading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-error"
                                    onClick={confirmDelete}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? <span className="loading loading-spinner loading-sm"></span> : "Sí, eliminar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
