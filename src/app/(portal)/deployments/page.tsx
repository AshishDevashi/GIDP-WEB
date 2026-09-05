import { PageHeader } from "@/components/layout/page-header";
import { DeploymentsView } from "@/features/deployments/components/deployments-view";

export const metadata = { title: "Deployments" };

export default function DeploymentsPage() {
  return (
    <>
      <PageHeader
        title="Deployments"
        description="Manage the workspace deployment instance and deployments."
      />
      <DeploymentsView />
    </>
  );
}
