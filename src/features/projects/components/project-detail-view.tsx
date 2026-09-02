"use client";

import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLifecycles, useTiers } from "@/features/lookups/hooks";
import { DeleteProjectDialog } from "@/features/projects/components/delete-project-dialog";
import { projectComponentTabs } from "@/features/projects/components/project-component-tabs";
import { ProjectFormDialog } from "@/features/projects/components/project-form-dialog";
import { useProject, useProjects } from "@/features/projects/hooks";
import { useTeams } from "@/features/teams/hooks";
import { useUsers } from "@/features/users/hooks";

function Detail({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode | null | undefined;
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs tracking-wide uppercase">
        {label}
      </p>
      <div className="text-sm">{value || "—"}</div>
    </div>
  );
}

function LinkValue({ href }: { href?: string | null }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary inline-flex items-center gap-1 hover:underline"
    >
      Open
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export function ProjectDetailView({ id }: { id: string }) {
  const [editOpen, setEditOpen] = useState(false);
  const { data: project, isLoading, isError, error } = useProject(id);
  const { data: projects = [] } = useProjects();
  const { data: teams = [] } = useTeams();
  const { data: users = [] } = useUsers();
  const { data: lifecycles = [] } = useLifecycles();
  const { data: tiers = [] } = useTiers();

  if (isLoading) return <Skeleton className="h-72 w-full" />;

  if (isError || !project) {
    return (
      <Card>
        <CardContent className="text-danger p-5 text-sm">
          {error?.message ?? "Project not found"}
        </CardContent>
      </Card>
    );
  }

  const team = teams.find((item) => item.id === project.owner_team_id);
  const techLead = users.find((item) => item.id === project.tech_lead_id);
  const lifecycle = lifecycles.find((item) => item.id === project.lifecycle_id);
  const tier = tiers.find((item) => item.id === project.tier_id);
  const parent = projects.find((item) => item.id === project.parent_project_id);

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/projects">
          <ArrowLeft className="h-4 w-4" />
          All projects
        </Link>
      </Button>

      <PageHeader
        title={project.name}
        description={project.description || `/${project.slug}`}
        actions={
          <>
            <Badge tone={project.is_active ? "success" : "neutral"}>
              {project.is_active ? "active" : "inactive"}
            </Badge>
            <ProjectFormDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              project={project}
              projects={projects}
              trigger={
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              }
            />
            <DeleteProjectDialog project={project} />
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Detail
            label="Slug"
            value={<code className="font-mono text-xs">{project.slug}</code>}
          />
          <Detail label="Type" value={project.project_type} />
          <Detail label="Architecture" value={project.architecture} />
          <Detail label="Owner team" value={team?.name} />
          <Detail label="Tech lead" value={techLead?.username} />
          <Detail
            label="Lifecycle"
            value={lifecycle && <Badge tone="primary">{lifecycle.label}</Badge>}
          />
          <Detail
            label="Tier"
            value={
              tier && <Badge>{`${tier.code} — ${tier.description}`}</Badge>
            }
          />
          <Detail label="Parent project" value={parent?.name} />
          <Detail label="Docs" value={<LinkValue href={project.docs_url} />} />
          <Detail
            label="Dashboard"
            value={<LinkValue href={project.dashboard_url} />}
          />
          <Detail
            label="Runbook"
            value={<LinkValue href={project.runbook_url} />}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue={projectComponentTabs[0].value} className="space-y-4">
        <TabsList className="grid-cols-4">
          {projectComponentTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <span className="flex items-center justify-center gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {projectComponentTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <EmptyState
              icon={tab.icon}
              title={tab.emptyTitle}
              description={tab.emptyDescription}
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
