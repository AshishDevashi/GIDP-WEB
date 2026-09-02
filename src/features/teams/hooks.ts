"use client";

import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

import {
  addTeamMember,
  createTeam,
  fetchTeamBySlug,
  fetchTeamMembers,
  fetchTeams,
  removeTeamMember,
} from "./api";
import type { CreateTeamInput, JoinTeamInput, Team, TeamMember } from "./types";

export const teamKeys = {
  all: ["teams"] as const,
  list: () => [...teamKeys.all, "list"] as const,
  detail: (slug: string) => [...teamKeys.all, "detail", slug] as const,
  members: (teamId: string) => [...teamKeys.all, "members", teamId] as const,
};

const NOT_SIGNED_IN: ApiError = {
  status: 401,
  message: "You must be signed in",
};

export function useTeams() {
  return useQuery({ queryKey: teamKeys.list(), queryFn: fetchTeams });
}

export function useTeam(slug: string) {
  return useQuery({
    queryKey: teamKeys.detail(slug),
    queryFn: () => fetchTeamBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useTeamMembers(teamId: string | undefined) {
  return useQuery({
    queryKey: teamKeys.members(teamId ?? ""),
    queryFn: () => fetchTeamMembers(teamId!),
    enabled: Boolean(teamId),
  });
}

/** Members of every listed team, keyed by team id, plus the user's memberships. */
export function useTeamsMembers(teams: Team[]) {
  const userId = useAuthStore((state) => state.user?.id);

  return useQueries({
    queries: teams.map((team) => ({
      queryKey: teamKeys.members(team.id),
      queryFn: () => fetchTeamMembers(team.id),
    })),
    combine: (results) => {
      const membersByTeam: Record<string, TeamMember[]> = {};
      const myTeamIds = new Set<string>();

      teams.forEach((team, index) => {
        const members = results[index]?.data ?? [];
        membersByTeam[team.id] = members;
        if (members.some((member) => member.user_id === userId)) {
          myTeamIds.add(team.id);
        }
      });

      return {
        membersByTeam,
        myTeamIds,
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
}

function useTeamsInvalidator() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: teamKeys.all });
}

export function useCreateTeam(options?: { onSuccess?: () => void }) {
  const invalidate = useTeamsInvalidator();

  return useMutation<void, ApiError, CreateTeamInput>({
    mutationFn: createTeam,
    onSuccess: async () => {
      await invalidate();
      toast.success("Team created");
      options?.onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useJoinTeam(options?: { onSuccess?: () => void }) {
  const invalidate = useTeamsInvalidator();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation<void, ApiError, { teamId: string } & JoinTeamInput>({
    mutationFn: ({ teamId, ...payload }) =>
      userId
        ? addTeamMember(teamId, { user_id: userId, ...payload })
        : Promise.reject(NOT_SIGNED_IN),
    onSuccess: async () => {
      await invalidate();
      toast.success("Joined team");
      options?.onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useLeaveTeam() {
  const invalidate = useTeamsInvalidator();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation<void, ApiError, { teamId: string }>({
    mutationFn: ({ teamId }) =>
      userId ? removeTeamMember(teamId, userId) : Promise.reject(NOT_SIGNED_IN),
    onSuccess: async () => {
      await invalidate();
      toast.success("Left team");
    },
    onError: (error) => toast.error(error.message),
  });
}
