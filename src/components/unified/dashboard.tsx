import { getUnifiedDashboardData } from "@/lib/actions/unified";
import { getDisputedContracts } from "@/lib/actions/disputes";
import { ContractList } from "@/components/unified/contract-list";
import { UnifiedStats } from "@/components/unified/unified-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Send, AlertTriangle } from "lucide-react";

interface UnifiedData {
  receivedContracts: any[];
  sentContracts: any[];
  disputedContracts: any[];
  userType: string;
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
    const [dashboardData, disputedData] = await Promise.all([
      getUnifiedDashboardData(),
      getDisputedContracts(),
    ]);

    const receivedContracts = dashboardData.contractorData?.contracts || [];
    const sentContracts = dashboardData.companyData?.contracts || [];
    const disputedContracts = disputedData.contracts || [];
    const allContracts = [...receivedContracts, ...sentContracts];

    // Calculate statistics based on user type
    let stats;
    const userType = dashboardData.userType;

    if (userType === "client") {
      // Para empresas: balance excluye completados y cancelados
      const balanceContracts = allContracts.filter(
        (c: any) =>
          c.status === "sent" ||
          c.status === "accepted" ||
          c.status === "in_progress" ||
          c.status === "in_dispute"
      );

      const withdrawableContracts = balanceContracts.filter(
        (c: any) =>
          c.status !== "accepted" &&
          c.status !== "in_dispute" &&
          c.status !== "in_progress"
      );

      const balanceAmount = balanceContracts.reduce(
        (sum: number, contract: any) => sum + Number(contract.amount),
        0
      );

      const withdrawableAmount = withdrawableContracts.reduce(
        (sum: number, contract: any) => sum + Number(contract.amount),
        0
      );

      const disputeAmount = allContracts
        .filter((c: any) => c.status === "in_dispute")
        .reduce(
          (sum: number, contract: any) => sum + Number(contract.amount),
          0
        );

      stats = {
        userType: "client",
        totalBalance: balanceAmount,
        totalWithdrawableAmount: withdrawableAmount,
        totalInDisputeAmount: disputeAmount,
        totalActiveContracts: balanceContracts.length,
        totalInDisputeContracts: allContracts.filter(
          (c: any) => c.status === "in_dispute"
        ).length,
        currency: dashboardData.userProfile?.preferredCurrency || "USD",
        userName: `${dashboardData.userProfile?.firstName || ""} ${
          dashboardData.userProfile?.lastName || ""
        }`.trim(),
      };
    } else {
      // Para freelancers: balance incluye trabajos activos, completados y en disputa
      const activeContracts = allContracts.filter(
        (c: any) => c.status === "accepted" || c.status === "in_progress"
      );

      const completedContracts = allContracts.filter(
        (c: any) => c.status === "completed"
      );

      const disputeContracts = allContracts.filter(
        (c: any) => c.status === "in_dispute"
      );

      // Balance total: activos + completados + en disputa
      const balanceContracts = allContracts.filter(
        (c: any) =>
          c.status === "accepted" ||
          c.status === "in_progress" ||
          c.status === "completed" ||
          c.status === "in_dispute"
      );

      const balanceAmount = balanceContracts.reduce(
        (sum: number, contract: any) => sum + Number(contract.amount),
        0
      );

      const availableAmount = completedContracts.reduce(
        (sum: number, contract: any) => sum + Number(contract.amount),
        0
      );

      const inProgressAmount = activeContracts.reduce(
        (sum: number, contract: any) => sum + Number(contract.amount),
        0
      );

      const disputeAmount = disputeContracts.reduce(
        (sum: number, contract: any) => sum + Number(contract.amount),
        0
      );

      stats = {
        userType: "contractor",
        totalBalance: balanceAmount,
        totalAvailableAmount: availableAmount,
        totalInProgressAmount: inProgressAmount,
        totalInDisputeAmount: disputeAmount,
        totalActiveContracts: activeContracts.length,
        totalInDisputeContracts: disputeContracts.length,
        currency: dashboardData.userProfile?.preferredCurrency || "USD",
        userName: `${dashboardData.userProfile?.firstName || ""} ${
          dashboardData.userProfile?.lastName || ""
        }`.trim(),
      };
    }

    data = {
      receivedContracts,
      sentContracts,
      disputedContracts,
      stats,
      userType,
    };
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    return <div>Error al cargar los datos</div>;
  }

  return (
    <div className="space-y-8 pb-8">
      <UnifiedStats stats={data.stats} />

      <Tabs
        defaultValue={
          data.userType === "client"
            ? "sent"
            : data.userType === "contractor"
            ? "received"
            : "received"
        }
        className="space-y-6"
      >
        <TabsList>
          {/* Contratos Recibidos - Solo para freelancers y mediadores */}
          {(data.userType === "contractor" || data.userType === "mediator") && (
            <TabsTrigger value="received" className="gap-2">
              <FileText className="h-4 w-4" />
              Contratos Recibidos
            </TabsTrigger>
          )}

          {/* Contratos Enviados - Solo para empresas y mediadores */}
          {(data.userType === "client" || data.userType === "mediator") && (
            <TabsTrigger value="sent" className="gap-2">
              <Send className="h-4 w-4" />
              Contratos Enviados
            </TabsTrigger>
          )}

          {/* Contratos en Disputa - Para todos */}
          <TabsTrigger value="disputed" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Contratos en Disputa ({data.disputedContracts.length})
          </TabsTrigger>
        </TabsList>

        {/* Contenido Contratos Recibidos */}
        {(data.userType === "contractor" || data.userType === "mediator") && (
          <TabsContent value="received">
            <ContractList contracts={data.receivedContracts} type="received" />
          </TabsContent>
        )}

        {/* Contenido Contratos Enviados */}
        {(data.userType === "client" || data.userType === "mediator") && (
          <TabsContent value="sent">
            <ContractList contracts={data.sentContracts} type="sent" />
          </TabsContent>
        )}

        {/* Contenido Contratos en Disputa */}
        <TabsContent value="disputed">
          <ContractList contracts={data.disputedContracts} type="disputed" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
