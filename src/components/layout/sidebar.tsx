"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mainNav, siteConfig } from "@/config/nav";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);

  return (
    <aside
      className={cn(
        "border-border bg-card hidden shrink-0 border-r md:flex md:flex-col",
        sidebarOpen ? "md:w-64" : "md:w-20",
      )}
    >
      <div className="border-border flex h-16 items-center gap-2 border-b px-5">
        <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
          G
        </span>
        {sidebarOpen && (
          <div className="leading-tight">
            <p className="text-sm font-semibold">{siteConfig.name}</p>
            <p className="text-muted-foreground text-xs">
              {siteConfig.description}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {mainNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
