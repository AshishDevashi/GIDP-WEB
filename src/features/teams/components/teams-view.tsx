"use client";

import { Search, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateTeamDialog } from "@/features/teams/components/create-team-dialog";
import { JoinTeamDialog } from "@/features/teams/components/join-team-dialog";
import { LeaveTeamButton } from "@/features/teams/components/leave-team-button";
import { useTeams, useTeamsMembers } from "@/features/teams/hooks";

export function TeamsView() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useTeams();

  const teams = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data ?? [];
    return (data ?? []).filter(
      (team) =>
        team.name.toLowerCase().includes(term) ||
        team.slug.toLowerCase().includes(term),
    );
  }, [data, search]);

  const { membersByTeam, myTeamIds } = useTeamsMembers(data ?? []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search teams by name or slug"
            className="pl-9"
          />
        </div>
        <div className="ml-auto">
          <CreateTeamDialog />
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="text-danger p-5 text-sm">
            {error.message}
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && teams.length === 0 && (
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center gap-2 p-10 text-center text-sm">
            <Users className="h-6 w-6" />
            {search ? "No teams matched your search." : "No teams yet."}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teams.map((team) => (
          <Card
            key={team.id}
            className="flex flex-col transition-shadow hover:shadow-md"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle>
                  <Link
                    href={`/teams/${team.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {team.name}
                  </Link>
                </CardTitle>
                <Badge tone={team.is_active ? "success" : "neutral"}>
                  {team.is_active ? "active" : "inactive"}
                </Badge>
              </div>
              <CardDescription>/{team.slug}</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground flex-1 text-sm">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {membersByTeam[team.id]?.length ?? 0} members
              </span>
            </CardContent>
            <CardFooter>
              {myTeamIds.has(team.id) ? (
                <LeaveTeamButton team={team} />
              ) : (
                <JoinTeamDialog team={team} />
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
