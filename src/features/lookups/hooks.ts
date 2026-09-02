"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchLifecycles, fetchLookups, fetchTiers } from "./api";

const STALE_TIME = 5 * 60 * 1000;

export const lookupKeys = {
  all: ["lookups"] as const,
  lifecycles: () => [...lookupKeys.all, "lifecycles"] as const,
  tiers: () => [...lookupKeys.all, "tiers"] as const,
};

export function useLookups() {
  return useQuery({
    queryKey: lookupKeys.all,
    queryFn: fetchLookups,
    staleTime: STALE_TIME,
  });
}

export function useLifecycles() {
  return useQuery({
    queryKey: lookupKeys.lifecycles(),
    queryFn: fetchLifecycles,
    staleTime: STALE_TIME,
  });
}

export function useTiers() {
  return useQuery({
    queryKey: lookupKeys.tiers(),
    queryFn: fetchTiers,
    staleTime: STALE_TIME,
  });
}
