"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/lib/api-client";

import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "./api";
import type { ProjectPayload } from "./types";

export const projectKeys = {
  all: ["projects"] as const,
  list: () => [...projectKeys.all, "list"] as const,
};

export function useProjects() {
  return useQuery({ queryKey: projectKeys.list(), queryFn: fetchProjects });
}

// No single-project endpoint yet, so the detail page reads from the list query.
export function useProject(id: string) {
  const query = useProjects();
  return {
    ...query,
    data: query.data?.find((project) => project.id === id),
  };
}

function useProjectMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<void>,
  successMessage: string,
  onDone?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, TVariables>({
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success(successMessage);
      onDone?.();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCreateProject(onDone?: () => void) {
  return useProjectMutation<ProjectPayload>(
    createProject,
    "Project created",
    onDone,
  );
}

export function useUpdateProject(id: string, onDone?: () => void) {
  return useProjectMutation<ProjectPayload>(
    (payload) => updateProject(id, payload),
    "Project updated",
    onDone,
  );
}

export function useDeleteProject(onDone?: () => void) {
  return useProjectMutation<string>(deleteProject, "Project deleted", onDone);
}
