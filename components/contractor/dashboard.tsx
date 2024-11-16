import { Suspense } from 'react';
import { getContractorData } from '@/lib/actions/contractor';
import { ContractList } from '@/components/contractor/contract-list';
import { BalanceCard } from '@/components/contractor/balance-card';
import { DashboardSkeleton } from '@/components/contractor/dashboard-skeleton';

export async function ContractorDashboard() {
  const { balance, contracts, user } = await getContractorData();

  return (
    <div className="space-y-8 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          ¡Hola, {user.firstName}! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          Bienvenido a tu panel de control. Aquí puedes gestionar tus contratos activos, 
          realizar seguimiento de pagos y administrar tu perfil profesional.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <BalanceCard balance={balance} />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <ContractList contracts={contracts} />
      </Suspense>
    </div>
  );
}