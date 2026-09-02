import { apiClient } from "@/lib/api-client";

import {
  authResponseSchema,
  type AuthResponse,
  type LoginInput,
  type RegisterInput,
} from "./types";

export async function login(payload: LoginInput): Promise<AuthResponse> {
  const { data } = await apiClient.post("/auth/login", payload);
  return authResponseSchema.parse(data);
}

export async function register(payload: RegisterInput): Promise<AuthResponse> {
  const { data } = await apiClient.post("/auth/register", payload);
  return authResponseSchema.parse(data);
}
