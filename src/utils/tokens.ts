// Almacenamiento de los JWT en localStorage (sin cookies).
const ACCESS_KEY = "gimpa_access";
const REFRESH_KEY = "gimpa_refresh";

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
};

export const setAccessToken = (access: string) => {
  localStorage.setItem(ACCESS_KEY, access);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};
