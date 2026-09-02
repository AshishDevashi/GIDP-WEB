"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
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
import { useLifecycles, useTiers } from "@/features/lookups/hooks";
import { useCreateProject, useUpdateProject } from "@/features/projects/hooks";
import {
  architectures,
  emptyProjectForm,
  projectFormSchema,
  slugify,
  toFormValues,
  type Project,
  type ProjectFormValues,
  type ProjectPayload,
} from "@/features/projects/types";
import { useTeams } from "@/features/teams/hooks";
import { useUsers } from "@/features/users/hooks";

type ProjectFormDialogProps = {
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  projects: Project[];
};

export function ProjectFormDialog({
  trigger,
  open,
  onOpenChange,
  project,
  projects,
}: ProjectFormDialogProps) {
  const isEdit = Boolean(project);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<ProjectFormValues, unknown, ProjectPayload>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project ? toFormValues(project) : emptyProjectForm,
  });

  useEffect(() => {
    if (open) reset(project ? toFormValues(project) : emptyProjectForm);
  }, [open, project, reset]);

  const { data: teams = [] } = useTeams();
  const { data: users = [] } = useUsers();
  const { data: lifecycles = [] } = useLifecycles();
  const { data: tiers = [] } = useTiers();

  const close = () => onOpenChange(false);
  const create = useCreateProject(close);
  const update = useUpdateProject(project?.id ?? "", close);
  const { mutate, isPending } = isEdit ? update : create;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Edit ${project?.name}` : "Create a project"}
          </DialogTitle>
          <DialogDescription>
            Projects group services and own their lifecycle and tier.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => mutate(values))}
          className="space-y-4"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="project-name" label="Name" error={errors.name?.message}>
              <Input
                id="project-name"
                placeholder="Esales"
                {...register("name", {
                  onChange: (event) => {
                    if (!isEdit && !dirtyFields.slug) {
                      setValue("slug", slugify(event.target.value));
                    }
                  },
                })}
              />
            </Field>

            <Field id="project-slug" label="Slug" error={errors.slug?.message}>
              <Input
                id="project-slug"
                placeholder="esales"
                {...register("slug")}
              />
            </Field>
          </div>

          <Field
            id="project-description"
            label="Description"
            error={errors.description?.message}
          >
            <Input
              id="project-description"
              placeholder="Mobile app for sales"
              {...register("description")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="project-type"
              label="Project type"
              error={errors.project_type?.message}
            >
              <Input
                id="project-type"
                placeholder="service"
                {...register("project_type")}
              />
            </Field>

            <Field
              id="project-architecture"
              label="Architecture"
              error={errors.architecture?.message}
            >
              <Select id="project-architecture" {...register("architecture")}>
                <option value="">Not specified</option>
                {architectures.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              id="project-owner-team"
              label="Owner team"
              error={errors.owner_team_id?.message}
            >
              <Select id="project-owner-team" {...register("owner_team_id")}>
                <option value="">Select a team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              id="project-tech-lead"
              label="Tech lead"
              error={errors.tech_lead_id?.message}
            >
              <Select id="project-tech-lead" {...register("tech_lead_id")}>
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              id="project-lifecycle"
              label="Lifecycle"
              error={errors.lifecycle_id?.message}
            >
              <Select id="project-lifecycle" {...register("lifecycle_id")}>
                <option value="">Select a lifecycle</option>
                {lifecycles.map((lifecycle) => (
                  <option key={lifecycle.id} value={lifecycle.id}>
                    {lifecycle.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              id="project-tier"
              label="Tier"
              error={errors.tier_id?.message}
            >
              <Select id="project-tier" {...register("tier_id")}>
                <option value="">Select a tier</option>
                {tiers.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.code} — {tier.description}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              id="project-docs"
              label="Docs URL"
              error={errors.docs_url?.message}
            >
              <Input
                id="project-docs"
                placeholder="https://..."
                {...register("docs_url")}
              />
            </Field>

            <Field
              id="project-dashboard"
              label="Dashboard URL"
              error={errors.dashboard_url?.message}
            >
              <Input
                id="project-dashboard"
                placeholder="https://..."
                {...register("dashboard_url")}
              />
            </Field>

            <Field
              id="project-runbook"
              label="Runbook URL"
              error={errors.runbook_url?.message}
            >
              <Input
                id="project-runbook"
                placeholder="https://..."
                {...register("runbook_url")}
              />
            </Field>

            <Field
              id="project-parent"
              label="Parent project"
              error={errors.parent_project_id?.message}
            >
              <Select id="project-parent" {...register("parent_project_id")}>
                <option value="">None</option>
                {projects
                  .filter((candidate) => candidate.id !== project?.id)
                  .map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </option>
                  ))}
              </Select>
            </Field>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
