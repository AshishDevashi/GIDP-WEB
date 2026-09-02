import { TeamDetailView } from "@/features/teams/components/team-detail-view";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TeamDetailView slug={slug} />;
}
