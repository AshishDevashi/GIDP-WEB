import { PageHeader } from "@/components/layout/page-header";
import { ProjectsView } from "@/features/projects/components/projects-view";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Projects"
        description="Create and manage projects across your teams."
      />
      <ProjectsView />
    </>
  );
}
