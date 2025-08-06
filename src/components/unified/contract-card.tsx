"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DisputeDialog } from "@/components/disputes/dispute-dialog";
import {
  Calendar,
  MoreVertical,
  Eye,
  DollarSign,
  Building2,
  Users2,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow, isFuture } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useMetaMask } from "@/hooks/useMetaMask";

interface ContractCardProps {
  contract: any; // TODO: Add proper type
  type: "received" | "sent" | "disputed";
}

export function ContractCard({ contract, type }: ContractCardProps) {
  const router = useRouter();
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReleasingFunds, setIsReleasingFunds] = useState(false);

  const metaMask = useMetaMask();

  const startDate = new Date(contract.startDate);
  const endDate = new Date(contract.endDate);
  const isActive =
    contract.status === "active" || contract.status === "in_progress";

  const getStatusInfo = (
    status: string,
    contractType: "received" | "sent" | "disputed"
  ) => {
    switch (status) {
      case "sent":
        return {
          text: contractType === "sent" ? "Enviado" : "Recibido",
          badge: "bg-blue-500/10 text-blue-600",
        };
      case "awaiting_deposit":
        return {
          text: "Esperando Depósito",
          badge: "bg-yellow-500/10 text-yellow-600",
        };
      case "pending_acceptance":
        return {
          text: "Pendiente de Aceptación",
          badge: "bg-amber-500/10 text-amber-600",
        };
      case "accepted":
        return {
          text: "Aceptado",
          badge: "bg-green-500/10 text-green-600",
        };
      case "rejected":
        return {
          text: "Rechazado",
          badge: "bg-red-500/10 text-red-600",
        };
      case "in_progress":
        return {
          text: "En Progreso",
          badge: "bg-emerald-500/10 text-emerald-600",
        };
      case "completed":
        return {
          text: "Completado",
          badge: "bg-purple-500/10 text-purple-600",
        };
      case "cancelled":
        return {
          text: "Cancelado",
          badge: "bg-gray-500/10 text-gray-600",
        };
      case "in_dispute":
        return {
          text: "En Disputa",
          badge: "bg-orange-500/10 text-orange-600",
        };
      default:
        return {
          text: "Desconocido",
          badge: "bg-slate-500/10 text-slate-500",
        };
    }
  };

  const status = getStatusInfo(contract.status, type);

  const handleReleaseFunds = async () => {
    if (!contract.blockchainContractId) {
      toast.error("Este contrato no tiene un ID de blockchain válido");
      return;
    }

    setIsReleasingFunds(true);
    try {
      // First connect to MetaMask if not connected
      if (!metaMask.isConnected) {
        await metaMask.connect();
        if (!metaMask.isConnected) {
          toast.error("No se pudo conectar a MetaMask");
          return;
        }
      }

      toast.loading("Liberando fondos...");

      // Get the escrow manager address from environment or contract data
      const escrowManagerAddress =
        process.env.NEXT_PUBLIC_ESCROW_MANAGER_ADDRESS ||
        "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

      // Release the funds
      const success = await metaMask.releaseFunds(
        escrowManagerAddress,
        contract.blockchainContractId
      );

      if (success) {
        toast.success(
          "¡Fondos liberados exitosamente! El contrato ha sido completado."
        );

        // Refresh the page to show updated status
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(metaMask.error || "Error al liberar los fondos");
      }
    } catch (error) {
      toast.error("Error inesperado al procesar la liberación de fondos");
    } finally {
      setIsReleasingFunds(false);
    }
  };

  return (
    <>
      <Card className="w-full overflow-hidden transition-all hover:shadow-lg">
        {/* Header */}
        <div className="border-b border-border/50 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">{contract.title}</h3>
                <Badge className={cn("font-medium", status.badge)}>
                  {status.text}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                {contract.description}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/contracts/${contract.id}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalle
                </DropdownMenuItem>
                {type !== "disputed" && contract.status !== "in_dispute" && (
                  <DropdownMenuItem onClick={() => setShowDisputeDialog(true)}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Iniciar disputa
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Monto */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Monto del Contrato
                </p>
                <p className="text-xl font-bold">
                  {contract.currency} {contract.amount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Fechas */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Período</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">
                      {format(startDate, "d MMM yyyy", { locale: es })}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">
                      {format(endDate, "d MMM yyyy", { locale: es })}
                    </span>
                  </div>
                  {isActive && isFuture(endDate) && (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(endDate, {
                        locale: es,
                        addSuffix: true,
                      })}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Participantes */}
            <div className="flex items-center justify-between gap-4">
              {/* Empresas */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Cliente</span>
                </div>
                <div className="flex -space-x-2">
                  {contract.client && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/profile/${contract.client.id}`}>
                            <Avatar className="h-8 w-8 border-2 border-background transition-transform hover:scale-105 hover:z-10">
                              <AvatarImage
                                src={`https://avatar.vercel.sh/${
                                  contract.client.company ||
                                  contract.client.firstName
                                }`}
                                alt={
                                  contract.client.company ||
                                  `${contract.client.firstName} ${contract.client.lastName}`
                                }
                              />
                              <AvatarFallback>
                                {contract.client.company
                                  ? contract.client.company[0]
                                  : contract.client.firstName[0]}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {contract.client.company ||
                              `${contract.client.firstName} ${contract.client.lastName}`}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              <div className="h-8 w-px bg-border" />

              {/* Contratistas */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Contratista
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {contract.contractor && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/profile/${contract.contractor.id}`}>
                            <Avatar className="h-8 w-8 border-2 border-background transition-transform hover:scale-105 hover:z-10">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contract.contractor.firstName}`}
                                alt={`${contract.contractor.firstName} ${contract.contractor.lastName}`}
                              />
                              <AvatarFallback>
                                {contract.contractor.firstName[0]}
                                {contract.contractor.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {contract.contractor.username
                              ? `@${contract.contractor.username}`
                              : `${contract.contractor.firstName} ${contract.contractor.lastName}`}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons for Pending Acceptance */}
        {type === "received" && contract.status === "pending_acceptance" && (
          <div className="border-t border-border/50 bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Este contrato está esperando tu respuesta
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(`/accept/${contract.id}?action=reject`)
                  }
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Rechazar
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push(`/accept/${contract.id}`)}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Aceptar Contrato
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

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
    </>
  );
}
