import axios, { AxiosError } from "axios";

import { authToken } from "@/lib/auth-token";
import { env } from "@/lib/env";

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

export type ApiError = {
  status: number;
  message: string;
};

export function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null && "status" in error;
}

apiClient.interceptors.request.use((config) => {
  const token = authToken.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string }>) => {
    const status = error.response?.status ?? 0;

    if (status === 401 && typeof window !== "undefined") {
      authToken.clear();
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.replace("/auth");
      }
    }

    const apiError: ApiError = {
      status,
      message:
        error.response?.data?.error ?? error.message ?? "Unexpected API error",
    };
    return Promise.reject(apiError);
  },
);
