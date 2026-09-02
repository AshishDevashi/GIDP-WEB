import { apiClient } from "@/lib/api-client";

import { projectListSchema, type ProjectPayload } from "./types";

export async function fetchProjects() {
  const { data } = await apiClient.get("/projects");
  return projectListSchema.parse(data);
}

export async function createProject(payload: ProjectPayload) {
  await apiClient.post("/projects", payload);
}

export async function updateProject(id: string, payload: ProjectPayload) {
  await apiClient.put(`/projects/${id}`, payload);
}

export async function deleteProject(id: string) {
  await apiClient.delete(`/projects/${id}`);
}
