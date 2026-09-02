"use client";

import { Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLeaveTeam } from "@/features/teams/hooks";
import type { Team } from "@/features/teams/types";

export function LeaveTeamButton({
  team,
  size = "sm",
}: {
  team: Team;
  size?: "sm" | "md";
}) {
  const { mutate, isPending } = useLeaveTeam();

  return (
    <Button
      variant="outline"
      size={size}
      disabled={isPending}
      onClick={() => mutate({ teamId: team.id })}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      Leave
    </Button>
  );
}
