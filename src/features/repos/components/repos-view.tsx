"use client";

import { ExternalLink, GitBranch, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { CreateRepoDialog } from "@/features/repos/components/create-repo-dialog";
import { DeleteRepoDialog } from "@/features/repos/components/delete-repo-dialog";
import { useRepos } from "@/features/repos/hooks";

export function ReposView() {
  const [search, setSearch] = useState("");
  const { data: repos = [], isLoading, isError, error } = useRepos();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return repos;
    return repos.filter((repo) =>
      [repo.name, repo.full_name, repo.owner, repo.template_used]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [repos, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search repositories"
            className="pl-9"
          />
        </div>
        <div className="ml-auto">
          <CreateRepoDialog />
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
            <GitBranch className="h-6 w-6" />
            {search
              ? "No repositories matched your search."
              : "No repositories yet."}
          </CardContent>
        </Card>
      )}

      {filtered.length > 0 && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repository</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((repo) => (
                <TableRow key={repo.id}>
                  <TableCell>
                    <Link
                      href={`/repos/${repo.id}`}
                      className="hover:text-primary font-medium transition-colors"
                    >
                      {repo.name}
                    </Link>
                    <p className="text-muted-foreground font-mono text-xs">
                      {repo.full_name ?? "—"}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {repo.owner || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {repo.template_used || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {repo.default_branch || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={repo.visibility === "private" ? "warning" : "primary"}
                    >
                      {repo.visibility || "unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge tone={repo.status === "active" ? "success" : "neutral"}>
                      {repo.status || "unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {repo.url && (
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${repo.name} on provider`}
                          className="text-muted-foreground hover:text-primary inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <DeleteRepoDialog repo={repo} />
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
