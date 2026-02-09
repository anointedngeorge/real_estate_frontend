
export const getAccessToken = () =>
  globalThis.sessionStorage.getItem("real_estate_access_token");

export const getRefreshToken = () =>
  globalThis.sessionStorage.getItem("real_estate_refresh_token");

export const clearAuth = () => {
  globalThis.sessionStorage.removeItem("real_estate_access_token");
  globalThis.sessionStorage.removeItem("real_estate_refresh_token");
  globalThis.sessionStorage.removeItem("real_estate_jti");
};