import { z } from "zod";

export const lookupValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export const lookupRowSchema = z.record(z.string(), lookupValueSchema);

/** Every key is a lookup table, so new tables render without code changes. */
export const lookupsSchema = z.record(z.string(), z.array(lookupRowSchema));

export type LookupValue = z.infer<typeof lookupValueSchema>;
export type LookupRow = z.infer<typeof lookupRowSchema>;
export type Lookups = z.infer<typeof lookupsSchema>;

export type LookupTable = {
  key: string;
  title: string;
  columns: string[];
  rows: LookupRow[];
};

export const lifecycleSchema = z.object({
  id: z.number(),
  code: z.string(),
  label: z.string(),
});

export const tierSchema = z.object({
  id: z.number(),
  code: z.string(),
  description: z.string(),
  paging_policy: z.string(),
});

export const lifecycleListSchema = z.array(lifecycleSchema);
export const tierListSchema = z.array(tierSchema);

export type Lifecycle = z.infer<typeof lifecycleSchema>;
export type Tier = z.infer<typeof tierSchema>;

export function titleize(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function toLookupTables(lookups: Lookups): LookupTable[] {
  return Object.entries(lookups).map(([key, rows]) => ({
    key,
    title: titleize(key),
    columns: [...new Set(rows.flatMap((row) => Object.keys(row)))],
    rows,
  }));
}
