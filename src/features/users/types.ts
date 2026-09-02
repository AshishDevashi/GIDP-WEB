import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role_id: z.string(),
  is_active: z.boolean(),
});

export const userListSchema = z.array(userSchema);

export type PortalUser = z.infer<typeof userSchema>;
