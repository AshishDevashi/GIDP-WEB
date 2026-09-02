import { PageHeader } from "@/components/layout/page-header";
import { TeamsView } from "@/features/teams/components/teams-view";

export const metadata = { title: "Teams" };

export default function TeamsPage() {
  return (
    <>
      <PageHeader
        title="Teams"
        description="Create a team or join an existing one."
      />
      <TeamsView />
    </>
  );
}
