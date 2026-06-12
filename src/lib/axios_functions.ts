import axios from "axios";
import api from "./http";
import { useQuery } from "@tanstack/react-query";
import {
  CreateUserInterface,
  UserProfileUpdate,
  UserProfileUpdate2,
} from "@/interfaces/auth";
import {
  SystemSettingsInterface,
  UsersListingQueryInterface,
} from "@/interfaces/general";
import { REAL_ESTATE_SETTINGS } from "./constants";

export const useUser = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: get_user_details,
    retry: true,
  });

export const useSettings = () =>
  useQuery({
    queryKey: ["settings"],
    queryFn: list_system_settings,
    retry: false,
  });

export const useUserListing = (query: Partial<UsersListingQueryInterface>) =>
  useQuery({
    queryKey: ["userListings", query],
    queryFn: () => user_listings(query),
    retry: false,
  });

export const useUserRolePermissions = (user_id: string) =>
  useQuery({
    queryKey: ["userRolePermissions", user_id],
    queryFn: () => get_user_role_permission(user_id),
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
      document.location.replace('/')
      throw new Error(error.response?.data?.detail ?? "Failed to fetch user");
    }
    throw error;
  }
};

export const get_user_role_permission = async (user_id: string) => {
  try {
    const response = await api.get(
      `/users/userRolePermissions?user_id=${user_id}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail ?? "Failed to fetch user");
    }
    throw error;
  }
};

export const update_user_suspended = async (user_id: string) => {
  try {
    const response = await api.put(`/auth/suspendUser/${user_id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail ?? "Failed to fetch user");
    }
    throw error;
  }
};

export const update_signed_user = async (
  payload: Partial<UserProfileUpdate>,
) => {
  try {
    const response = await api.put("/auth/updateSignedUser", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ??
          error.response?.data?.detail ??
          "Failed to update user",
      );
    }
    throw error;
  }
};

export const update_object_info = async <T>(
  payload: Partial<T>,
  url?: string
) => {

  try {
    const url_path = url ? url : "/users/update";
    const response = await api.put(url_path, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ??
          error.response?.data?.detail ??
          "Failed to update user",
      );
    }
    throw error;
  }
};

export const system_settings = async (payload) => {
  try {
    const response = await api.post("/system/settings", { data: payload });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ??
          error.response?.data?.detail ??
          "Failed to save settings",
      );
    }
    throw error;
  }
};

export const list_system_settings = async () => {
  try {
    const response = await api.get("/system/settings");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ??
          error.response?.data?.detail ??
          "Failed to save settings",
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
};

// users
export const create_object = async <T>(payload: Partial<T>, url?: string) => {
  try {

    const url_path = url? url : "/auth/signup";
    const response = await api.post(url_path, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ??
          error.response?.data?.detail ??
          "Failed to create object",
      );
    }
    throw error;
  }
};

// delete user

export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/users/delete?user_id=${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ??
          error.response?.data?.detail ??
          "Failed to delete user",
      );
    }
    throw error;
  }
};

export const user_listings = async (
  query: Partial<UsersListingQueryInterface>,
) => {
  const url = query.url ? query.url : "/users/list?";

  try {
    const params = new URLSearchParams();

    if (query.id) {
      params.append("id", query.id);
    }

    if (query.page) {
      params.append("page", query.page.toString());
    }

    if (query.page_size) {
      params.append("page_size", query.page_size.toString());
    }

    if (query.exclude_users_roles?.length) {
      params.append("exclude_users_roles", query.exclude_users_roles);
    }

    const response = await api.get(`${url}${params.toString()}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ??
          error.response?.data?.detail ??
          "Failed to fetch users",
      );
    }

    throw error;
  }
};

// remove user permission
export const remove_user_permission = async (user_id: string, perm: string) => {
  try {
    const response = await api.delete(
      `/users/removePermission?user_id=${user_id}&perm=${perm}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ??
          error.response?.data?.detail ??
          "Failed to remove permission",
      );
    }
    throw error;
  }
};
