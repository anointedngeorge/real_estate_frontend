import { REAL_ESTATE_ACCESS_TOKEN, REAL_ESTATE_JTI, REAL_ESTATE_REFRESH_TOKEN, REAL_ESTATE_SETTINGS } from "./constants";



export const getAccessToken = () =>
  globalThis.sessionStorage.getItem(REAL_ESTATE_ACCESS_TOKEN);

export const getRefreshToken = () =>
  globalThis.sessionStorage.getItem(REAL_ESTATE_REFRESH_TOKEN);

export const clearAuth = () => {
  globalThis.sessionStorage.removeItem(REAL_ESTATE_ACCESS_TOKEN);
  globalThis.sessionStorage.removeItem(REAL_ESTATE_REFRESH_TOKEN);
  globalThis.sessionStorage.removeItem(REAL_ESTATE_JTI);
  // globalThis.localStorage.removeItem(REAL_ESTATE_SETTINGS);
};