import { Suspense } from 'react';
import { ContractorDashboard } from '@/components/contractor/dashboard';
import { DashboardSkeleton } from '@/components/contractor/dashboard-skeleton';

export default function ContractorPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ContractorDashboard />
    </Suspense>
  );
}