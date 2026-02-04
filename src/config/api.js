import axios from "axios";

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Apple Sign-In Configuration
export const APPLE_CONFIG = {
  clientId: import.meta.env.VITE_APPLE_CLIENT_ID || "your_apple_client_id",
  redirectURI:
    import.meta.env.VITE_APPLE_REDIRECT_URI ||
    "https://your-frontend.com/apple-callback",
  scope: "email name",
  state: "state",
  nonce: "nonce",
  usePopup: true,
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
