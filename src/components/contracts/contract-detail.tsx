"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContractHeader } from "./contract-header";
import { ContractInfo } from "./contract-info";
import { ContractParticipants } from "./contract-participants";
import { ContractDeliverables } from "./contract-deliverables";
import { ContractTerms } from "./contract-terms";
import { DisputeDialog } from "@/components/disputes/dispute-dialog";
import { ReviewDialog } from "@/components/reviews/review-dialog";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { checkUserReviewStatus } from "@/lib/actions/reviews";

interface ContractDetailProps {
  contract: any;
  currentUserId: string;
}

interface ReviewableUser {
  id: string;
  name: string;
  type: "contractor" | "client";
}

export function ContractDetail({
  contract,
  currentUserId,
}: ContractDetailProps) {
  const router = useRouter();
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviewableUsers, setReviewableUsers] = useState<ReviewableUser[]>([]);

  // Check if dispute can be initiated
  const canInitiateDispute = ["accepted", "in_progress", "completed"].includes(
    contract.status
  );

  // Check if reviews can be left (contract is in final state)
  const canLeaveReviews = ["completed", "cancelled"].includes(contract.status);

  // Determine current user type and get reviewable users
  useEffect(() => {
    const checkReviewStatus = async () => {
      if (!canLeaveReviews) return;

      // Check if user has already reviewed this contract
      const reviewStatus = await checkUserReviewStatus(contract.id);
      setUserHasReviewed(reviewStatus.hasReviewed);

      // Determine current user type and get users they can review
      const userIsClient =
        contract.clientId === currentUserId ||
        contract.contractClients?.some(
          (cc: any) => cc.clientId === currentUserId
        );

      const userIsContractor =
        contract.contractorId === currentUserId ||
        contract.contractContractors?.some(
          (cc: any) => cc.contractorId === currentUserId
        );

      const reviewable: ReviewableUser[] = [];

      if (userIsClient) {
        // Client can review contractors
        if (contract.contractor && contract.contractor.id !== currentUserId) {
          reviewable.push({
            id: contract.contractor.id,
            name: `${contract.contractor.firstName} ${contract.contractor.lastName}`,
            type: "contractor",
          });
        }
        contract.contractContractors?.forEach((cc: any) => {
          if (cc.contractor && cc.contractor.id !== currentUserId) {
            reviewable.push({
              id: cc.contractor.id,
              name: `${cc.contractor.firstName} ${cc.contractor.lastName}`,
              type: "contractor",
            });
          }
        });
      }

      if (userIsContractor) {
        // Contractor can review clients
        if (contract.client && contract.client.id !== currentUserId) {
          reviewable.push({
            id: contract.client.id,
            name: `${contract.client.firstName} ${contract.client.lastName}`,
            type: "client",
          });
        }
        contract.contractClients?.forEach((cc: any) => {
          if (cc.client && cc.client.id !== currentUserId) {
            reviewable.push({
              id: cc.client.id,
              name: `${cc.client.firstName} ${cc.client.lastName}`,
              type: "client",
            });
          }
        });
      }

      // Remove duplicates
      const uniqueReviewable = reviewable.filter(
        (user, index, self) => self.findIndex((u) => u.id === user.id) === index
      );

      setReviewableUsers(uniqueReviewable);
    };

    checkReviewStatus();
  }, [contract, currentUserId, canLeaveReviews]);

  const handleReviewSuccess = () => {
    setUserHasReviewed(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with back button and action buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        <div className="flex items-center gap-3">
          {/* Review buttons - shown when contract is completed/cancelled and user hasn't reviewed */}
          {canLeaveReviews &&
            !userHasReviewed &&
            reviewableUsers.length > 0 && (
              <div className="flex items-center gap-2">
                {reviewableUsers.map((user) => (
                  <ReviewDialog
                    key={user.id}
                    contractId={contract.id}
                    contractTitle={contract.title}
                    reviewedUserId={user.id}
                    reviewedUserName={user.name}
                    reviewedUserType={user.type}
                    triggerText={`Calificar ${
                      user.type === "contractor" ? "contratista" : "cliente"
                    }`}
                    onReviewSuccess={handleReviewSuccess}
                  />
                ))}
              </div>
            )}

          {/* Dispute button */}
          {canInitiateDispute && contract.status !== "in_dispute" && (
            <Button
              variant="outline"
              onClick={() => setShowDisputeDialog(true)}
              className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <AlertTriangle className="h-4 w-4" />
              Iniciar Disputa
            </Button>
          )}
        </div>
      </div>

      {/* Contract Header */}
      <ContractHeader contract={contract} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <ContractInfo contract={contract} />
          <ContractDeliverables deliverables={contract.deliverables || []} />
          {contract.termsAndConditions && (
            <ContractTerms termsAndConditions={contract.termsAndConditions} />
          )}
        </div>

        {/* Right Column - Participants */}
        <div className="lg:col-span-1">
          <ContractParticipants
            clients={contract.allClients || []}
            contractors={contract.allContractors || []}
          />
        </div>
      </div>

      {/* Dispute Dialog */}
      <DisputeDialog
        open={showDisputeDialog}
        onOpenChange={setShowDisputeDialog}
        contractId={contract.id}
        contractTitle={contract.title}
        milestones={
          contract.deliverables?.map((deliverable: any, index: number) => ({
            id: `deliverable-${index}`,
            title: deliverable.title || `Entregable ${index + 1}`,
            description: deliverable.description || deliverable,
          })) || []
        }
      />
    </div>
  );
}
