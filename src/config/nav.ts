import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const siteConfig = {
  name: "GIDP",
  description: "Internal Developer Portal",
};

export const mainNav: NavItem[] = [];
