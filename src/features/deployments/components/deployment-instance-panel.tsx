"use client";

import { Loader2, Plus, RefreshCw, Server, Trash2 } from "lucide-react";
import { useState } from "react";

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
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateDeploymentInstance,
  useDeleteDeploymentInstance,
} from "@/features/deployments/hooks";
import type { DeploymentInstance } from "@/features/deployments/types";

import { DetailItem, statusTone } from "./detail-item";

function CreateInstanceDialog({ disabled }: { disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateDeploymentInstance(() =>
    setOpen(false),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <Plus className="h-4 w-4" />
          Create deployment instance
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create deployment instance?</DialogTitle>
          <DialogDescription>
            This provisions one Kubernetes host for the workspace. Only one
            deployment instance can exist at a time.
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

function DeleteInstanceDialog({ instance }: { instance: DeploymentInstance }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteDeploymentInstance(() =>
    setOpen(false),
  );

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
            This permanently removes the deployment instance and every workload
            running on it. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" disabled={isPending} onClick={() => mutate()}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DeploymentInstancePanel({
  instance,
  isLoading,
  isError,
  errorMessage,
  isFetching,
  onRefresh,
}: {
  instance?: DeploymentInstance;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  isFetching: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Deployment instance</h2>
          <p className="text-muted-foreground text-sm">
            Create or remove the single deployment host for this workspace.
          </p>
        </div>
        <div className="ml-auto">
          <CreateInstanceDialog disabled={isLoading || Boolean(instance)} />
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
        <EmptyState
          icon={Server}
          title="No deployment instance yet."
          description="Create one instance to run workspace deployments."
        />
      )}

      {instance && (
        <Card>
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="space-y-2">
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
                {instance.api_server_url || "Kubernetes host provisioned by GIDP"}
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Refresh deployment instance"
                disabled={isFetching}
                onClick={onRefresh}
              >
                <RefreshCw
                  className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
                />
              </Button>
              <DeleteInstanceDialog instance={instance} />
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DetailItem label="EC2 instance" value={instance.ec2_instance_id} />
              <DetailItem label="Public IP" value={instance.public_ip} />
              <DetailItem label="Private IP" value={instance.private_ip} />
              <DetailItem label="Auth type" value={instance.auth_type} />
              <DetailItem
                label="Max deployments"
                value={instance.max_deployments}
              />
              <DetailItem label="Workspace" value={instance.workspace} />
              <DetailItem label="SSH key" value={instance.ssh_key_name} />
              <DetailItem
                label="Security group"
                value={instance.security_group_id}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="API server" value={instance.api_server_url} />
              <DetailItem label="Credentials" value={instance.credentials_ref} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
