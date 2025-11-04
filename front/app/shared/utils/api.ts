import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { STORAGE_KEYS } from "../constants/storage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

export class ApiException extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public error: string
  ) {
    super(message);
    this.name = "ApiException";
  }
}

let unauthorizedCallback: (() => void) | undefined;

export function setUnauthorizedCallback(callback: () => void) {
  unauthorizedCallback = callback;
}

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // Let axios infer Content-Type; we'll only add when needed
  withCredentials: false,
});

// Attach Authorization header automatically
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization =
        `Bearer ${token}`;
    }
  }
  return config;
});

// Centralized response/error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      window.localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

      // Call logout callback if provided
      unauthorizedCallback?.();
      // Only redirect to login if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    const responseData = error.response?.data;
    const statusCode = status ?? 0;
    const message = responseData?.message || error.message || "Unknown error";
    const err = responseData?.error || "Unknown error";

    throw new ApiException(statusCode, message, err);
  }
);

export async function apiRequest<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const method = options.method ?? "GET";
  const headers = options.headers ?? {};

  const res = await apiClient.request<T>({
    url: endpoint,
    method,
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Accept: "application/json",
      Version: 1,
    },
    data: options.data,
  });

  return res.data;
}
