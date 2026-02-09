import api from "./http";
import { clearAuth, getAccessToken } from "./config";



api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => {Promise.reject(error)}
);



// RESPONSE INTERCEPTOR

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    //   clearAuth();
      globalThis.location.href = "/";
    }
    return Promise.reject(error);
  }
);