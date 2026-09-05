import { z } from "zod";

export const deploymentInstanceSchema = z.object({
  id: z.string(),
  name: z.string(),
  ec2_instance_id: z.string().nullish(),
  public_ip: z.string().nullish(),
  private_ip: z.string().nullish(),
  api_server_url: z.string().nullish(),
  auth_type: z.string().nullish(),
  credentials_ref: z.string().nullish(),
  max_deployments: z.number().nullish(),
  status: z.string().nullish(),
  workspace: z.string().nullish(),
  ssh_key_name: z.string().nullish(),
  security_group_id: z.string().nullish(),
  created_by: z.string().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

/** GET /deployment-instances may return a single object, a list, or nothing. */
export const deploymentInstanceResponseSchema = z
  .union([
    deploymentInstanceSchema,
    z.array(deploymentInstanceSchema),
    z.null(),
    z.literal(""),
  ])
  .transform((value) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : value;
  });

export const deploymentSchema = z.object({
  id: z.string(),
  deployment_instance_id: z.string().nullish(),
  repo_id: z.string().nullish(),
  registry_id: z.string().nullish(),
  image_name: z.string().nullish(),
  image_tag: z.string().nullish(),
  image_ref: z.string().nullish(),
  name: z.string(),
  namespace: z.string().nullish(),
  replicas: z.number().nullish(),
  resources: z.record(z.string(), z.string()).nullish(),
  env_vars: z.record(z.string(), z.string()).nullish(),
  secret_refs: z.record(z.string(), z.string()).nullish(),
  expose: z
    .object({
      host: z.string().nullish(),
      path: z.string().nullish(),
      port: z.number().nullish(),
      type: z.string().nullish(),
      target_port: z.number().nullish(),
    })
    .nullish(),
  status: z.string().nullish(),
  current_revision: z.number().nullish(),
  k8s_deployment_name: z.string().nullish(),
  created_by: z.string().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const deploymentListSchema = z
  .union([z.array(deploymentSchema), z.null(), z.literal("")])
  .transform((value) => value || []);

export const deploymentFormSchema = z.object({
  repo_id: z.string().min(1, "Select a repository"),
  registry_id: z.string().min(1, "Select a registry"),
  image_name: z.string().min(1, "Image name is required"),
  image_tag: z.string().min(1, "Image tag is required"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only"),
  namespace: z
    .string()
    .min(2, "Namespace must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only"),
  replicas: z.coerce
    .number<number>()
    .int("Replicas must be a whole number")
    .min(1, "At least 1 replica is required"),
});

export type DeploymentInstance = z.infer<typeof deploymentInstanceSchema>;
export type Deployment = z.infer<typeof deploymentSchema>;
export type DeploymentFormValues = z.input<typeof deploymentFormSchema>;
export type DeploymentPayload = z.output<typeof deploymentFormSchema>;

export const emptyDeploymentForm: DeploymentFormValues = {
  repo_id: "",
  registry_id: "",
  image_name: "",
  image_tag: "",
  name: "",
  namespace: "",
  replicas: 1,
};
