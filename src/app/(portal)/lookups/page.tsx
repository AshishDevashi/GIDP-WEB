import { PageHeader } from "@/components/layout/page-header";
import { LookupsView } from "@/features/lookups/components/lookups-view";

export const metadata = { title: "Lookups" };

export default function LookupsPage() {
  return (
    <>
      <PageHeader
        title="Lookups"
        description="Reference data used across the portal."
      />
      <LookupsView />
    </>
  );
}
