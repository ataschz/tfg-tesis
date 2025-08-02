import { requireMediator } from "@/lib/auth";
import { DisputesList } from "@/components/admin/disputes-list";
import { DisputesStats } from "@/components/admin/disputes-stats";

export default async function AdminDashboardPage() {
  const user = await requireMediator();

  // TODO: Replace with real data fetching
  const disputesStats = {
    total: 24,
    pending: 8,
    inProgress: 5,
    resolved: 10,
    escalated: 1,
  };

  const mockDisputes = [
    {
      id: "dispute_01",
      contractId: "contract_01",
      status: "pending",
      priority: "high",
      reason: "payment_delay",
      description:
        "El contratista ha completado el milestone según lo acordado, pero el pago lleva más de 15 días de retraso sin justificación.",
      amount: 1500,
      currency: "USD",
      createdAt: "2024-03-10T14:00:00Z",
      initiatedBy: "contractor",
      contract: {
        title: "Desarrollo Frontend React",
        company: {
          name: "TechSolutions SA",
        },
        contractor: {
          name: "Ana García",
        },
      },
    },
    {
      id: "dispute_02",
      contractId: "contract_02",
      status: "in_progress",
      priority: "medium",
      reason: "quality_issue",
      description:
        "La entrega no cumple con los estándares acordados en el contrato.",
      amount: 800,
      currency: "USD",
      createdAt: "2024-03-08T10:30:00Z",
      initiatedBy: "company",
      contract: {
        title: "Desarrollo API Backend",
        company: {
          name: "InnovateMX",
        },
        contractor: {
          name: "Carlos Rodríguez",
        },
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Mediador</h1>
        <p className="text-muted-foreground">
          Gestiona disputas y resoluciones del sistema
        </p>
      </div>

      <DisputesStats stats={disputesStats} />
      <DisputesList disputes={mockDisputes} />
    </div>
  );
}
