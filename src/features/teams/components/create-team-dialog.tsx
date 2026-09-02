"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useCreateTeam } from "@/features/teams/hooks";
import {
  createTeamSchema,
  slugify,
  type CreateTeamInput,
} from "@/features/teams/types";

export function CreateTeamDialog() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<CreateTeamInput>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { name: "", slug: "" },
  });

  const { mutate, isPending } = useCreateTeam({
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
        <Button>
          <Plus className="h-4 w-4" />
          Create team
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a team</DialogTitle>
          <DialogDescription>
            Teams group services, templates and members.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => mutate(values))}
          className="space-y-4"
          noValidate
        >
          <Field id="team-name" label="Name" error={errors.name?.message}>
            <Input
              id="team-name"
              placeholder="Platform Engineering"
              aria-invalid={Boolean(errors.name)}
              {...register("name", {
                onChange: (event) => {
                  if (!dirtyFields.slug) {
                    setValue("slug", slugify(event.target.value));
                  }
                },
              })}
            />
          </Field>

          <Field id="team-slug" label="Slug" error={errors.slug?.message}>
            <Input
              id="team-slug"
              placeholder="platform-engineering"
              aria-invalid={Boolean(errors.slug)}
              {...register("slug")}
            />
          </Field>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Create team
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
