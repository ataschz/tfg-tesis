"use client";

import { useEffect, useState } from "react";
import { getContractorData } from "@/lib/actions/contractor";
import { getCompanyData } from "@/lib/actions/company";
import { ContractList } from "@/components/unified/contract-list";
import { UnifiedStats } from "@/components/unified/unified-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSkeleton } from "@/components/unified/dashboard-skeleton";
import { FileText, Send } from "lucide-react";

interface UnifiedData {
  receivedContracts: any[];
  sentContracts: any[];
  stats: {
    totalActiveContracts: number;
    totalPendingAmount: number;
    totalEscrowAmount: number;
    totalEarnedThisMonth: number;
    currency: string;
  };
}

export function UnifiedDashboard() {
  const [data, setData] = useState<UnifiedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [contractorData, companyData] = await Promise.all([
          getContractorData(),
          getCompanyData(),
        ]);

        const unifiedData: UnifiedData = {
          receivedContracts: contractorData.contracts,
          sentContracts: companyData.contracts,
          stats: {
            totalActiveContracts: 
              contractorData.contracts.filter((c: any) => c.status === 'active').length +
              companyData.contracts.filter((c: any) => c.status === 'active').length,
            totalPendingAmount: contractorData.balance.pending + companyData.stats.upcomingPayments,
            totalEscrowAmount: companyData.stats.escrowAmount,
            totalEarnedThisMonth: contractorData.balance.available,
            currency: contractorData.balance.currency,
          },
        };

        setData(unifiedData);
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
          Panel de Control Unificado
        </h1>
        <p className="text-lg text-muted-foreground">
          Gestiona todos tus contratos, tanto como contratista como contratante, desde un solo lugar.
        </p>
      </div>

      <UnifiedStats stats={data.stats} />

      <Tabs defaultValue="received" className="space-y-6">
        <TabsList>
          <TabsTrigger value="received" className="gap-2">
            <FileText className="h-4 w-4" />
            Contratos Recibidos
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            <Send className="h-4 w-4" />
            Contratos Enviados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          <ContractList 
            contracts={data.receivedContracts}
            type="received"
          />
        </TabsContent>

        <TabsContent value="sent">
          <ContractList 
            contracts={data.sentContracts}
            type="sent"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}