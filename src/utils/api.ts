/**
 * API Configuration
 * Centraliza todas las configuraciones relacionadas con el backend API
 */

// URL base del API - toma el valor de la variable de entorno o usa localhost por defecto
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper para construir URLs del API
export const apiUrl = (path: string) => {
  // Asegura que el path comience con /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

// Configuración de fetch con credenciales
export const fetchConfig: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

// Función para obtener el token CSRF de las cookies
export const getCsrfToken = (): string | null => {
  const name = "gimpa_csrftoken";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

// Helper para construir headers con CSRF token
export const buildHeaders = (
  additionalHeaders: HeadersInit = {},
  includeContentType: boolean = true
): HeadersInit => {
  const headers: Record<string, string> = {
    ...(additionalHeaders as Record<string, string>),
  };

  // Solo agregar Content-Type si se solicita (para FormData no debe incluirse)
  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  return headers;
};

// Flag to prevent infinite loops during session verification
let isVerifyingSession = false;

// Verify if the session is still valid by calling /accounts/me/
const verifySession = async (): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl("/api/accounts/me/"), {
      ...fetchConfig,
      headers: buildHeaders(),
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Helper para hacer fetch con la configuración por defecto
// Includes automatic session verification and retry on 401
export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const url = apiUrl(path);

  const config = {
    ...fetchConfig,
    ...options,
    headers: buildHeaders(options.headers),
  };

  const response = await fetch(url, config);

  // If we get a 401 and we're not already verifying session
  if (response.status === 401 && !isVerifyingSession) {
    isVerifyingSession = true;

    try {
      // Verify if session is still valid
      const sessionValid = await verifySession();

      if (sessionValid) {
        // Session is valid, retry the original request (might be CSRF issue)
        // Re-initialize CSRF token first
        await initializeCsrfToken();

        // Retry with fresh headers
        const retryConfig = {
          ...fetchConfig,
          ...options,
          headers: buildHeaders(options.headers),
        };

        const retryResponse = await fetch(url, retryConfig);

        // If still 401 after retry, redirect to login
        if (retryResponse.status === 401) {
          localStorage.removeItem("auth_session");
          window.location.href = "/login";
          throw new Error("Session expired");
        }

        return retryResponse;
      } else {
        // Session is not valid, redirect to login
        localStorage.removeItem("auth_session");
        window.location.href = "/login";
        throw new Error("Session expired");
      }
    } finally {
      isVerifyingSession = false;
    }
  }

  return response;
};

// Helper para inicializar CSRF token
export const initializeCsrfToken = async () => {
  try {
    await fetch(apiUrl("/api/accounts/csrf/"), {
      credentials: "include",
    });
  } catch (error) {
    console.error("[API] Failed to initialize CSRF token:", error);
  }
};

// Endpoints del API
export const API_ENDPOINTS = {
  // Auth
  csrf: "/api/accounts/csrf/",
  login: "/api/login/",
  logout: "/api/logout/",
  me: "/api/accounts/me/",

  // Enrollments
  enrollments: "/api/enrollments/",
  enrollmentById: (id: number) => `/api/enrollments/${id}/`,
  enrollmentDocuments: (id: number) => `/api/enrollments/${id}/documents/`,
  enrollmentGeneratePdfs: (id: number) =>
    `/api/enrollments/${id}/generate-pdfs/`,
  requestOtp: "/api/enrollments/request-otp/",
  validateOtp: "/api/enrollments/validate-otp/",
  enrollmentListExcel: "/api/enrollments/list/",
  studentsDataExcel: "/api/accounts/students_data/",

  // Grades
  grades: "/api/grades/",

  // Users
  users: "/api/accounts/users/",
  usersByRole: (role: string) => `/api/accounts/users/?role=${role}`,
} as const;
