import { apiClient } from "@/lib/api-client";

import {
  registryListSchema,
  registrySchema,
  type RegistryPayload,
} from "./types";

export async function fetchRegistries() {
  const { data } = await apiClient.get("/registries");
  return registryListSchema.parse(data);
}

export async function fetchRegistry(id: string) {
  const { data } = await apiClient.get(`/registries/${id}`);
  return registrySchema.parse(data);
}

export async function createRegistry(payload: RegistryPayload) {
  await apiClient.post("/registries", payload);
}

export async function deleteRegistry(id: string) {
  await apiClient.delete(`/registries/${id}`);
}
