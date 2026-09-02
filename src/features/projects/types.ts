import { z } from "zod";

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullish(),
  project_type: z.string().nullish(),
  architecture: z.string().nullish(),
  owner_team_id: z.string().nullish(),
  tech_lead_id: z.string().nullish(),
  lifecycle_id: z.number().nullish(),
  tier_id: z.number().nullish(),
  docs_url: z.string().nullish(),
  dashboard_url: z.string().nullish(),
  runbook_url: z.string().nullish(),
  parent_project_id: z.string().nullish(),
  is_active: z.boolean().nullish(),
});

export const projectListSchema = z.array(projectSchema);

export const architectures = ["monolith", "microservice"] as const;

const optionalUrl = z.union([z.literal(""), z.url("Enter a valid URL")]);

export const projectFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[A-Za-z0-9._-]+$/, "Use letters, numbers, dots, dashes only"),
  description: z.string(),
  project_type: z.string(),
  architecture: z.union([z.literal(""), z.enum(architectures)]),
  owner_team_id: z.string().min(1, "Select an owner team"),
  tech_lead_id: z.string(),
  lifecycle_id: z.coerce.number().int().min(1, "Select a lifecycle"),
  tier_id: z.coerce.number().int().min(1, "Select a tier"),
  docs_url: optionalUrl,
  dashboard_url: optionalUrl,
  runbook_url: optionalUrl,
  parent_project_id: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectFormValues = z.input<typeof projectFormSchema>;
export type ProjectPayload = z.output<typeof projectFormSchema>;

export const emptyProjectForm: ProjectFormValues = {
  name: "",
  slug: "",
  description: "",
  project_type: "",
  architecture: "",
  owner_team_id: "",
  tech_lead_id: "",
  lifecycle_id: "",
  tier_id: "",
  docs_url: "",
  dashboard_url: "",
  runbook_url: "",
  parent_project_id: "",
};

export function toFormValues(project: Project): ProjectFormValues {
  return {
    name: project.name,
    slug: project.slug,
    description: project.description ?? "",
    project_type: project.project_type ?? "",
    architecture:
      project.architecture === "monolith" ||
      project.architecture === "microservice"
        ? project.architecture
        : "",
    owner_team_id: project.owner_team_id ?? "",
    tech_lead_id: project.tech_lead_id ?? "",
    lifecycle_id: project.lifecycle_id ?? "",
    tier_id: project.tier_id ?? "",
    docs_url: project.docs_url ?? "",
    dashboard_url: project.dashboard_url ?? "",
    runbook_url: project.runbook_url ?? "",
    parent_project_id: project.parent_project_id ?? "",
  };
}

export function slugify(value: string) {
  return value
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
