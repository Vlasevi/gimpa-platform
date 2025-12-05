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

// Helper para hacer fetch con la configuración por defecto
export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const url = apiUrl(path);
  const config = {
    ...fetchConfig,
    ...options,
    headers: {
      ...fetchConfig.headers,
      ...options.headers,
    },
  };

  return fetch(url, config);
};

// Endpoints del API
export const API_ENDPOINTS = {
  // Auth
  login: "/api/login/",
  logout: "/api/logout/",
  me: "/api/accounts/me/",

  // Enrollments
  enrollments: "/api/enrollments/",
  enrollmentById: (id: number) => `/api/enrollments/${id}/`,
  enrollmentDocuments: (id: number) => `/api/enrollments/${id}/documents/`,
  enrollmentUpdateData: (id: number) => `/api/enrollments/${id}/update-data/`,
  enrollmentSubmit: (id: number) => `/api/enrollments/${id}/submit/`,
  enrollmentApprove: (id: number) => `/api/enrollments/${id}/approve/`,
  enrollmentReject: (id: number) => `/api/enrollments/${id}/reject/`,
  enrollmentCancel: (id: number) => `/api/enrollments/${id}/cancel/`,
  enrollmentDelete: (id: number) => `/api/enrollments/${id}/delete/`,
  enrollmentUpdateGradeYear: (id: number) =>
    `/api/enrollments/${id}/update-grade-year/`,
  enrollmentRequestCorrection: (id: number) =>
    `/api/enrollments/${id}/request-correction/`,
  enrollmentGeneratePdfs: (id: number) =>
    `/api/enrollments/${id}/generate-pdfs/`,
  requestOtp: "/api/enrollments/request-otp/",
  validateOtp: "/api/enrollments/validate-otp/",

  // Grades
  grades: "/api/grades/",

  // Users
  users: "/api/accounts/users/",
  usersByRole: (role: string) => `/api/accounts/users/?role=${role}`,
} as const;
