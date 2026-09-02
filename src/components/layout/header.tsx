"use client";

import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";

export function Header() {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const { resolvedTheme, setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <header className="border-border bg-card flex h-16 items-center gap-3 border-b px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="hidden h-4 w-4 dark:block" />
          <Moon className="h-4 w-4 dark:hidden" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Sign out"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
        {/* Rendered from a persisted client store, so it differs from the SSR output. */}
        <span
          suppressHydrationWarning
          className="bg-muted flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium"
        >
          {(user?.username ?? "").slice(0, 2).toUpperCase()}
        </span>
      </div>
    </header>
  );
}
