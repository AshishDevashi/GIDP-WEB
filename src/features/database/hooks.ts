"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/lib/api-client";

import {
  createDatabase,
  createDbInstance,
  deleteDatabase,
  deleteDbInstance,
  fetchDatabaseQuota,
  fetchDatabases,
  fetchDbInstances,
} from "./api";
import type { CreateDatabasePayload } from "./types";

export const databaseKeys = {
  all: ["database"] as const,
  instances: () => [...databaseKeys.all, "instances"] as const,
  databases: () => [...databaseKeys.all, "databases"] as const,
  quota: () => [...databaseKeys.all, "quota"] as const,
};

export function useDbInstances() {
  return useQuery({
    queryKey: databaseKeys.instances(),
    queryFn: fetchDbInstances,
  });
}

export function useCreateDbInstance(onDone?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError>({
    mutationFn: createDbInstance,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: databaseKeys.all });
      toast.success("DB instance created");
      onDone?.();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteDbInstance(onDone?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: deleteDbInstance,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: databaseKeys.all });
      toast.success("DB instance deleted");
      onDone?.();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDatabases(enabled: boolean) {
  return useQuery({
    queryKey: databaseKeys.databases(),
    queryFn: fetchDatabases,
    enabled,
  });
}

export function useDatabaseQuota(enabled: boolean) {
  return useQuery({
    queryKey: databaseKeys.quota(),
    queryFn: fetchDatabaseQuota,
    enabled,
  });
}

export function useCreateDatabase(onDone?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, CreateDatabasePayload>({
    mutationFn: createDatabase,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: databaseKeys.all });
      toast.success("Database created");
      onDone?.();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteDatabase(onDone?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: deleteDatabase,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: databaseKeys.all });
      toast.success("Database deleted");
      onDone?.();
    },
    onError: (error) => toast.error(error.message),
  });
}