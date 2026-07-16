import { ShieldAlert, LogOut } from "lucide-react";
import { useAuth } from "@/components/Login/loginLogic";

// Se muestra cuando el usuario está autenticado pero aún NO tiene rol/permisos
// asignados (p.ej. primer ingreso por Microsoft). No hay secciones disponibles.
export default function NoAccess() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <ShieldAlert className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold text-secondary">
          Tu cuenta no tiene accesos asignados
        </h1>
        <p className="mt-3 text-base-content/70">
          Ya iniciaste sesión{user?.email ? ` como ${user.email}` : ""}, pero un administrador
          aún debe asignarte un rol para habilitar tus secciones. Si crees que es un error,
          contacta al equipo de la institución.
        </p>
        <button
          type="button"
          onClick={logout}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-100 px-6 text-sm font-medium text-base-content transition-all duration-200 ease-out hover:bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
