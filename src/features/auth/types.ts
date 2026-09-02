import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = loginSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role_id: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
