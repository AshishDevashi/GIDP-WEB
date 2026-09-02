import { z } from "zod";

export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  is_active: z.boolean(),
});

export const teamListSchema = z.array(teamSchema);

export const teamMemberSchema = z.object({
  id: z.string(),
  team_id: z.string(),
  user_id: z.string(),
  role_in_team: z.string(),
  is_primary: z.boolean(),
});

export const teamMemberListSchema = z.array(teamMemberSchema);

export const teamRoles = ["admin", "member", "viewer"] as const;

export const createTeamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
});

export const joinTeamSchema = z.object({
  role_in_team: z.enum(teamRoles),
  is_primary: z.boolean(),
});

export type Team = z.infer<typeof teamSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type JoinTeamInput = z.infer<typeof joinTeamSchema>;
export type AddMemberInput = JoinTeamInput & { user_id: string };

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
