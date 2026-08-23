/**
 * API Configuration
 * Centraliza la configuración del backend. Autenticación por JWT (Bearer) —
 * el header lo inyecta el interceptor global (`utils/authInterceptor`), no aquí.
 */

// URL base del API - toma el valor de la variable de entorno o usa localhost por defecto
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper para construir URLs del API
export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

// Rutas de autenticación (nombres cortos; el path social puede venir de env).
export const AUTH_PATHS = {
  loginSocial: import.meta.env.VITE_LOGIN_SOCIAL_PATH || "/login-social",
  loginSocialExchange: "/login-social/exchange",
  loginAdmissions: "/login-admissions",
  refresh: "/refresh",
  logout: "/logout",
} as const;

// Helper para construir headers. Solo maneja Content-Type; el Bearer lo pone el
// interceptor. Se conserva la firma (additionalHeaders, includeContentType) porque
// muchos call sites la usan; para FormData, pasar includeContentType = false.
export const buildHeaders = (
  additionalHeaders: HeadersInit = {},
  includeContentType: boolean = true,
): HeadersInit => {
  const headers: Record<string, string> = {
    ...(additionalHeaders as Record<string, string>),
  };
  if (includeContentType) headers["Content-Type"] = "application/json";
  return headers;
};

// Helper para hacer fetch con defaults JSON. El interceptor global adjunta el Bearer
// y maneja el refresh/reintento ante 401, así que aquí ya no hay lógica de sesión.
export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const { headers, ...rest } = options;
  return fetch(apiUrl(path), { headers: buildHeaders(headers), ...rest });
};

// Endpoints del API
export const API_ENDPOINTS = {
  // Auth
  me: "/api/accounts/me/",

  // Enrollments
  enrollments: "/api/enrollments/",
  enrollmentById: (id: number) => `/api/enrollments/${id}/`,
  enrollmentDocuments: (id: number) => `/api/enrollments/${id}/documents/`,
  enrollmentSaveStudentData: (id: number) =>
    `/api/enrollments/${id}/save-student-data/`,
  enrollmentGeneratePdfs: (id: number) =>
    `/api/enrollments/${id}/generate-pdfs/`,
  enrollmentGenerateUnsigned: (id: number) =>
    `/api/enrollments/${id}/generate-unsigned/`,
  requestOtp: "/api/enrollments/request-otp/",
  validateOtp: "/api/enrollments/validate-otp/",
  enrollmentListExcel: "/api/enrollments/list/",
  studentsDataExcel: "/api/accounts/students_data/",

  // Grades
  grades: "/api/grades/",

  // Users
  users: "/api/accounts/users/",
  usersByRole: (role: string) => `/api/accounts/users/?role=${role}`,

  // Contracting
  contracts: "/api/contracting/contracts/",
  contractById: (id: number) => `/api/contracting/contracts/${id}/`,
  contractSubmit: (id: number) => `/api/contracting/contracts/${id}/submit/`,
  contractRestore: (id: number) => `/api/contracting/contracts/${id}/restore/`,
  contractGenerateUnsigned: (id: number) =>
    `/api/contracting/contracts/${id}/generate-unsigned/`,
  contractDocuments: (id: number) =>
    `/api/contracting/contracts/${id}/documents/`,
  contractTemplates: "/api/contracting/contract-templates/",
  contractTemplateById: (id: number) => `/api/contracting/contract-templates/${id}/`,
  positions: "/api/contracting/positions/",
  contractRequestOtp: "/api/contracting/contracts/request-otp/",
  contractValidateOtp: "/api/contracting/contracts/validate-otp/",

  // Admissions — cuenta del acudiente (público)
  admissionsRegister: "/api/admissions/auth/register/",
  admissionsVerifyOtp: "/api/admissions/auth/verify-otp/",
  admissionsResendOtp: "/api/admissions/auth/resend-otp/",
  admissionsPasswordReset: "/api/admissions/auth/password-reset/",
  admissionsPasswordResetConfirm: "/api/admissions/auth/password-reset/confirm/",

  // Admissions — expedientes
  admissionsApplications: "/api/admissions/applications/",
  admissionsApplicationByCode: (code: string) =>
    `/api/admissions/applications/${code}/`,
  admissionsApplicationSubmit: (code: string) =>
    `/api/admissions/applications/${code}/submit/`,
  admissionsApplicationTransition: (code: string) =>
    `/api/admissions/applications/${code}/transition/`,
  admissionsApplicationRestore: (code: string) =>
    `/api/admissions/applications/${code}/restore/`,

  // Geo (catálogo Colombia — dropdowns en cascada)
  geoDepartments: "/api/geo/departments/",
  geoCities: "/api/geo/cities/",

  // Admissions — operación interna (fase 2)
  admissionsValidation: (code: string) =>
    `/api/admissions/applications/${code}/validation/`,
  admissionsPayment: (code: string) =>
    `/api/admissions/applications/${code}/payment/`,
  admissionsPaymentReport: (code: string) =>
    `/api/admissions/applications/${code}/payment/report/`,
  admissionsPaymentReview: (code: string) =>
    `/api/admissions/applications/${code}/payment/review/`,
  admissionsDocuments: (code: string) =>
    `/api/admissions/applications/${code}/documents/`,
  admissionsDocumentReview: (code: string) =>
    `/api/admissions/applications/${code}/documents/review/`,

  // Admissions — agenda y evaluación (fase 3)
  admissionsAssignableUsers: "/api/admissions/assignable-users/",
  admissionsInterviews: (code: string) =>
    `/api/admissions/applications/${code}/interviews/`,
  admissionsInterviewRegister: (code: string) =>
    `/api/admissions/applications/${code}/interviews/register/`,

  // Admissions — comité / decisión final (fase 4)
  admissionsDecision: (code: string) =>
    `/api/admissions/applications/${code}/decision/`,
} as const;
