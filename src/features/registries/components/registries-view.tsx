"use client";

import { Container, ExternalLink, Search } from "lucide-react";
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
import { CreateRegistryDialog } from "@/features/registries/components/create-registry-dialog";
import { DeleteRegistryDialog } from "@/features/registries/components/delete-registry-dialog";
import { useRegistries } from "@/features/registries/hooks";

export function RegistriesView() {
  const [search, setSearch] = useState("");
  const { data: registries = [], isLoading, isError, error } = useRegistries();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return registries;
    return registries.filter((registry) =>
      [
        registry.name,
        registry.full_name,
        registry.namespace,
        registry.description,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [registries, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search registries"
            className="pl-9"
          />
        </div>
        <div className="ml-auto">
          <CreateRegistryDialog />
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
            <Container className="h-6 w-6" />
            {search
              ? "No registries matched your search."
              : "No registries yet."}
          </CardContent>
        </Card>
      )}

      {filtered.length > 0 && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registry</TableHead>
                <TableHead>Namespace</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((registry) => (
                <TableRow key={registry.id}>
                  <TableCell>
                    <Link
                      href={`/registries/${registry.id}`}
                      className="hover:text-primary font-medium transition-colors"
                    >
                      {registry.name}
                    </Link>
                    <p className="text-muted-foreground font-mono text-xs">
                      {registry.full_name ?? "—"}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {registry.namespace || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {registry.registry_url || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        registry.visibility === "private" ? "warning" : "primary"
                      }
                    >
                      {registry.visibility || "unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={registry.status === "active" ? "success" : "neutral"}
                    >
                      {registry.status || "unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {registry.url && (
                        <a
                          href={registry.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${registry.name} on provider`}
                          className="text-muted-foreground hover:text-primary inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <DeleteRegistryDialog registry={registry} />
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
