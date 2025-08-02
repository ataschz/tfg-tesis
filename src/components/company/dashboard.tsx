"use client";

import { useEffect, useState } from "react";
import { getCompanyData } from "@/lib/actions/company";
import { ContractList } from "@/components/company/contract-list";
import { StatsCards } from "@/components/company/stats-cards";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import type { ContractWithParties } from "@/lib/types/contracts";
import type { Company } from "@/lib/types/database";
import { DashboardSkeleton } from "./dashboard-skeleton";

interface DashboardData {
  stats: {
    escrowAmount: number;
    upcomingPayments: number;
    activeContracts: number;
    currency: string;
  };
  contracts: any[]; // Simplified for now to handle the complex type differences
  user: any; // Simplified to handle complex type differences
}

export function CompanyDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getCompanyData();
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
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            ¡Bienvenido,{" "}
            {data.user.clientProfile?.company ||
              `${data.user.firstName} ${data.user.lastName}`}
            ! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Gestiona tus contratos activos, realiza pagos y supervisa el
            rendimiento de tu equipo global desde un solo lugar.
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
        <StatsCards stats={data.stats} />
      </div>

      <ContractList contracts={data.contracts} />
    </div>
  );
}
