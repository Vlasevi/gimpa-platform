import React, { useContext, useState, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Spinner from "@/components/auxiliar/Spinner";
import { API_BASE_URL, apiUrl, buildHeaders } from "@/utils/api";

const apiAccountsCheck = apiUrl("/api/accounts/me");
const logoutEndpoint = apiUrl("/api/accounts/me/logout/");
export const loginUrl = apiUrl("/auth/login/azuread-tenant-oauth2");

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  checkAuth: async () => {},
  logout: async () => {},
});

function getCookie(cookieName: String) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.substring(0, cookieName.length + 1) === cookieName + "=") {
        cookieValue = decodeURIComponent(
          cookie.substring(cookieName.length + 1)
        );
        break;
      }
    }
  }
  return cookieValue;
}

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    setLoading(true);
    try {
      console.log("🔍 Verificando sesión...");

      const response = await fetch(apiAccountsCheck, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log("✅ Sesión válida:", userData);
        setUser(userData);
        setAuthenticated(true);
      } else {
        console.log("❌ No hay sesión");
        setAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setAuthenticated(false);
      setUser(null);
    } finally {
      console.log("🏁 Verificación completa");
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch(logoutEndpoint, {
        method: "POST",
        credentials: "include",
        headers: buildHeaders(),
      });

      if (!response.ok) {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setAuthenticated(false);
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, isLoading, checkAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    console.log(
      `No se puede redirigir a porque el usuario no está autenticado.`
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("✅ Autenticado - Mostrando contenido");
  return <Outlet />;
};
