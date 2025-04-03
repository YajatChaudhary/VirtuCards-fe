import axios, {
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { setCookie, deleteCookie } from "cookies-next";

// Define base API URL from environment variable or default
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4200/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function for safe localStorage access (to avoid SSR issues)
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = safeLocalStorage.getItem("accessToken");
    const clientId =
      process.env.NEXT_PUBLIC_CLIENT_ID || "virtual-cards-web-client";

    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Always include client_id in headers
    if (config.headers) {
      config.headers["client_id"] = clientId;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = safeLocalStorage.getItem("refreshToken");
        const clientId =
          process.env.NEXT_PUBLIC_CLIENT_ID || "virtual-cards-web-client";

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          {
            headers: {
              client_id: clientId,
              refreshToken: refreshToken,
            },
          }
        );

        if (response.data?.data?.accessToken) {
          safeLocalStorage.setItem(
            "accessToken",
            response.data.data.accessToken
          );

          // Update authorization header for original request
          if (originalRequest.headers) {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${response.data.data.accessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Handle refresh token failure
        safeLocalStorage.removeItem("accessToken");
        safeLocalStorage.removeItem("refreshToken");
        safeLocalStorage.removeItem("user");

        // Also clear cookies
        deleteCookie("accessToken");
        deleteCookie("refreshToken");

        // Redirect to login page (only in browser)
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  // Login user
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });

      console.log("Login response:", response.data);

      if (response.data?.data) {
        const { accessToken, refreshToken, user } = response.data.data;

        // Save tokens and user in localStorage
        safeLocalStorage.setItem("accessToken", accessToken);
        safeLocalStorage.setItem("refreshToken", refreshToken);
        safeLocalStorage.setItem("user", JSON.stringify(user));

        // Also set cookies for server-side auth checks
        setCookie("accessToken", accessToken, { maxAge: 60 * 60 * 24 * 7 });
        setCookie("refreshToken", refreshToken, { maxAge: 60 * 60 * 24 * 7 });

        return { success: true, data: response.data.data };
      }

      return { success: false, error: "Login failed" };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        error:
          axiosError.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    }
  },

  // Register user
  register: async (userData: {
    email: string;
    username: string;
    password: string;
    phone?: string;
    role_id: string;
  }) => {
    try {
      // Corrected endpoint based on the Swagger example (without /v1/)
      const response = await apiClient.post("/user", userData);
      return { success: true, data: response.data.data };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      console.error("Registration error:", axiosError.response?.data);
      return {
        success: false,
        error:
          axiosError.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const accessToken = safeLocalStorage.getItem("accessToken");

      if (accessToken) {
        await apiClient.post("/auth/log-out", {});
      }

      // Clear stored data
      safeLocalStorage.removeItem("accessToken");
      safeLocalStorage.removeItem("refreshToken");
      safeLocalStorage.removeItem("user");

      // Also clear cookies
      deleteCookie("accessToken");
      deleteCookie("refreshToken");

      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local storage
      safeLocalStorage.removeItem("accessToken");
      safeLocalStorage.removeItem("refreshToken");
      safeLocalStorage.removeItem("user");

      // Also clear cookies
      deleteCookie("accessToken");
      deleteCookie("refreshToken");

      return { success: true };
    }
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = safeLocalStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!safeLocalStorage.getItem("accessToken");
  },
};

export default apiClient;
