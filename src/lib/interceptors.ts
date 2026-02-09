import api from "./http";
import { getAccessToken } from "./config";

// const dt = globalThis.sessionStorage.getItem("real_estate_access_token");
// console.log(dt, "loading...")

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => Promise.reject(error)
);