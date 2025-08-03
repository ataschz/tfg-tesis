import { getUnifiedDashboardData } from "@/lib/actions/unified";
import { ContractList } from "@/components/unified/contract-list";
import { UnifiedStats } from "@/components/unified/unified-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Send } from "lucide-react";

interface UnifiedData {
  receivedContracts: any[];
  sentContracts: any[];
  stats: {
    totalActiveContracts: number;
    totalInProgressAmount: number; // En progreso + Aceptados
    totalAvailableAmount: number; // Contratos completados
    totalInDisputeAmount: number;
    totalInDisputeContracts: number;
    currency: string;
    userName: string;
  };
}

export async function UnifiedDashboard() {
  let data: UnifiedData;

  try {
    const dashboardData = await getUnifiedDashboardData();

    const receivedContracts = dashboardData.contractorData?.contracts || [];
    const sentContracts = dashboardData.companyData?.contracts || [];
    const allContracts = [...receivedContracts, ...sentContracts];

    // Calculate real statistics  
    const activeContracts = allContracts.filter((c: any) => 
      c.status === "in_progress" || c.status === "accepted" || c.status === "sent"
    );
    
    const completedContracts = allContracts.filter((c: any) => 
      c.status === "completed"
    );
    
    const disputeContracts = allContracts.filter((c: any) => 
      c.status === "in_dispute"
    );
    
    const inProgressAmount = activeContracts.reduce((sum: number, contract: any) => 
      sum + Number(contract.amount), 0
    );
    
    const availableAmount = completedContracts.reduce((sum: number, contract: any) => 
      sum + Number(contract.amount), 0
    );
    
    const disputeAmount = disputeContracts.reduce((sum: number, contract: any) => 
      sum + Number(contract.amount), 0
    );

    data = {
      receivedContracts,
      sentContracts,
      stats: {
        totalActiveContracts: activeContracts.length,
        totalInProgressAmount: inProgressAmount,
        totalAvailableAmount: availableAmount,
        totalInDisputeAmount: disputeAmount,
        totalInDisputeContracts: disputeContracts.length,
        currency: dashboardData.userProfile?.preferredCurrency || "USD",
        userName: `${dashboardData.userProfile?.firstName || ''} ${dashboardData.userProfile?.lastName || ''}`.trim(),
      },
    };
  } catch (error) {
    console.error("Error loading dashboard data:", error);
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
          <ContractList contracts={data.receivedContracts} type="received" />
        </TabsContent>

        <TabsContent value="sent">
          <ContractList contracts={data.sentContracts} type="sent" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
