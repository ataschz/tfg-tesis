"use client";

import { useState } from "react";
import { DisputeHeader } from "@/components/admin/dispute-header";
import { DisputeTimeline } from "@/components/admin/dispute-timeline";
import { DisputeDetails } from "@/components/admin/dispute-details";
import { DisputeParties } from "@/components/admin/dispute-parties";
import { DisputeActions } from "@/components/admin/dispute-actions";
import { DisputeEvidence } from "@/components/admin/dispute-evidence";
import { resolveDispute, assignMediatorToDispute } from "@/lib/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminDisputeDetailClientProps {
  dispute: any;
}

export function AdminDisputeDetailClient({ dispute }: AdminDisputeDetailClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleResolve = async (resolution: string, resolutionDetails: string, winnerId?: string) => {
    setIsSubmitting(true);
    try {
      const result = await resolveDispute(dispute.id, resolution, resolutionDetails, winnerId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Error al resolver la disputa");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignMediator = async () => {
    setIsSubmitting(true);
    try {
      const result = await assignMediatorToDispute(dispute.id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Error al asignar mediador");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transform data for components - handle multiple parties
  const clientParties = [
    {
      id: dispute.contract.client.id,
      name: dispute.contract.client.clientProfile?.company || 
        `${dispute.contract.client.firstName} ${dispute.contract.client.lastName}`,
      email: dispute.contract.client.authUser?.email || "",
      isPrimary: true,
    },
    // Add additional clients from contractClients if they exist
    ...(dispute.contract.contractClients?.map((cc: any) => ({
      id: cc.client.id,
      name: cc.client.clientProfile?.company || 
        `${cc.client.firstName} ${cc.client.lastName}`,
      email: cc.client.authUser?.email || "",
      isPrimary: false,
    })) || [])
  ];

  const contractorParties = [
    {
      id: dispute.contract.contractor.id,
      name: `${dispute.contract.contractor.firstName} ${dispute.contract.contractor.lastName}`,
      email: dispute.contract.contractor.authUser?.email || "",
      isPrimary: true,
    },
    // Add additional contractors from contractContractors if they exist
    ...(dispute.contract.contractContractors?.map((cc: any) => ({
      id: cc.contractor.id,
      name: `${cc.contractor.firstName} ${cc.contractor.lastName}`,
      email: cc.contractor.authUser?.email || "",
      isPrimary: false,
    })) || [])
  ];

  const transformedDispute = {
    ...dispute,
    contract: {
      ...dispute.contract,
      clients: clientParties,
      contractors: contractorParties,
    },
  };

  // Transform evidence for component
  const transformedEvidence = dispute.evidence?.map((evidence: any) => ({
    id: evidence.id,
    type: evidence.evidenceType,
    title: evidence.description || "Archivo adjunto",
    url: evidence.fileUrl,
    uploadedAt: evidence.createdAt,
    uploadedBy: `${evidence.userProfile.firstName} ${evidence.userProfile.lastName}`,
  })) || [];

  return (
    <>
      <DisputeHeader dispute={transformedDispute} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,400px]">
        <div className="space-y-6">
          <DisputeDetails dispute={transformedDispute} />
          <DisputeEvidence 
            evidence={transformedEvidence} 
            disputeId={dispute.id}
            canAddEvidence={true}
          />
          <DisputeActions
            dispute={dispute}
            onResolve={handleResolve}
            onAssignMediator={handleAssignMediator}
            isSubmitting={isSubmitting}
          />
        </div>

        <div>
          <div className="sticky top-8 space-y-6">
            <DisputeParties
              clients={transformedDispute.contract.clients}
              contractors={transformedDispute.contract.contractors}
            />
          </div>
        </div>
      </div>
    </>
  );
}