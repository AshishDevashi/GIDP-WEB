import { apiClient } from "@/lib/api-client";

import { lifecycleListSchema, lookupsSchema, tierListSchema } from "./types";

export async function fetchLookups() {
  const { data } = await apiClient.get("/lookups");
  return lookupsSchema.parse(data);
}

export async function fetchLifecycles() {
  const { data } = await apiClient.get("/lookups/lifecycles");
  return lifecycleListSchema.parse(data);
}

export async function fetchTiers() {
  const { data } = await apiClient.get("/lookups/tiers");
  return tierListSchema.parse(data);
}
