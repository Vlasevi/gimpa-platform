import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import AppShell from "./pages/AppShell";
import Estudiantes from "./pages/Estudiantes";
import Boletines from "./pages/Boletines";
import Matriculas from "./pages/Matriculas";
import Pagos from "./pages/Pagos";
import Notas from "./pages/Notas";
import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/estudiantes" replace />} />
              <Route path="estudiantes" element={<Estudiantes />} />
              <Route path="boletines" element={<Boletines />} />
              <Route path="matriculas" element={<Matriculas />} />
              <Route path="pagos" element={<Pagos />} />
              <Route path="notas" element={<Notas />} />
            </Route>

            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
