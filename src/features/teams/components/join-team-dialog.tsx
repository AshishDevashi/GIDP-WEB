"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { useJoinTeam } from "@/features/teams/hooks";
import {
  joinTeamSchema,
  teamRoles,
  type JoinTeamInput,
  type Team,
} from "@/features/teams/types";

export function JoinTeamDialog({
  team,
  size = "sm",
}: {
  team: Team;
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JoinTeamInput>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: { role_in_team: "member", is_primary: false },
  });

  const { mutate, isPending } = useJoinTeam({
    onSuccess: () => {
      reset();
      setOpen(false);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size={size}>
          <UserPlus className="h-4 w-4" />
          Join
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join {team.name}</DialogTitle>
          <DialogDescription>
            Pick your role in this team and whether it is your primary team.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) =>
            mutate({ teamId: team.id, ...values }),
          )}
          className="space-y-4"
        >
          <Field
            id="role-in-team"
            label="Role in team"
            error={errors.role_in_team?.message}
          >
            <Select id="role-in-team" {...register("role_in_team")}>
              {teamRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-primary h-4 w-4"
              {...register("is_primary")}
            />
            Set as my primary team
          </label>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Join team
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
