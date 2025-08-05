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
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { checkUserReviewStatus } from "@/lib/actions/reviews";
import { useMetaMask } from "@/hooks/useMetaMask";
import { toast } from "sonner";

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
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isReleasingFunds, setIsReleasingFunds] = useState(false);
  
  const metaMask = useMetaMask();

  // Check if dispute can be initiated
  const canInitiateDispute = ["accepted", "in_progress", "completed"].includes(
    contract.status
  );

  // Determine user type
  const userIsClient = contract.clientId === currentUserId ||
    contract.contractClients?.some((cc: any) => cc.clientId === currentUserId);
  
  const userIsContractor = contract.contractorId === currentUserId ||
    contract.contractContractors?.some((cc: any) => cc.contractorId === currentUserId);

  // Check if contractor can accept/reject
  const canAcceptReject = userIsContractor && contract.status === "pending_acceptance";
  
  // Check if buyer can release funds
  const canReleaseFunds = userIsClient && (contract.status === "accepted" || contract.status === "in_progress");

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

  const handleAcceptContract = async () => {
    setIsAccepting(true);
    try {
      const response = await fetch(`/api/contracts/${contract.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (result.success) {
        toast.success('¡Contrato aceptado exitosamente!');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error(result.error || 'Error al aceptar el contrato');
      }
    } catch (error) {
      toast.error('Error inesperado al procesar la aceptación');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectContract = async () => {
    setIsRejecting(true);
    try {
      const response = await fetch(`/api/contracts/${contract.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Contrato rechazado. Los fondos han sido devueltos a la empresa.');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error(result.error || 'Error al rechazar el contrato');
      }
    } catch (error) {
      toast.error('Error inesperado al procesar el rechazo');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleReleaseFunds = async () => {
    if (!contract.blockchainContractId) {
      toast.error('Este contrato no tiene un ID de blockchain válido');
      return;
    }

    setIsReleasingFunds(true);
    try {
      // First connect to MetaMask if not connected
      if (!metaMask.isConnected) {
        await metaMask.connect();
        if (!metaMask.isConnected) {
          toast.error('No se pudo conectar a MetaMask');
          return;
        }
      }

      toast.loading('Liberando fondos...');

      // Get the escrow manager address from environment
      const escrowManagerAddress = process.env.NEXT_PUBLIC_ESCROW_MANAGER_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

      // Release the funds
      const success = await metaMask.releaseFunds(
        escrowManagerAddress,
        contract.blockchainContractId
      );

      if (success) {
        toast.success('¡Fondos liberados exitosamente! El contrato ha sido completado.');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error(metaMask.error || 'Error al liberar los fondos');
      }
    } catch (error) {
      toast.error('Error inesperado al procesar la liberación de fondos');
    } finally {
      setIsReleasingFunds(false);
    }
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

        <div className="flex items-center gap-3 flex-wrap">
          {/* Accept/Reject buttons for contractors */}
          {canAcceptReject && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleRejectContract}
                disabled={isRejecting || isAccepting}
                className="gap-2 border-red-200 text-red-700 hover:bg-red-50"
              >
                {isRejecting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Rechazando...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Rechazar
                  </>
                )}
              </Button>
              <Button
                onClick={handleAcceptContract}
                disabled={isAccepting || isRejecting}
                className="gap-2"
              >
                {isAccepting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Aceptando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Aceptar Contrato
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Release funds button for buyers */}
          {canReleaseFunds && (
            <Button
              onClick={handleReleaseFunds}
              disabled={isReleasingFunds || !metaMask.isAvailable}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {isReleasingFunds ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Liberando...
                </>
              ) : (
                <>
                  <Banknote className="h-4 w-4" />
                  Liberar Fondos
                </>
              )}
            </Button>
          )}

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
                      user.type === "contractor" ? "freelancer" : "empresa"
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

      {/* Action Status Card */}
      {(canAcceptReject || canReleaseFunds) && (
        <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50/50">
          <div className="flex items-center justify-between">
            <div>
              {canAcceptReject && (
                <div>
                  <h3 className="font-semibold text-blue-900">Acción Requerida</h3>
                  <p className="text-sm text-blue-700">
                    Este contrato está esperando tu respuesta. Revisa los detalles y decide si aceptar o rechazar.
                  </p>
                </div>
              )}
              {canReleaseFunds && (
                <div>
                  <h3 className="font-semibold text-green-900">¿Trabajo Completado?</h3>
                  <p className="text-sm text-green-700">
                    Si estás satisfecho con el trabajo realizado, puedes liberar los fondos al freelancer.
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {canAcceptReject && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRejectContract}
                    disabled={isRejecting || isAccepting}
                    className="gap-2"
                  >
                    {isRejecting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Rechazando...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        Rechazar
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptContract}
                    disabled={isAccepting || isRejecting}
                    className="gap-2"
                  >
                    {isAccepting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Aceptando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Aceptar
                      </>
                    )}
                  </Button>
                </>
              )}
              {canReleaseFunds && (
                <Button
                  size="sm"
                  onClick={handleReleaseFunds}
                  disabled={isReleasingFunds || !metaMask.isAvailable}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isReleasingFunds ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Liberando...
                    </>
                  ) : (
                    <>
                      <Banknote className="h-4 w-4" />
                      Liberar Fondos
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          {metaMask.error && canReleaseFunds && (
            <div className="mt-2 text-sm text-red-600">
              {metaMask.error}
            </div>
          )}
        </Card>
      )}

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
