import { RegistryDetailView } from "@/features/registries/components/registry-detail-view";

export default async function RegistryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RegistryDetailView id={id} />;
}
