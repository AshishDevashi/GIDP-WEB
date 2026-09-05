import { z } from "zod";

export const dbInstanceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  engine: z.string().nullish(),
  engine_version: z.string().nullish(),
  provider: z.string().nullish(),
  region: z.string().nullish(),
  instance_type: z.string().nullish(),
  storage_gb: z.number().nullish(),
  status: z.string().nullish(),
  container_status: z.string().nullish(),
  workspace: z.string().nullish(),
  ssh_key_name: z.string().nullish(),
  admin_username: z.string().nullish(),
  admin_secret_name: z.string().nullish(),
  postgres_port: z.number().nullish(),
  postgres_image: z.string().nullish(),
  provider_instance_id: z.string().nullish(),
  availability_zone: z.string().nullish(),
  public_ip: z.string().nullish(),
  private_ip: z.string().nullish(),
  security_group_id: z.string().nullish(),
  volume_id: z.string().nullish(),
  created_by: z.string().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const dbInstanceListSchema = z.array(dbInstanceSchema);

export const databaseSchema = z.object({
  id: z.string(),
  db_instance_id: z.string(),
  name: z.string(),
  username: z.string(),
  allocated_mb: z.number(),
  status: z.string().nullish(),
  connection_string: z.string().nullish(),
  created_by: z.string().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const databaseListSchema = z.array(databaseSchema);

export const databaseQuotaSchema = z.object({
  total_capacity_mb: z.number(),
  allocated_mb: z.number(),
  available_mb: z.number(),
});

export const databaseFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-z0-9_]+$/, "Use letters, numbers and underscores only"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  size_mb: z.coerce
    .number<number>()
    .int("Size must be a whole number")
    .min(1, "Size must be at least 1 MB"),
});

export type DbInstance = z.infer<typeof dbInstanceSchema>;
export type DatabaseRecord = z.infer<typeof databaseSchema>;
export type DatabaseQuota = z.infer<typeof databaseQuotaSchema>;
export type DatabaseFormValues = z.input<typeof databaseFormSchema>;
export type DatabaseFormPayload = z.output<typeof databaseFormSchema>;
export type CreateDatabasePayload = DatabaseFormPayload & {
  db_instance_id: string;
};

export const emptyDatabaseForm: DatabaseFormValues = {
  name: "",
  username: "",
  password: "",
  size_mb: 200,
};