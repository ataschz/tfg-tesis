"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContractHeader } from "@/components/contracts/contract-header";
import { ContractInfo } from "@/components/contracts/contract-info";
import { ContractParticipants } from "@/components/contracts/contract-participants";
import { ContractDeliverables } from "@/components/contracts/contract-deliverables";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Wallet,
  Loader2,
  ArrowLeft,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface AcceptContractPageProps {
  params: Promise<{ contractId: string }>;
}

export default function AcceptContractPage({
  params,
}: AcceptContractPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [contractId, setContractId] = useState<string>("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [contractData, setContractData] = useState<any>(null);
  const [isLoadingContract, setIsLoadingContract] = useState(true);

  // Get contractId from params
  React.useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setContractId(resolvedParams.contractId);
    }
    loadParams();
  }, [params]);

  // Get user profile
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const response = await fetch("/api/auth/profile");
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    }
    loadUserProfile();
  }, []);

  // Get contract details
  useEffect(() => {
    async function loadContract() {
      if (!contractId) return;

      setIsLoadingContract(true);
      try {
        const response = await fetch(`/api/contracts/${contractId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setContractData(result.contract);
          } else {
            toast.error(result.error || "Error al cargar el contrato");
          }
        } else {
          toast.error("Error al cargar el contrato");
        }
      } catch (error) {
        console.error("Error loading contract:", error);
        toast.error("Error al cargar el contrato");
      } finally {
        setIsLoadingContract(false);
      }
    }
    loadContract();
  }, [contractId]);

  // Show loading state while contract is being fetched
  if (isLoadingContract) {
    return (
      <>
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Cargando Contrato</h1>
            <p className="text-muted-foreground">
              Obteniendo detalles del contrato...
            </p>
          </div>
        </div>
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </Card>
      </>
    );
  }

  // Show error if contract not found
  if (!contractData) {
    return (
      <>
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Contrato no encontrado</h1>
            <p className="text-muted-foreground">
              No se pudo cargar la información del contrato
            </p>
          </div>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            El contrato que intentas acceder no existe o no tienes permisos para
            verlo.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  // Show error if contract is not in the right state for acceptance
  if (contractData.status !== "pending_acceptance") {
    return (
      <>
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Contrato no disponible</h1>
            <p className="text-muted-foreground">
              Este contrato no está disponible para aceptación
            </p>
          </div>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Estado actual:</strong> {contractData.status}
            <br />
            Los contratos solo pueden ser aceptados cuando están en estado
            &quot;pending_acceptance&quot;.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  const acceptContract = async () => {
    if (isLoading) return;

    if (!contractId) {
      toast.error("Cargando datos del contrato...");
      return;
    }

    if (!userProfile?.walletAddress && !userProfile?.authUser?.walletAddress) {
      toast.error(
        "Debes configurar tu dirección de wallet en tu perfil antes de aceptar contratos"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/contracts/${contractId}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "¡Contrato aceptado exitosamente!");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Error al aceptar el contrato");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al aceptar el contrato");
    } finally {
      setIsLoading(false);
    }
  };

  const rejectContract = async () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres rechazar este contrato? Los fondos serán devueltos a la empresa automáticamente."
    );

    if (!confirmed) return;

    if (!contractId) {
      toast.error("Cargando datos del contrato...");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/contracts/${contractId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Contrato rechazado exitosamente.");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Error al rechazar el contrato");
      }
    } catch (error) {
      toast.error("Error al rechazar el contrato");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Page Header with Navigation */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{contractData.title}</h1>
          </div>
          <p className="text-muted-foreground">
            Revisa los detalles del contrato y decide si quieres aceptarlo o
            rechazarlo
          </p>
        </div>
      </div>

      {/* Contract Header with Status */}
      <div className="mb-8">
        <ContractHeader contract={contractData} />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
        {/* Left Column - Contract Details */}
        <div className="space-y-6">
          <ContractInfo contract={contractData} />
          <ContractDeliverables
            deliverables={contractData.deliverables || []}
          />
        </div>

        {/* Right Column - Actions & Wallet Info */}
        <div>
          <div className="sticky top-8 space-y-6">
            {/* Contract Participants */}
            <ContractParticipants
              clients={contractData.allClients || []}
              contractors={contractData.allContractors || []}
            />

            {/* Wallet Information */}
            {userProfile?.walletAddress ||
            userProfile?.authUser?.walletAddress ? (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Información de Wallet
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tu dirección de wallet
                    </p>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <code className="text-sm break-all">
                        {userProfile.walletAddress ||
                          userProfile.authUser?.walletAddress}
                      </code>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Los pagos se procesarán a esta dirección cuando el contrato
                    se complete.
                  </p>
                </div>
              </Card>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Debes configurar tu dirección de wallet en tu perfil antes de
                  aceptar contratos.
                  <br />
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2"
                    onClick={() => router.push("/profile")}
                  >
                    Ir a configurar perfil →
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Acciones</h3>
              <div className="space-y-3">
                <Button
                  onClick={acceptContract}
                  disabled={
                    isLoading ||
                    (!userProfile?.walletAddress &&
                      !userProfile?.authUser?.walletAddress)
                  }
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {isLoading ? "Aceptando..." : "Aceptar Contrato"}
                </Button>

                <Button
                  onClick={rejectContract}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-full gap-2"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {isLoading ? "Rechazando..." : "Rechazar Contrato"}
                </Button>
              </div>
            </Card>

            {/* Information Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Si aceptas este contrato, se
                activará y los fondos permanecerán en escrow hasta que se
                complete. Si lo rechazas, los fondos serán devueltos
                automáticamente a la empresa.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </>
  );
}
