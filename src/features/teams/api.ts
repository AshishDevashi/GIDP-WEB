import { apiClient } from "@/lib/api-client";

import {
  teamListSchema,
  teamMemberListSchema,
  teamSchema,
  type AddMemberInput,
  type CreateTeamInput,
} from "./types";

export async function fetchTeams() {
  const { data } = await apiClient.get("/teams");
  return teamListSchema.parse(data);
}

export async function fetchTeamBySlug(slug: string) {
  const { data } = await apiClient.get(`/teams/${slug}`);
  return teamSchema.parse(data);
}

export async function fetchTeamMembers(teamId: string) {
  const { data } = await apiClient.get(`/teams/${teamId}/members`);
  return teamMemberListSchema.parse(data);
}

export async function createTeam(payload: CreateTeamInput) {
  await apiClient.post("/teams", payload);
}

export async function addTeamMember(teamId: string, payload: AddMemberInput) {
  await apiClient.post(`/teams/${teamId}/members`, payload);
}

export async function removeTeamMember(teamId: string, userId: string) {
  await apiClient.delete(`/teams/${teamId}/members/${userId}`);
}
