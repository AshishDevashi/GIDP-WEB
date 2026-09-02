"use client";

import { FolderGit2, Pencil, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLifecycles, useTiers } from "@/features/lookups/hooks";
import { DeleteProjectDialog } from "@/features/projects/components/delete-project-dialog";
import { ProjectFormDialog } from "@/features/projects/components/project-form-dialog";
import { useProjects } from "@/features/projects/hooks";
import type { Project } from "@/features/projects/types";
import { useTeams } from "@/features/teams/hooks";

function byId<T extends { id: string | number }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

export function ProjectsView() {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const { data: projects = [], isLoading, isError, error } = useProjects();
  const { data: teams = [] } = useTeams();
  const { data: lifecycles = [] } = useLifecycles();
  const { data: tiers = [] } = useTiers();

  const teamsById = useMemo(() => byId(teams), [teams]);
  const lifecyclesById = useMemo(() => byId(lifecycles), [lifecycles]);
  const tiersById = useMemo(() => byId(tiers), [tiers]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((project) =>
      [project.name, project.slug, project.description, project.project_type]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [projects, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects"
            className="pl-9"
          />
        </div>
        <div className="ml-auto">
          <ProjectFormDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            projects={projects}
            trigger={
              <Button>
                <Plus className="h-4 w-4" />
                New project
              </Button>
            }
          />
        </div>
      </div>

      {isLoading && <Skeleton className="h-64 w-full" />}

      {isError && (
        <Card>
          <CardContent className="text-danger p-5 text-sm">
            {error.message}
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center gap-2 p-10 text-center text-sm">
            <FolderGit2 className="h-6 w-6" />
            {search ? "No projects matched your search." : "No projects yet."}
          </CardContent>
        </Card>
      )}

      {filtered.length > 0 && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Owner team</TableHead>
                <TableHead>Lifecycle</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link
                      href={`/projects/${project.id}`}
                      className="hover:text-primary font-medium transition-colors"
                    >
                      {project.name}
                    </Link>
                    <p className="text-muted-foreground font-mono text-xs">
                      {project.slug}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.project_type || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {(project.owner_team_id &&
                      teamsById.get(project.owner_team_id)?.name) ||
                      "—"}
                  </TableCell>
                  <TableCell>
                    {project.lifecycle_id ? (
                      <Badge tone="primary">
                        {lifecyclesById.get(project.lifecycle_id)?.label ??
                          project.lifecycle_id}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {project.tier_id ? (
                      <Badge>
                        {tiersById.get(project.tier_id)?.code ??
                          project.tier_id}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge tone={project.is_active ? "success" : "neutral"}>
                      {project.is_active ? "active" : "inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <ProjectFormDialog
                        open={editing?.id === project.id}
                        onOpenChange={(open) =>
                          setEditing(open ? project : null)
                        }
                        project={project}
                        projects={projects}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${project.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DeleteProjectDialog project={project} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
