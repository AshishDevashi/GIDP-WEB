import { RepoDetailView } from "@/features/repos/components/repo-detail-view";

export default async function RepoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RepoDetailView id={id} />;
}
