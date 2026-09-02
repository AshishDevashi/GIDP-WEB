import type { LucideIcon } from "lucide-react";
import { GitBranch, Rocket, Server, Workflow } from "lucide-react";

export type ProjectComponentTab = {
  value: string;
  label: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
};

export const projectComponentTabs: ProjectComponentTab[] = [
  {
    value: "repositories",
    label: "Repositories",
    icon: GitBranch,
    emptyTitle: "No repositories linked",
    emptyDescription:
      "Repositories created from templates or imported for this project will appear here.",
  },
  {
    value: "cicd",
    label: "CI/CD",
    icon: Workflow,
    emptyTitle: "No pipelines connected",
    emptyDescription:
      "Build and release pipelines for this project will appear here.",
  },
  {
    value: "deployments",
    label: "Deployments",
    icon: Rocket,
    emptyTitle: "No deployments yet",
    emptyDescription:
      "Environment rollouts and their status will appear here once deployments run.",
  },
  {
    value: "services",
    label: "Services",
    icon: Server,
    emptyTitle: "No services registered",
    emptyDescription:
      "Services owned by this project will appear here once they are registered.",
  },
];
