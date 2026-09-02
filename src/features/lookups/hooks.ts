"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchLookups } from "./api";

export const lookupKeys = {
  all: ["lookups"] as const,
};

export function useLookups() {
  return useQuery({
    queryKey: lookupKeys.all,
    queryFn: fetchLookups,
    staleTime: 5 * 60 * 1000,
  });
}
