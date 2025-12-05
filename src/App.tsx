import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@/components/Login/loginLogic";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Estudiantes from "./pages/Estudiantes";
import Matriculas from "./pages/Matriculas";
import Notas from "./pages/Notas";
import Pagos from "./pages/Pagos";
import Certificados from "./pages/Certificados";
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
              <Route path="/matriculas" element={<Matriculas />} />
              <Route path="/notas" element={<Notas />} />
              <Route path="/pagos" element={<Pagos />} />
              <Route path="/certificados" element={<Certificados />} />
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
