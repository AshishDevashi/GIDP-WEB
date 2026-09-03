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
import { Select } from "@/components/ui/select";
import { useCreateRepo } from "@/features/repos/hooks";
import {
  emptyRepoForm,
  repoFormSchema,
  repoLanguages,
  type RepoFormValues,
  type RepoPayload,
} from "@/features/repos/types";

export function CreateRepoDialog() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RepoFormValues, unknown, RepoPayload>({
    resolver: zodResolver(repoFormSchema),
    defaultValues: emptyRepoForm,
  });

  const { mutate, isPending } = useCreateRepo(() => {
    reset(emptyRepoForm);
    setOpen(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset(emptyRepoForm);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          New repository
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a repository</DialogTitle>
          <DialogDescription>
            A repository is provisioned from a template on your Git provider.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => mutate(values))}
          className="space-y-4"
          noValidate
        >
          <Field id="repo-name" label="Name" error={errors.name?.message}>
            <Input
              id="repo-name"
              placeholder="normal-service"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>

          <Field
            id="repo-description"
            label="Description"
            error={errors.description?.message}
          >
            <Input
              id="repo-description"
              placeholder="Normal API"
              {...register("description")}
            />
          </Field>

          <Field
            id="repo-language"
            label="Language"
            error={errors.language?.message}
          >
            <Select id="repo-language" {...register("language")}>
              {repoLanguages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </Select>
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-primary h-4 w-4"
              {...register("private")}
            />
            Private repository
          </label>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Create repository
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
