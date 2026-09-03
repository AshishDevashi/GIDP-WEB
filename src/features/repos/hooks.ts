"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/lib/api-client";

import { createRepo, deleteRepo, fetchRepo, fetchRepos } from "./api";
import type { RepoPayload } from "./types";

export const repoKeys = {
  all: ["repos"] as const,
  list: () => [...repoKeys.all, "list"] as const,
  detail: (id: string) => [...repoKeys.all, "detail", id] as const,
};

export function useRepos() {
  return useQuery({ queryKey: repoKeys.list(), queryFn: fetchRepos });
}

export function useRepo(id: string) {
  return useQuery({
    queryKey: repoKeys.detail(id),
    queryFn: () => fetchRepo(id),
    enabled: Boolean(id),
  });
}

function useRepoMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<void>,
  successMessage: string,
  onDone?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, TVariables>({
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: repoKeys.all });
      toast.success(successMessage);
      onDone?.();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCreateRepo(onDone?: () => void) {
  return useRepoMutation<RepoPayload>(createRepo, "Repository created", onDone);
}

export function useDeleteRepo(onDone?: () => void) {
  return useRepoMutation<string>(deleteRepo, "Repository deleted", onDone);
}
