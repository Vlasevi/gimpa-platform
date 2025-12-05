import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar fijo, sin scroll */}
      <div className="h-screen sticky top-0">
        <Sidebar />
      </div>
      {/* Contenido principal con scroll independiente */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 bg-white overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
