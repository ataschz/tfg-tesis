import { Suspense } from 'react';
import { CompanyDashboard } from '@/components/company/dashboard';
import { DashboardSkeleton } from '@/components/company/dashboard-skeleton';

export default function CompanyPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <CompanyDashboard />
    </Suspense>
  );
}