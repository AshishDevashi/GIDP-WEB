import {
  Database,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const siteConfig = {
  name: "GIDP",
  description: "Internal Developer Portal",
};

export const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Teams", href: "/teams", icon: Users },
  { title: "Lookups", href: "/lookups", icon: Database },
];
