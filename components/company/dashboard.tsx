import { Suspense } from 'react';
import { getCompanyData } from '@/lib/actions/company';
import { ContractList } from '@/components/company/contract-list';
import { StatsCards } from '@/components/company/stats-cards';
import { DashboardSkeleton } from '@/components/company/dashboard-skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export async function CompanyDashboard() {
  const { stats, contracts, user } = await getCompanyData();

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            ¡Bienvenido, {user.companyName}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Gestiona tus contratos activos, realiza pagos y supervisa el rendimiento de tu equipo global desde un solo lugar.
          </p>
        </div>
        <div className="flex shrink-0 items-start">
          <Link href="/company/contracts/new">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Nuevo Contrato
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-6">
        <StatsCards stats={stats} />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <ContractList contracts={contracts} />
      </Suspense>
    </div>
  );
}