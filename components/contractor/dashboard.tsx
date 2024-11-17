'use client';

import { useEffect, useState } from 'react';
import { getContractorData } from '@/lib/actions/contractor';
import { ContractList } from '@/components/contractor/contract-list';
import { BalanceCard } from '@/components/contractor/balance-card';
import type { ContractWithParties } from '@/lib/types/dashboard';

interface DashboardData {
  balance: {
    available: number;
    pending: number;
    currency: string;
  };
  contracts: ContractWithParties[];
  user: {
    firstName: string;
  };
}

export function ContractorDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getContractorData();
        setData(result);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!data) {
    return <div>Error al cargar los datos</div>;
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          ¡Hola, {data.user.firstName}! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          Bienvenido a tu panel de control. Aquí puedes gestionar tus contratos activos, 
          realizar seguimiento de pagos y administrar tu perfil profesional.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <BalanceCard balance={data.balance} />
      </div>

      <ContractList contracts={data.contracts} />
    </div>
  );
}