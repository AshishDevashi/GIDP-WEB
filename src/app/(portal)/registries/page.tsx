import { PageHeader } from "@/components/layout/page-header";
import { RegistriesView } from "@/features/registries/components/registries-view";

export const metadata = { title: "Registries" };

export default function RegistriesPage() {
  return (
    <>
      <PageHeader
        title="Registries"
        description="Create and manage container image registries."
      />
      <RegistriesView />
    </>
  );
}
