import { PageHeader } from "@/components/layout/page-header";
import { ReposView } from "@/features/repos/components/repos-view";

export const metadata = { title: "Repos" };

export default function ReposPage() {
  return (
    <>
      <PageHeader
        title="Repos"
        description="Create and manage repositories across your teams."
      />
      <ReposView />
    </>
  );
}
