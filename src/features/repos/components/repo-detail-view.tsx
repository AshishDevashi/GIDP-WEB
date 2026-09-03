"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteRepoDialog } from "@/features/repos/components/delete-repo-dialog";
import { useRepo } from "@/features/repos/hooks";

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
      <div className="text-sm break-all">{value || "—"}</div>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function RepoDetailView({ id }: { id: string }) {
  const { data: repo, isLoading, isError, error } = useRepo(id);

  if (isLoading) return <Skeleton className="h-72 w-full" />;

  if (isError || !repo) {
    return (
      <Card>
        <CardContent className="text-danger p-5 text-sm">
          {error?.message ?? "Repository not found"}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/repos">
          <ArrowLeft className="h-4 w-4" />
          All repositories
        </Link>
      </Button>

      <PageHeader
        title={repo.name}
        description={repo.description || repo.full_name || undefined}
        actions={
          <>
            <Badge tone={repo.status === "active" ? "success" : "neutral"}>
              {repo.status || "unknown"}
            </Badge>
            {repo.url && (
              <Button asChild variant="outline" size="sm">
                <a href={repo.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open
                </a>
              </Button>
            )}
            <DeleteRepoDialog repo={repo} redirectToList />
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Detail
            label="Full name"
            value={
              <code className="font-mono text-xs">{repo.full_name}</code>
            }
          />
          <Detail label="Owner" value={repo.owner} />
          <Detail
            label="Visibility"
            value={
              repo.visibility && (
                <Badge
                  tone={repo.visibility === "private" ? "warning" : "primary"}
                >
                  {repo.visibility}
                </Badge>
              )
            }
          />
          <Detail label="Default branch" value={repo.default_branch} />
          <Detail label="Template" value={repo.template_used} />
          <Detail label="Language" value={repo.language} />
          <Detail
            label="Clone (HTTPS)"
            value={
              <code className="font-mono text-xs">{repo.clone_url_https}</code>
            }
          />
          <Detail
            label="Clone (SSH)"
            value={
              <code className="font-mono text-xs">{repo.clone_url_ssh}</code>
            }
          />
          <Detail label="External ID" value={repo.external_id} />
          <Detail label="Created" value={formatDate(repo.created_at)} />
          <Detail label="Updated" value={formatDate(repo.updated_at)} />
        </CardContent>
      </Card>
    </>
  );
}
