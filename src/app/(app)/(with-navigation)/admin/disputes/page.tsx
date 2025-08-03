import { getAllDisputes, getDisputeStats } from '@/lib/actions/admin';
import { AdminDisputesClient } from '@/components/admin/admin-disputes-client';

export default async function DisputesDashboardPage() {
  const [disputesResult, statsResult] = await Promise.all([
    getAllDisputes(),
    getDisputeStats()
  ]);

  if (!disputesResult.success || !statsResult.success) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-muted-foreground mt-2">
            {disputesResult.error || statsResult.error || "Error al cargar los datos"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <AdminDisputesClient 
        initialDisputes={disputesResult.disputes} 
        initialStats={statsResult.stats}
      />
    </div>
  );
}