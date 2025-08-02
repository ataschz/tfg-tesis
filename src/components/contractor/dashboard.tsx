"use client";

import { useEffect, useState } from "react";
import { getContractorData } from "@/lib/actions/contractor";
import { ContractList } from "@/components/contractor/contract-list";
import { BalanceCard } from "@/components/contractor/balance-card";
import type { ContractWithParties } from "@/lib/types/contracts";
import { DashboardSkeleton } from "./dashboard-skeleton";

interface DashboardData {
  stats: {
    totalEarnings: number;
    escrowAmount: number;
    activeContracts: number;
    completedContracts: number;
    currency: string;
  };
  contracts: any[]; // Simplified for now to handle the complex type differences
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    contractorProfile?: any;
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
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return <div>Error al cargar los datos</div>;
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          ¡Hola, Ata Herrera {data.user.firstName}! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          Bienvenido a tu panel de control. Aquí puedes gestionar tus contratos
          activos, realizar seguimiento de pagos y administrar tu perfil
          profesional.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <BalanceCard balance={{
          available: data.stats.totalEarnings - data.stats.escrowAmount,
          pending: data.stats.escrowAmount,
          currency: data.stats.currency
        }} />
      </div>

      <ContractList contracts={data.contracts} />
    </div>
  );
}
