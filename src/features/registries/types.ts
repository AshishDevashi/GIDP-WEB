import { z } from "zod";

export const registrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  provider_id: z.number().nullish(),
  namespace: z.string().nullish(),
  full_name: z.string().nullish(),
  registry_url: z.string().nullish(),
  visibility: z.string().nullish(),
  status: z.string().nullish(),
  url: z.string().nullish(),
  pull_command: z.string().nullish(),
  created_by: z.string().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const registryListSchema = z.array(registrySchema);

export const registryFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-z0-9._-]+$/, "Use letters, numbers, dots, dashes only"),
  description: z.string(),
  private: z.boolean(),
});

export type Registry = z.infer<typeof registrySchema>;
export type RegistryFormValues = z.input<typeof registryFormSchema>;
export type RegistryPayload = z.output<typeof registryFormSchema>;

export const emptyRegistryForm: RegistryFormValues = {
  name: "",
  description: "",
  private: true,
};
