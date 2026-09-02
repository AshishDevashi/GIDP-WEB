"use client";

import { ArrowLeft, Star, Users } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JoinTeamDialog } from "@/features/teams/components/join-team-dialog";
import { LeaveTeamButton } from "@/features/teams/components/leave-team-button";
import { useTeam, useTeamMembers } from "@/features/teams/hooks";
import { useAuthStore } from "@/store/auth-store";

export function TeamDetailView({ slug }: { slug: string }) {
  const { data: team, isLoading, isError, error } = useTeam(slug);
  const { data: members = [], isLoading: isLoadingMembers } = useTeamMembers(
    team?.id,
  );
  const userId = useAuthStore((state) => state.user?.id);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError || !team) {
    return (
      <Card>
        <CardContent className="text-danger p-5 text-sm">
          {error?.message ?? "Team not found"}
        </CardContent>
      </Card>
    );
  }

  const isMember = members.some((member) => member.user_id === userId);

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/teams">
          <ArrowLeft className="h-4 w-4" />
          All teams
        </Link>
      </Button>

      <PageHeader
        title={team.name}
        description={`/${team.slug}`}
        actions={
          <>
            <Badge tone={team.is_active ? "success" : "neutral"}>
              {team.is_active ? "active" : "inactive"}
            </Badge>
            {isMember ? (
              <LeaveTeamButton team={team} size="md" />
            ) : (
              <JoinTeamDialog team={team} size="md" />
            )}
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-border divide-y">
          {isLoadingMembers && <Skeleton className="h-16 w-full" />}

          {!isLoadingMembers && members.length === 0 && (
            <p className="text-muted-foreground py-2 text-sm">
              No members yet.
            </p>
          )}
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <p className="truncate text-sm font-medium">
                {member.user_id}
                {member.user_id === userId && " (you)"}
              </p>
              <div className="flex items-center gap-2">
                {member.is_primary && (
                  <Badge tone="primary">
                    <Star className="mr-1 h-3 w-3" />
                    primary
                  </Badge>
                )}
                <Badge>{member.role_in_team}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
