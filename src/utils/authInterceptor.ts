// Interceptor global de `fetch`: adjunta el Bearer a toda llamada a nuestra API y,
// ante un 401, intenta UN refresh y reintenta. Así ninguna llamada (matrículas,
// contratación, etc.) necesita cambiar de código para autenticarse con JWT.
import { API_BASE_URL, apiUrl, AUTH_PATHS } from "./api";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setTokens,
  clearTokens,
} from "./tokens";

const originalFetch = window.fetch.bind(window);

const isApiUrl = (url: string) => url.startsWith(API_BASE_URL);

// Endpoints donde NO se debe intentar refresh ante un 401 (son públicos o son el
// propio refresh; un 401 aquí significa credenciales inválidas, no token expirado).
const isAuthEndpoint = (url: string) =>
  url.includes(AUTH_PATHS.refresh) ||
  url.includes(AUTH_PATHS.loginAdmissions) ||
  url.includes(AUTH_PATHS.loginSocialExchange);

const urlOf = (input: RequestInfo | URL): string =>
  typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

const attachAuth = (init: RequestInit): RequestInit => {
  const token = getAccessToken();
  if (!token) return init;
  const headers = new Headers(init.headers || {});
  if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  return { ...init, headers };
};

// Un solo refresh en vuelo, compartido por todas las llamadas que fallen a la vez.
let refreshing: Promise<boolean> | null = null;

const doRefresh = async (): Promise<boolean> => {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await originalFetch(apiUrl(AUTH_PATHS.refresh), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access && data.refresh) setTokens(data.access, data.refresh);
    else if (data.access) setAccessToken(data.access);
    return Boolean(data.access);
  } catch {
    return false;
  }
};

const refreshOnce = (): Promise<boolean> => {
  if (!refreshing) refreshing = doRefresh().finally(() => (refreshing = null));
  return refreshing;
};

export function installAuthInterceptor() {
  window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = urlOf(input);
    if (!isApiUrl(url)) return originalFetch(input, init);

    let res = await originalFetch(input, attachAuth(init));

    if (res.status === 401 && !isAuthEndpoint(url)) {
      const ok = await refreshOnce();
      if (ok) {
        res = await originalFetch(input, attachAuth(init));
      } else {
        clearTokens();
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return res;
  };
}
