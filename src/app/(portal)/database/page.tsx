import { PageHeader } from "@/components/layout/page-header";
import { DatabaseView } from "@/features/database/components/database-view";

export const metadata = { title: "Database" };

export default function DatabasePage() {
  return (
    <>
      <PageHeader
        title="Database"
        description="Manage the workspace database instance and databases."
      />
      <DatabaseView />
    </>
  );
}