"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

import type { ApiError } from "@/lib/api-client";
import { authToken } from "@/lib/auth-token";
import { useAuthStore } from "@/store/auth-store";

import { login, register } from "./api";
import type { AuthResponse, LoginInput, RegisterInput } from "./types";

const DEFAULT_REDIRECT = "/dashboard";

function useAuthMutation<TInput>(
  mutationFn: (input: TInput) => Promise<AuthResponse>,
  successMessage: string,
  redirectTo = DEFAULT_REDIRECT,
) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<AuthResponse, ApiError, TInput>({
    mutationFn,
    onSuccess: ({ token, user }) => {
      authToken.set(token);
      setUser(user);
      toast.success(successMessage);
      router.replace(redirectTo);
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useLogin(redirectTo?: string) {
  return useAuthMutation<LoginInput>(login, "Welcome back", redirectTo);
}

export function useRegister(redirectTo?: string) {
  return useAuthMutation<RegisterInput>(
    register,
    "Account created",
    redirectTo,
  );
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useCallback(() => {
    authToken.clear();
    setUser(null);
    queryClient.clear();
    router.replace("/auth");
  }, [queryClient, router, setUser]);
}
