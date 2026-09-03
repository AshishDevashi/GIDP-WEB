import { z } from "zod";

export const repoSchema = z.object({
  id: z.string(),
  name: z.string(),
  full_name: z.string().nullish(),
  owner: z.string().nullish(),
  provider_id: z.number().nullish(),
  external_id: z.string().nullish(),
  url: z.string().nullish(),
  clone_url_ssh: z.string().nullish(),
  clone_url_https: z.string().nullish(),
  default_branch: z.string().nullish(),
  visibility: z.string().nullish(),
  template_used: z.string().nullish(),
  status: z.string().nullish(),
  description: z.string().nullish(),
  language: z.string().nullish(),
  created_by: z.string().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const repoListSchema = z.array(repoSchema);

export const repoLanguages = ["python", "go", "java", "node"] as const;

export const repoFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-z0-9._-]+$/, "Use letters, numbers, dots, dashes only"),
  description: z.string(),
  private: z.boolean(),
  language: z.enum(repoLanguages, "Select a language"),
});

export type Repo = z.infer<typeof repoSchema>;
export type RepoFormValues = z.input<typeof repoFormSchema>;
export type RepoPayload = z.output<typeof repoFormSchema>;

export const emptyRepoForm: RepoFormValues = {
  name: "",
  description: "",
  private: true,
  language: "python",
};
