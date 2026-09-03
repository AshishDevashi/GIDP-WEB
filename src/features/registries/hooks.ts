"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/lib/api-client";

import {
  createRegistry,
  deleteRegistry,
  fetchRegistries,
  fetchRegistry,
} from "./api";
import type { RegistryPayload } from "./types";

export const registryKeys = {
  all: ["registries"] as const,
  list: () => [...registryKeys.all, "list"] as const,
  detail: (id: string) => [...registryKeys.all, "detail", id] as const,
};

export function useRegistries() {
  return useQuery({ queryKey: registryKeys.list(), queryFn: fetchRegistries });
}

export function useRegistry(id: string) {
  return useQuery({
    queryKey: registryKeys.detail(id),
    queryFn: () => fetchRegistry(id),
    enabled: Boolean(id),
  });
}

function useRegistryMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<void>,
  successMessage: string,
  onDone?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, TVariables>({
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: registryKeys.all });
      toast.success(successMessage);
      onDone?.();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCreateRegistry(onDone?: () => void) {
  return useRegistryMutation<RegistryPayload>(
    createRegistry,
    "Registry created",
    onDone,
  );
}

export function useDeleteRegistry(onDone?: () => void) {
  return useRegistryMutation<string>(
    deleteRegistry,
    "Registry deleted",
    onDone,
  );
}
