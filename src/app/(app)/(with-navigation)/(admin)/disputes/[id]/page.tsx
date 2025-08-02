"use client";

import { useState, use } from "react";
import { DisputeHeader } from "@/components/admin/dispute-header";
import { DisputeTimeline } from "@/components/admin/dispute-timeline";
import { DisputeDetails } from "@/components/admin/dispute-details";
import { DisputeParties } from "@/components/admin/dispute-parties";
import { DisputeActions } from "@/components/admin/dispute-actions";
import { DisputeEvidence } from "@/components/admin/dispute-evidence";
import { toast } from "sonner";

// TODO: Replace with real data fetching
const mockDispute = {
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
  evidence: [
    {
      type: "document",
      title: "Entrega del Milestone",
      url: "#",
      uploadedAt: "2024-03-08T10:00:00Z",
    },
    {
      type: "message",
      title: "Comunicación previa",
      content: "Se intentó contactar al cliente múltiples veces...",
      timestamp: "2024-03-09T15:30:00Z",
    },
  ],
  contract: {
    title: "Desarrollo Frontend React",
    description:
      "Desarrollo de nueva plataforma de e-commerce con React, Next.js y TypeScript.",
    amount: 5000,
    currency: "USD",
    startDate: "2024-02-01T00:00:00Z",
    endDate: "2024-04-30T23:59:59Z",
    company: {
      id: "comp_01",
      name: "TechSolutions SA",
      email: "rrhh@techsolutions.com",
      rating: 4.8,
      totalContracts: 24,
      disputeRate: 0.04,
      reviews: [
        {
          id: "rev_01",
          rating: 5,
          comment:
            "Excelente empresa para trabajar. Procesos claros y pagos puntuales.",
          author: "Ana García",
          date: "2024-02-15T00:00:00Z",
        },
      ],
    },
    contractor: {
      id: "cont_01",
      name: "Ana García",
      email: "ana.garcia@gmail.com",
      rating: 4.9,
      totalContracts: 15,
      disputeRate: 0.02,
      reviews: [
        {
          id: "rev_02",
          rating: 5,
          comment:
            "Profesional excepcional, entrega puntual y excelente comunicación.",
          author: "TechSolutions SA",
          date: "2024-01-20T00:00:00Z",
        },
      ],
    },
  },
};

export default function DisputeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResolve = async (resolution: string) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement dispute resolution
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Disputa resuelta exitosamente");
    } catch (error) {
      toast.error("Error al resolver la disputa");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEscalate = async (reason: string) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement dispute escalation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Disputa escalada al siguiente nivel");
    } catch (error) {
      toast.error("Error al escalar la disputa");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <DisputeHeader dispute={mockDispute} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,400px]">
        <div className="space-y-6">
          <DisputeDetails dispute={mockDispute} />
          <DisputeEvidence evidence={mockDispute.evidence} />
          <DisputeTimeline dispute={mockDispute} />
          <DisputeActions
            onResolve={handleResolve}
            onEscalate={handleEscalate}
            isSubmitting={isSubmitting}
          />
        </div>

        <div>
          <div className="sticky top-8 space-y-6">
            <DisputeParties
              company={mockDispute.contract.company}
              contractor={mockDispute.contract.contractor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
