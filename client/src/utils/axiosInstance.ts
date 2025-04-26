import axios, { InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

const VITE_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: VITE_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

// Add request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    if (token) {
      config.headers["x-auth-token"] = token; // Attach token to request
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to store the logout callback
let onLogout: (() => void) | null = null;

// Function to set the logout callback dynamically
export const setLogoutHandler = (logoutCallback: () => void) => {
  onLogout = logoutCallback;
};

// Add response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    const config = response.config as CustomAxiosRequestConfig;
    const showSuccessToast = config.showSuccessToast ?? true;

    if (showSuccessToast && response?.data?.message) {
      toast.success(response?.data?.message);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (onLogout) {
        onLogout(); // Call the dynamically set logout function
      }
    }

    const showErrorToast = error.config?.showErrorToast ?? true;
    if (!showErrorToast) {
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.data &&
      Array.isArray(error.response.data.message)
    ) {
      // Extract errors from the message array
      const messages = error.response.data.message;
      messages.forEach((err: { msg: string }) => {
        toast.error(err.msg); // Show each error message
      });
    } else if (error.response?.data?.message) {
      // If message is a single string
      toast.error(error.response.data.message);
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      // Generic error message
      toast.error("An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
