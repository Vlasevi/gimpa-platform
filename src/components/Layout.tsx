import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "./Login/loginLogic";
import NoAccess from "@/pages/NoAccess";

export default function Layout() {
  const { user } = useAuth();
  // Sin permisos → cuenta sin accesos: ni sidebar ni contenido, solo el aviso.
  const noAccess = Boolean(user) && !user?.permissions;

  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Sidebar fijo, sin scroll */}
      {!noAccess && (
        <div className="h-screen sticky top-0">
          <Sidebar />
        </div>
      )}
      {/* Contenido principal con scroll independiente */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 bg-base-200 overflow-y-auto">
          {noAccess ? <NoAccess /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}
