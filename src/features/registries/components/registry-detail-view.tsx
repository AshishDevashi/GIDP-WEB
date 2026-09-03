"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteRegistryDialog } from "@/features/registries/components/delete-registry-dialog";
import { useRegistry } from "@/features/registries/hooks";

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

export function RegistryDetailView({ id }: { id: string }) {
  const { data: registry, isLoading, isError, error } = useRegistry(id);

  if (isLoading) return <Skeleton className="h-72 w-full" />;

  if (isError || !registry) {
    return (
      <Card>
        <CardContent className="text-danger p-5 text-sm">
          {error?.message ?? "Registry not found"}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/registries">
          <ArrowLeft className="h-4 w-4" />
          All registries
        </Link>
      </Button>

      <PageHeader
        title={registry.name}
        description={registry.description || registry.full_name || undefined}
        actions={
          <>
            <Badge tone={registry.status === "active" ? "success" : "neutral"}>
              {registry.status || "unknown"}
            </Badge>
            {registry.url && (
              <Button asChild variant="outline" size="sm">
                <a href={registry.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open
                </a>
              </Button>
            )}
            <DeleteRegistryDialog registry={registry} redirectToList />
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
            value={<code className="font-mono text-xs">{registry.full_name}</code>}
          />
          <Detail label="Namespace" value={registry.namespace} />
          <Detail
            label="Visibility"
            value={
              registry.visibility && (
                <Badge
                  tone={
                    registry.visibility === "private" ? "warning" : "primary"
                  }
                >
                  {registry.visibility}
                </Badge>
              )
            }
          />
          <Detail
            label="Registry URL"
            value={
              <code className="font-mono text-xs">{registry.registry_url}</code>
            }
          />
          <Detail
            label="Pull command"
            value={
              <code className="font-mono text-xs">{registry.pull_command}</code>
            }
          />
          <Detail label="Created" value={formatDate(registry.created_at)} />
          <Detail label="Updated" value={formatDate(registry.updated_at)} />
        </CardContent>
      </Card>
    </>
  );
}
