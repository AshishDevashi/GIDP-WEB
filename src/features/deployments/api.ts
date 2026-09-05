import { apiClient, isApiError } from "@/lib/api-client";

import {
  deploymentInstanceResponseSchema,
  deploymentListSchema,
  deploymentSchema,
  type DeploymentPayload,
} from "./types";

export async function fetchDeploymentInstance() {
  try {
    const { data } = await apiClient.get("/deployment-instances");
    return deploymentInstanceResponseSchema.parse(data);
  } catch (error) {
    // No instance provisioned yet is a valid empty state, not a failure.
    if (isApiError(error) && error.status === 404) return undefined;
    throw error;
  }
}

export async function createDeploymentInstance() {
  await apiClient.post("/deployment-instances");
}

export async function deleteDeploymentInstance() {
  await apiClient.delete("/deployment-instances");
}

export async function fetchDeployments() {
  const { data } = await apiClient.get("/deployments");
  return deploymentListSchema.parse(data);
}

export async function fetchDeployment(id: string) {
  const { data } = await apiClient.get(`/deployments/${id}`);
  return deploymentSchema.parse(data);
}

export async function createDeployment(payload: DeploymentPayload) {
  await apiClient.post("/deployments", payload);
}

export async function deleteDeployment(id: string) {
  await apiClient.delete(`/deployments/${id}`);
}
