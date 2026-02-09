import axios from "axios";
import api from "./http";
import { useQuery } from "@tanstack/react-query";


export const useUser = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: get_user_details,
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





