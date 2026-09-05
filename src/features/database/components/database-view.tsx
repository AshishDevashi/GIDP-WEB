"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Copy,
  Database,
  HardDrive,
  Loader2,
  Plus,
  RefreshCw,
  Server,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCreateDatabase,
  useCreateDbInstance,
  useDatabaseQuota,
  useDatabases,
  useDeleteDatabase,
  useDbInstances,
  useDeleteDbInstance,
} from "@/features/database/hooks";
import {
  databaseFormSchema,
  emptyDatabaseForm,
  type DatabaseFormPayload,
  type DatabaseFormValues,
  type DatabaseRecord,
  type DbInstance,
} from "@/features/database/types";

function valueOrDash(value: string | number | null | undefined) {
  return value ?? "—";
}

function statusTone(status: string | null | undefined) {
  if (status === "running" || status === "available" || status === "active") {
    return "success";
  }

  if (status === "failed" || status === "error" || status === "stopped") {
    return "danger";
  }

  if (status === "creating" || status === "pending") {
    return "warning";
  }

  return "neutral";
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="space-y-1 rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="break-words text-sm font-medium">{valueOrDash(value)}</p>
    </div>
  );
}

function CreateDbInstanceDialog({ disabled }: { disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateDbInstance(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <Plus className="h-4 w-4" />
          Create DB instance
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create DB instance?</DialogTitle>
          <DialogDescription>
            This provisions one PostgreSQL host for the workspace. Only one DB
            instance can exist at a time.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={isPending} onClick={() => mutate()}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDbInstanceDialog({ instance }: { instance: DbInstance }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteDbInstance(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="danger">
          <Trash2 className="h-4 w-4" />
          Delete instance
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {instance.name}?</DialogTitle>
          <DialogDescription>
            This permanently removes the DB instance and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={isPending}
            onClick={() => mutate(instance.id)}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DbInstancePanel({
  instance,
  isLoading,
  isError,
  errorMessage,
  isFetching,
  onRefresh,
}: {
  instance?: DbInstance;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  isFetching: boolean;
  onRefresh: () => void;
}) {
  const hasInstance = Boolean(instance);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">DB instance</h2>
          <p className="text-muted-foreground text-sm">
            Create or remove the single PostgreSQL instance for this workspace.
          </p>
        </div>
        <div className="ml-auto">
          <CreateDbInstanceDialog disabled={isLoading || hasInstance} />
        </div>
      </div>

      {isLoading && <Skeleton className="h-72 w-full" />}

      {isError && (
        <Card>
          <CardContent className="text-danger p-5 text-sm">
            {errorMessage}
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && !instance && (
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center gap-3 p-10 text-center text-sm">
            <Server className="h-7 w-7" />
            <div className="space-y-1">
              <p className="text-foreground font-medium">No DB instance yet.</p>
              <p>Create one instance to host workspace databases.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {instance && (
        <Card>
          <CardHeader className="flex flex-row items-start  gap-4 space-y-0">
            <div className="space-y-2 ">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="flex items-center gap-2">
                  <Server className="text-muted-foreground h-4 w-4" />
                  {instance.name}
                </CardTitle>
                <Badge tone={statusTone(instance.status)}>
                  {instance.status || "unknown"}
                </Badge>
              </div>
              <CardDescription>
                {instance.description || "PostgreSQL host provisioned by GIDP"}
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Refresh DB instance"
                disabled={isFetching}
                onClick={onRefresh}
              >
                <RefreshCw
                  className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
                />
              </Button>
              <DeleteDbInstanceDialog instance={instance} />
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DetailItem label="Engine" value={instance.engine} />
              <DetailItem label="Version" value={instance.engine_version} />
              <DetailItem label="Provider" value={instance.provider} />
              <DetailItem label="Region" value={instance.region} />
              <DetailItem label="Instance type" value={instance.instance_type} />
              <DetailItem
                label="Storage"
                value={instance.storage_gb ? `${instance.storage_gb} GB` : null}
              />
              <DetailItem label="Container" value={instance.container_status} />
              <DetailItem label="Postgres port" value={instance.postgres_port} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <DetailItem label="Public IP" value={instance.public_ip} />
              <DetailItem label="Private IP" value={instance.private_ip} />
              <DetailItem
                label="Availability zone"
                value={instance.availability_zone}
              />
              <DetailItem label="Workspace" value={instance.workspace} />
              <DetailItem
                label="Security group"
                value={instance.security_group_id}
              />
              <DetailItem label="Volume" value={instance.volume_id} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CreateDatabaseDialog({ instanceId }: { instanceId: string }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DatabaseFormValues, unknown, DatabaseFormPayload>({
    resolver: zodResolver(databaseFormSchema),
    defaultValues: emptyDatabaseForm,
  });
  const { mutate, isPending } = useCreateDatabase(() => {
    reset(emptyDatabaseForm);
    setOpen(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset(emptyDatabaseForm);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Create database
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create database</DialogTitle>
          <DialogDescription>
            Allocate a PostgreSQL database on the active DB instance.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) =>
            mutate({ ...values, db_instance_id: instanceId }),
          )}
          className="space-y-4"
          noValidate
        >
          <Field id="database-name" label="Database name" error={errors.name?.message}>
            <Input
              id="database-name"
              placeholder="esales"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>

          <Field id="database-username" label="Username" error={errors.username?.message}>
            <Input
              id="database-username"
              placeholder="postgres1"
              aria-invalid={Boolean(errors.username)}
              {...register("username")}
            />
          </Field>

          <Field id="database-password" label="Password" error={errors.password?.message}>
            <PasswordInput
              id="database-password"
              placeholder="Enter password"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
          </Field>

          <Field id="database-size" label="Size MB" error={errors.size_mb?.message}>
            <Input
              id="database-size"
              type="number"
              min={1}
              step={1}
              aria-invalid={Boolean(errors.size_mb)}
              {...register("size_mb")}
            />
          </Field>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Create database
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDatabaseDialog({ database }: { database: DatabaseRecord }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteDatabase(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Delete ${database.name}`}>
          <Trash2 className="text-danger h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {database.name}?</DialogTitle>
          <DialogDescription>
            This permanently removes the database and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={isPending}
            onClick={() => mutate(database.id)}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DatabasesPanel({ instance }: { instance?: DbInstance }) {
  const enabled = Boolean(instance);
  const {
    data: databases = [],
    isLoading: databasesLoading,
    isError: databasesError,
    error: databasesErrorValue,
    isFetching: databasesFetching,
    refetch: refetchDatabases,
  } = useDatabases(enabled);
  const {
    data: quota,
    isLoading: quotaLoading,
    isError: quotaError,
    error: quotaErrorValue,
  } = useDatabaseQuota(enabled);

  if (!instance) {
    return (
      <Card>
        <CardContent className="text-muted-foreground flex flex-col items-center gap-3 p-10 text-center text-sm">
          <Server className="h-7 w-7" />
          <div className="space-y-1">
            <p className="text-foreground font-medium">Create a DB instance first.</p>
            <p>Databases are available only after a DB instance exists.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Databases</h2>
          <p className="text-muted-foreground text-sm">
            Create and manage PostgreSQL databases on {instance.name}.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Refresh databases"
            disabled={databasesFetching}
            onClick={() => void refetchDatabases()}
          >
            <RefreshCw
              className={databasesFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            />
          </Button>
          <CreateDatabaseDialog instanceId={instance.id} />
        </div>
      </div>

      {quotaLoading && <Skeleton className="h-24 w-full" />}

      {quotaError && (
        <Card>
          <CardContent className="text-danger p-5 text-sm">
            {quotaErrorValue.message}
          </CardContent>
        </Card>
      )}

      {quota && (
        <div className="grid gap-3 sm:grid-cols-3">
          <DetailItem label="Total capacity" value={`${quota.total_capacity_mb} MB`} />
          <DetailItem label="Allocated" value={`${quota.allocated_mb} MB`} />
          <DetailItem label="Available" value={`${quota.available_mb} MB`} />
        </div>
      )}

      {databasesLoading && <Skeleton className="h-64 w-full" />}

      {databasesError && (
        <Card>
          <CardContent className="text-danger p-5 text-sm">
            {databasesErrorValue.message}
          </CardContent>
        </Card>
      )}

      {!databasesLoading && !databasesError && databases.length === 0 && (
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center gap-3 p-10 text-center text-sm">
            <HardDrive className="h-7 w-7" />
            <div className="space-y-1">
              <p className="text-foreground font-medium">No databases yet.</p>
              <p>Create a database to allocate storage on this DB instance.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {databases.length > 0 && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Allocated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Connection string</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {databases.map((database) => (
                <TableRow key={database.id}>
                  <TableCell className="font-medium">{database.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {database.username}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {database.allocated_mb} MB
                  </TableCell>
                  <TableCell>
                    <Badge tone={statusTone(database.status)}>
                      {database.status || "unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex max-w-md items-center gap-2">
                      <code className="text-muted-foreground truncate font-mono text-xs">
                        {database.connection_string || "—"}
                      </code>
                      {database.connection_string && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Copy ${database.name} connection string`}
                          onClick={() =>
                            void navigator.clipboard.writeText(
                              database.connection_string ?? "",
                            )
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DeleteDatabaseDialog database={database} />
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

export function DatabaseView() {
  const {
    data: instances = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useDbInstances();
  const instance = instances[0];

  return (
    <Tabs defaultValue="db-instance" className="space-y-5">
      <TabsList className="max-w-md">
        <TabsTrigger value="db-instance" className="gap-2">
          <Server className="h-4 w-4" />
          DB instance
        </TabsTrigger>
        <TabsTrigger value="databases" className="gap-2" disabled={!instance}>
          <Database className="h-4 w-4" />
          Databases
        </TabsTrigger>
      </TabsList>

      <TabsContent value="db-instance">
        <DbInstancePanel
          instance={instance}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
          isFetching={isFetching}
          onRefresh={() => void refetch()}
        />
      </TabsContent>
      <TabsContent value="databases">
        <DatabasesPanel instance={instance} />
      </TabsContent>
    </Tabs>
  );
}