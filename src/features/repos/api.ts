import { apiClient } from "@/lib/api-client";

import { repoListSchema, repoSchema, type RepoPayload } from "./types";

export async function fetchRepos() {
  const { data } = await apiClient.get("/repos");
  return repoListSchema.parse(data);
}

export async function fetchRepo(id: string) {
  const { data } = await apiClient.get(`/repos/${id}`);
  return repoSchema.parse(data);
}

export async function createRepo(payload: RepoPayload) {
  await apiClient.post("/repos", payload);
}

export async function deleteRepo(id: string) {
  await apiClient.delete(`/repos/${id}`);
}
