import { useAuth } from "./Login/loginLogic";
import { useState } from "react";
import { ChevronDown, User, LogOut, Loader2 } from "lucide-react";

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
    // El título de la sección lo pone cada página (su propio H1), no el navbar.
    <header className="flex h-18 items-center justify-end border-b border-base-300 bg-base-100 px-6">
      <div className="flex items-center gap-4">
        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-base-content">
                  {user.displayname || "Usuario"}
                </p>
                <p className="text-xs text-base-content/60">{user.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-base-content/40" />
            </div>

            {/* Menú desplegable */}
            <ul
              tabIndex={0}
              className="dropdown-content menu z-50 w-52 rounded-lg border border-base-300 bg-base-100 p-2 shadow-lg"
            >
              <li>
                <button
                  onClick={handleProfile}
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-base-content/80 transition-colors hover:bg-base-200"
                >
                  <User className="h-4 w-4" />
                  Ver Perfil
                </button>
              </li>
              <div className="divider my-0"></div>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-error transition-colors hover:bg-error/10"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};
