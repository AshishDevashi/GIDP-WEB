import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/features/auth/types";

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: "gidp-auth" },
  ),
);
