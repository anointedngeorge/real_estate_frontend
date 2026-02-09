import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://localhost:8000/api
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;