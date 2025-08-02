"use client";

import { useEffect, useState } from "react";
import { getUnifiedDashboardData } from "@/lib/actions/unified";
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
        const dashboardData = await getUnifiedDashboardData();
        
        const unifiedData: UnifiedData = {
          receivedContracts: dashboardData.contractorData.contracts,
          sentContracts: dashboardData.companyData.contracts,
          stats: {
            totalActiveContracts: 
              dashboardData.contractorData.contracts.filter((c: any) => c.status === 'active').length +
              dashboardData.companyData.contracts.filter((c: any) => c.status === 'active').length,
            totalPendingAmount: dashboardData.contractorData.stats.escrowAmount + dashboardData.companyData.stats.upcomingPayments,
            totalEscrowAmount: dashboardData.companyData.stats.escrowAmount,
            totalEarnedThisMonth: dashboardData.contractorData.stats.totalEarnings,
            currency: dashboardData.contractorData.stats.currency || dashboardData.companyData.stats.currency,
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