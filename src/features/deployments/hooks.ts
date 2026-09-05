"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/lib/api-client";

import {
  createDeployment,
  createDeploymentInstance,
  deleteDeployment,
  deleteDeploymentInstance,
  fetchDeploymentInstance,
  fetchDeployments,
} from "./api";
import type { DeploymentPayload } from "./types";

export const deploymentKeys = {
  all: ["deployments"] as const,
  instance: () => [...deploymentKeys.all, "instance"] as const,
  list: () => [...deploymentKeys.all, "list"] as const,
};

function useDeploymentMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<void>,
  successMessage: string,
  onDone?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, TVariables>({
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: deploymentKeys.all });
      toast.success(successMessage);
      onDone?.();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeploymentInstance() {
  return useQuery({
    queryKey: deploymentKeys.instance(),
    queryFn: fetchDeploymentInstance,
  });
}

export function useCreateDeploymentInstance(onDone?: () => void) {
  return useDeploymentMutation<void>(
    createDeploymentInstance,
    "Deployment instance created",
    onDone,
  );
}

export function useDeleteDeploymentInstance(onDone?: () => void) {
  return useDeploymentMutation<void>(
    deleteDeploymentInstance,
    "Deployment instance deleted",
    onDone,
  );
}

export function useDeployments(enabled: boolean) {
  return useQuery({
    queryKey: deploymentKeys.list(),
    queryFn: fetchDeployments,
    enabled,
  });
}

export function useCreateDeployment(onDone?: () => void) {
  return useDeploymentMutation<DeploymentPayload>(
    createDeployment,
    "Deployment created",
    onDone,
  );
}

export function useDeleteDeployment(onDone?: () => void) {
  return useDeploymentMutation<string>(
    deleteDeployment,
    "Deployment deleted",
    onDone,
  );
}
