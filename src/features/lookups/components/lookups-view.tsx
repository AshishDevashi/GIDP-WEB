"use client";

import { Database, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useLookups } from "@/features/lookups/hooks";
import {
  titleize,
  toLookupTables,
  type LookupValue,
} from "@/features/lookups/types";

const MONO_COLUMNS = new Set([
  "code",
  "slug",
  "template_owner",
  "template_repo",
]);

function CellValue({ column, value }: { column: string; value: LookupValue }) {
  if (value === null || value === "") {
    return <span className="text-muted-foreground">—</span>;
  }

  if (typeof value === "boolean") {
    return <Badge tone={value ? "success" : "neutral"}>{String(value)}</Badge>;
  }

  if (MONO_COLUMNS.has(column)) {
    return <code className="font-mono text-xs">{value}</code>;
  }

  return <>{value}</>;
}

export function LookupsView() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useLookups();

  const tables = useMemo(() => {
    const all = data ? toLookupTables(data) : [];
    const term = search.trim().toLowerCase();
    if (!term) return all;

    return all
      .map((table) => ({
        ...table,
        rows: table.title.toLowerCase().includes(term)
          ? table.rows
          : table.rows.filter((row) =>
              Object.values(row).some((value) =>
                String(value ?? "")
                  .toLowerCase()
                  .includes(term),
              ),
            ),
      }))
      .filter((table) => table.rows.length > 0);
  }, [data, search]);

  return (
    <div className="space-y-5">
      <div className="relative w-full max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search across all lookup tables"
          className="pl-9"
        />
      </div>

      {isLoading &&
        Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-52 w-full" />
        ))}

      {isError && (
        <Card>
          <CardContent className="text-danger p-5 text-sm">
            {error.message}
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && tables.length === 0 && (
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center gap-2 p-10 text-center text-sm">
            <Database className="h-6 w-6" />
            {search ? "Nothing matched your search." : "No lookup data."}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        {tables.map((table) => (
          <Card key={table.key} className="overflow-hidden">
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
              <CardTitle className="flex items-center gap-2">
                <Database className="text-muted-foreground h-4 w-4" />
                {table.title}
              </CardTitle>
              <Badge>{table.rows.length}</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {table.columns.map((column) => (
                      <TableHead key={column}>{titleize(column)}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.rows.map((row, index) => (
                    <TableRow key={String(row.id ?? index)}>
                      {table.columns.map((column) => (
                        <TableCell key={column}>
                          <CellValue
                            column={column}
                            value={row[column] ?? null}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
