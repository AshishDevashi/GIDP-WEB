"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, RefreshCw, Rocket, Server, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateDeployment,
  useDeleteDeployment,
  useDeployments,
} from "@/features/deployments/hooks";
import {
  emptyDeploymentForm,
  type Deployment,
  type DeploymentFormValues,
  type DeploymentInstance,
  type DeploymentPayload,
} from "@/features/deployments/types";
import { deploymentFormSchema } from "@/features/deployments/types";
import { useRegistries } from "@/features/registries/hooks";
import { useRepos } from "@/features/repos/hooks";

import { DetailItem, statusTone } from "./detail-item";

function CreateDeploymentDialog({ disabled }: { disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const { data: repos = [], isLoading: reposLoading } = useRepos();
  const { data: registries = [], isLoading: registriesLoading } =
    useRegistries();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeploymentFormValues, unknown, DeploymentPayload>({
    resolver: zodResolver(deploymentFormSchema),
    defaultValues: emptyDeploymentForm,
  });
  const { mutate, isPending } = useCreateDeployment(() => {
    reset(emptyDeploymentForm);
    setOpen(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset(emptyDeploymentForm);
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <Plus className="h-4 w-4" />
          Create deployment
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create deployment</DialogTitle>
          <DialogDescription>
            Deploy a container image from a registry onto the active deployment
            instance.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => mutate(values))}
          className="space-y-4"
          noValidate
        >
          <Field
            id="deployment-repo"
            label="Repository"
            error={errors.repo_id?.message}
          >
            <Select
              id="deployment-repo"
              disabled={reposLoading}
              aria-invalid={Boolean(errors.repo_id)}
              {...register("repo_id")}
            >
              <option value="">
                {reposLoading ? "Loading repositories…" : "Select a repository"}
              </option>
              {repos.map((repo) => (
                <option key={repo.id} value={repo.id}>
                  {repo.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            id="deployment-registry"
            label="Registry"
            error={errors.registry_id?.message}
          >
            <Select
              id="deployment-registry"
              disabled={registriesLoading}
              aria-invalid={Boolean(errors.registry_id)}
              {...register("registry_id")}
            >
              <option value="">
                {registriesLoading ? "Loading registries…" : "Select a registry"}
              </option>
              {registries.map((registry) => (
                <option key={registry.id} value={registry.id}>
                  {registry.name}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="deployment-image-name"
              label="Image name"
              error={errors.image_name?.message}
            >
              <Input
                id="deployment-image-name"
                placeholder="dpimage"
                aria-invalid={Boolean(errors.image_name)}
                {...register("image_name")}
              />
            </Field>

            <Field
              id="deployment-image-tag"
              label="Image tag"
              error={errors.image_tag?.message}
            >
              <Input
                id="deployment-image-tag"
                placeholder="v1.0.0"
                aria-invalid={Boolean(errors.image_tag)}
                {...register("image_tag")}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="deployment-name"
              label="Deployment name"
              error={errors.name?.message}
            >
              <Input
                id="deployment-name"
                placeholder="dpimage"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
            </Field>

            <Field
              id="deployment-namespace"
              label="Namespace"
              error={errors.namespace?.message}
            >
              <Input
                id="deployment-namespace"
                placeholder="ns-dpimage"
                aria-invalid={Boolean(errors.namespace)}
                {...register("namespace")}
              />
            </Field>
          </div>

          <Field
            id="deployment-replicas"
            label="Replicas"
            error={errors.replicas?.message}
          >
            <Input
              id="deployment-replicas"
              type="number"
              min={1}
              step={1}
              aria-invalid={Boolean(errors.replicas)}
              {...register("replicas")}
            />
          </Field>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Create deployment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDeploymentDialog({ deployment }: { deployment: Deployment }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteDeployment(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${deployment.name}`}
        >
          <Trash2 className="text-danger h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {deployment.name}?</DialogTitle>
          <DialogDescription>
            This permanently removes the deployment and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={isPending}
            onClick={() => mutate(deployment.id)}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeploymentDetailsDialog({ deployment }: { deployment: Deployment }) {
  const { expose, resources } = deployment;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Details
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{deployment.name}</DialogTitle>
          <DialogDescription>
            {deployment.image_ref || "Deployment details"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailItem label="Namespace" value={deployment.namespace} />
          <DetailItem label="Replicas" value={deployment.replicas} />
          <DetailItem label="Status" value={deployment.status} />
          <DetailItem label="Revision" value={deployment.current_revision} />
          <DetailItem
            label="K8s deployment"
            value={deployment.k8s_deployment_name}
          />
          <DetailItem
            label="Image"
            value={
              deployment.image_name && deployment.image_tag
                ? `${deployment.image_name}:${deployment.image_tag}`
                : deployment.image_name
            }
          />
          <DetailItem label="CPU" value={resources?.cpu} />
          <DetailItem label="Memory" value={resources?.memory} />
          <DetailItem label="Service type" value={expose?.type} />
          <DetailItem label="Port" value={expose?.port} />
          <DetailItem label="Target port" value={expose?.target_port} />
          <DetailItem label="Path" value={expose?.path} />
          <DetailItem label="Host" value={expose?.host || null} />
          <DetailItem label="Created" value={deployment.created_at} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DeploymentsPanel({
  instance,
}: {
  instance?: DeploymentInstance;
}) {
  const {
    data: deployments = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useDeployments(Boolean(instance));

  if (!instance) {
    return (
      <EmptyState
        icon={Server}
        title="Create a deployment instance first."
        description="Deployments are available only after a deployment instance exists."
      />
    );
  }

  const maxDeployments = instance.max_deployments ?? undefined;
  const limitReached =
    maxDeployments !== undefined && deployments.length >= maxDeployments;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Deployments</h2>
          <p className="text-muted-foreground text-sm">
            Workloads running on {instance.name}
            {maxDeployments !== undefined &&
              ` · ${deployments.length}/${maxDeployments} used`}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Refresh deployments"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            <RefreshCw
              className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            />
          </Button>
          <CreateDeploymentDialog disabled={limitReached} />
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

      {!isLoading && !isError && deployments.length === 0 && (
        <EmptyState
          icon={Rocket}
          title="No deployments yet."
          description="Create a deployment to run a container image on this instance."
        />
      )}

      {deployments.length > 0 && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Namespace</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Replicas</TableHead>
                <TableHead>Revision</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployments.map((deployment) => (
                <TableRow key={deployment.id}>
                  <TableCell className="font-medium">
                    {deployment.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {deployment.namespace || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate font-mono text-xs">
                    {deployment.image_ref ||
                      `${deployment.image_name}:${deployment.image_tag}`}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {deployment.replicas ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {deployment.current_revision ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge tone={statusTone(deployment.status)}>
                      {deployment.status || "unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <DeploymentDetailsDialog deployment={deployment} />
                      <DeleteDeploymentDialog deployment={deployment} />
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
