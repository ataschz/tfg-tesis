import { getDisputeDetail } from "@/lib/actions/admin";
import { AdminDisputeDetailClient } from "@/components/admin/admin-dispute-detail-client";
import { notFound } from "next/navigation";

export default async function DisputeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getDisputeDetail(id);

  if (!result.success || !result.dispute) {
    if (result.error?.includes("permisos")) {
      return (
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
            <p className="text-muted-foreground mt-2">
              No tienes permisos para ver esta disputa
            </p>
          </div>
        </div>
      );
    }
    notFound();
  }

  return (
    <div className="container py-8">
      <AdminDisputeDetailClient dispute={result.dispute} />
    </div>
  );
}
