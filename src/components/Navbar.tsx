import { useAuth } from "./Login/loginLogic";
import { useState } from "react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  const handleProfile = () => {
    // TODO: Implementar vista de perfil
    console.log("Ver perfil de:", user?.email);
  };

  return (
    <header className="flex h-18 items-center justify-end px-6 border-b border-gray-200">
      <div className="flex items-center gap-4">
        {user && (
          <>
            {/* Avatar y menú de usuario */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.displayname || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Menú desplegable */}
              <ul
                tabIndex={0}
                className="dropdown-content z-50 menu p-2 shadow-lg bg-white rounded-lg w-52 border border-gray-200"
              >
                <li>
                  <button
                    onClick={handleProfile}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Ver Perfil
                  </button>
                </li>
                <div className="divider my-0"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        {/* ...icon... */}
                        Cerrar Sesión
                      </>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
