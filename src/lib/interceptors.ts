import api from "./http";
import { clearAuth, getAccessToken } from "./config";
import { toast } from "@/hooks/use-toast";



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




function tostFun(error: { response: { data: { message: any; }; }; }, title: string) {
  toast({
          title: title,
          description: error.response?.data?.message,
        });
}
// RESPONSE INTERCEPTOR

api.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (error.response?.status === 400) {
        tostFun(error, "400 Error");
      //  console.log(error.response?.data?.message, "error...")
    }

    // unprocessed data
    if (error.response?.status === 422) {
      //  console.log(error.response?.statusText, "error...")
      tostFun(error, "422 Error");
    }

    // unauthorized
    if (error.response?.status === 401) {
      clearAuth();
      globalThis.location.href = "/";
    }


    return Promise.reject(error);
  }
);