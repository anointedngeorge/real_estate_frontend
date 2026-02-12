import axios from "axios";
import api from "./http";
import { useQuery } from "@tanstack/react-query";
import { userProfileUpdate } from "@/interfaces/auth";
import { systemSettingsInterface } from "@/interfaces/general";
import { REAL_ESTATE_SETTINGS } from "./constants";




export const useUser = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: get_user_details,
    retry: false,
  });





  export const useSettings = () =>
  useQuery({
    queryKey: ["settings"],
    queryFn: list_system_settings,
    retry: false,
  });



export const loginServer = async (username: string, password: string) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const response = await axios.post(`${baseUrl}/auth/signin`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};




export const get_user_details = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail ?? "Failed to fetch user");
    }
    throw error;
  }
};



export const update_signed_user = async (payload: Partial<userProfileUpdate>) => {
  try {
    const response = await api.put("/auth/updateSignedUser", payload );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ??
        error.response?.data?.detail ??
        "Failed to update user"
      );
    }
    throw error;
  }
};




export const system_settings = async (payload) => {
  try {
    const response = await api.post("/system/settings", {data:payload} );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ??
        error.response?.data?.detail ??
        "Failed to save settings"
      );
    }
    throw error;
  }
};

export const list_system_settings = async () => {
  try {
    const response = await api.get("/system/settings" );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ??
        error.response?.data?.detail ??
        "Failed to save settings"
      );
    }
    throw error;
  }
};



export const userLogout = async () => {
  try {

    const response = await api.post("/auth/signout");
    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail ?? "Failed to fetch user");
    }
    throw error;
  }
};



export const systemSettings = () => {
    const settings = globalThis.localStorage.getItem(REAL_ESTATE_SETTINGS);
    if (settings) {
        return JSON.parse(settings);
    }

    return null;
}



