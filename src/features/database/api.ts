import { apiClient } from "@/lib/api-client";

import {
  databaseListSchema,
  databaseQuotaSchema,
  dbInstanceListSchema,
  type CreateDatabasePayload,
} from "./types";

export async function fetchDbInstances() {
  const { data } = await apiClient.get("/db-instances");
  return dbInstanceListSchema.parse(data);
}

export async function createDbInstance() {
  await apiClient.post("/db-instances");
}

export async function deleteDbInstance(id: string) {
  await apiClient.delete(`/db-instances/${id}`);
}

export async function fetchDatabases() {
  const { data } = await apiClient.get("/databases");
  return databaseListSchema.parse(data);
}

export async function fetchDatabaseQuota() {
  const { data } = await apiClient.get("/databases/quota");
  return databaseQuotaSchema.parse(data);
}

export async function createDatabase(payload: CreateDatabasePayload) {
  await apiClient.post("/databases", payload);
}

export async function deleteDatabase(id: string) {
  await apiClient.delete(`/databases/${id}`);
}