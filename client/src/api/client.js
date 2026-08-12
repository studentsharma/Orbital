import axios from "axios";

const api = axios.create({
  // In development, a same-origin Vite proxy forwards /api to the Nginx gateway.
  // Set VITE_API_GATEWAY_URL for a separately hosted production gateway.
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

export default api;
