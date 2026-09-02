import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().min(1).default("http://localhost:8080"),
  NEXT_PUBLIC_API_VERSION: z.string().min(1).default("v1"),
  NEXT_PUBLIC_APP_NAME: z.string().default("GIDP"),
});

const parsed = clientSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

export const env = {
  ...parsed,
  /** e.g. http://localhost:8080/api/v1 */
  API_BASE_URL: `${parsed.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api/${parsed.NEXT_PUBLIC_API_VERSION}`,
};
