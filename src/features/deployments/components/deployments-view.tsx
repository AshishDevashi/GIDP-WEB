"use client";

import { Rocket, Server } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeploymentInstance } from "@/features/deployments/hooks";

import { DeploymentInstancePanel } from "./deployment-instance-panel";
import { DeploymentsPanel } from "./deployments-panel";

export function DeploymentsView() {
  const { data: instance, isLoading, isError, error, isFetching, refetch } =
    useDeploymentInstance();

  return (
    <Tabs defaultValue="deployment-instance" className="space-y-5">
      <TabsList className="max-w-md">
        <TabsTrigger value="deployment-instance" className="gap-2">
          <Server className="h-4 w-4" />
          Deployment instance
        </TabsTrigger>
        <TabsTrigger value="deployments" className="gap-2" disabled={!instance}>
          <Rocket className="h-4 w-4" />
          Deployments
        </TabsTrigger>
      </TabsList>

      <TabsContent value="deployment-instance">
        <DeploymentInstancePanel
          instance={instance}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
          isFetching={isFetching}
          onRefresh={() => void refetch()}
        />
      </TabsContent>
      <TabsContent value="deployments">
        <DeploymentsPanel instance={instance} />
      </TabsContent>
    </Tabs>
  );
}
