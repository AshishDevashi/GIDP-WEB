import {
  Container,
  Database,
  GitBranch,
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
  { title: "Repos", href: "/repos", icon: GitBranch },
  { title: "Registries", href: "/registries", icon: Container },
  { title: "Database", href: "/database", icon: Database },
  { title: "Teams", href: "/teams", icon: Users },
  { title: "Lookups", href: "/lookups", icon: Database },
];
