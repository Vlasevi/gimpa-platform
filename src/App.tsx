import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@/components/Login/loginLogic";
import { PermissionRoute } from "@/components/PermissionRoute";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Estudiantes from "./pages/Estudiantes";
import Matriculas from "./pages/Matriculas";
import Notas from "./pages/Notas";
import Pagos from "./pages/Pagos";
import Certificados from "./pages/Certificados";
import Usuarios from "./pages/Usuarios";
import Contratacion from "./pages/Contratacion";
import MiContrato from "./pages/MiContrato";
import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<NotAuthorized />} />
          <Route path="/404" element={<NotFound />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/estudiantes" element={<Estudiantes />} />
              <Route
                path="/matriculas"
                element={
                  <PermissionRoute section="enrollments" anyOf={["canView"]}>
                    <Matriculas />
                  </PermissionRoute>
                }
              />
              <Route
                path="/notas"
                element={
                  <PermissionRoute section="grades" anyOf={["canView", "canManage"]}>
                    <Notas />
                  </PermissionRoute>
                }
              />
              <Route
                path="/pagos"
                element={
                  <PermissionRoute section="payments" anyOf={["canView", "canManage"]}>
                    <Pagos />
                  </PermissionRoute>
                }
              />
              <Route
                path="/certificados"
                element={
                  <PermissionRoute section="certifications" anyOf={["canView", "canManage"]}>
                    <Certificados />
                  </PermissionRoute>
                }
              />
              <Route
                path="/usuarios"
                element={
                  <PermissionRoute section="users" anyOf={["canView"]}>
                    <Usuarios />
                  </PermissionRoute>
                }
              />
              <Route path="/contratacion" element={<Contratacion />} />
              <Route path="/mi-contrato" element={<MiContrato />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
export default App;
