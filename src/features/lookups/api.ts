import { apiClient } from "@/lib/api-client";

import { lookupsSchema } from "./types";

export async function fetchLookups() {
  const { data } = await apiClient.get("/lookups");
  return lookupsSchema.parse(data);
}
