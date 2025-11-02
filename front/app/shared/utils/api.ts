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

async function handleResponse<T>(
  response: Response,
  onUnauthorized?: () => void
): Promise<T> {
  if (!response.ok) {
    // Handle 401 Unauthorized - Clear storage and redirect to login
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        window.localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

        // Call logout callback if provided
        onUnauthorized?.();

        // Redirect to login page
        window.location.href = "/login";
      }
    }

    const errorData: ApiError = await response.json().catch(() => ({
      statusCode: response.status,
      message: response.statusText,
      error: "Unknown error",
    }));

    throw new ApiException(
      errorData.statusCode || response.status,
      errorData.message || response.statusText,
      errorData.error || "Unknown error"
    );
  }

  return response.json();
}

let unauthorizedCallback: (() => void) | undefined;

export function setUnauthorizedCallback(callback: () => void) {
  unauthorizedCallback = callback;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return handleResponse<T>(response, unauthorizedCallback);
}

export async function apiPost<T>(
  endpoint: string,
  data: unknown,
  options: RequestInit = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGet<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "GET",
  });
}
