const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000" // local backend
    : "https://hom-backend-y3eh.onrender.com"; // live backend on Render

export default API_BASE_URL;
