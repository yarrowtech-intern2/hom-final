const rawApiBaseUrl = import.meta.env.VITE_API_URL?.trim();

const API_BASE_URL =
  rawApiBaseUrl ||
  (import.meta.env.MODE === "development" ? "http://localhost:5000" : "");

export default API_BASE_URL;
