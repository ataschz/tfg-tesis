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
  Calendar,
  MoreVertical,
  FileDown,
  Eye,
  DollarSign,
  Building2,
  Users2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format, formatDistanceToNow, isFuture } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ContractCardProps {
  contract: any; // TODO: Add proper type
  type: "received" | "sent";
}

export function ContractCard({ contract, type }: ContractCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startDate = new Date(contract.startDate);
  const endDate = new Date(contract.endDate);
  const isActive = contract.status === "active" || contract.status === "in_progress";

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "draft":
        return {
          text: "Borrador",
          badge: "bg-yellow-500/10 text-yellow-600",
        };
      case "sent":
        return {
          text: "Enviado",
          badge: "bg-blue-500/10 text-blue-600",
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

  const status = getStatusInfo(contract.status);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      // TODO: Implement contract download
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Contrato descargado correctamente");
    } catch (error) {
      toast.error("Error al descargar el contrato");
    } finally {
      setIsDownloading(false);
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
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalle
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  {isDownloading ? "Descargando..." : "Descargar contrato"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDisputeDialog(true)}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Iniciar disputa
                </DropdownMenuItem>
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
                    <Link href={`/dashboard/client/${contract.client.id}`}>
                      <Avatar className="h-8 w-8 border-2 border-background transition-transform hover:scale-105 hover:z-10">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${
                            contract.client.company || contract.client.firstName
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
                    <Link
                      href={`/dashboard/contractor/${contract.contractor.id}`}
                    >
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{contract.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Descripción</h4>
              <p className="text-sm text-muted-foreground">
                {contract.description}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Detalles del Contrato</h4>
              <dl className="mt-2 space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Monto</dt>
                  <dd className="font-medium">
                    {contract.currency} {contract.amount.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Fecha de Inicio</dt>
                  <dd className="font-medium">
                    {format(startDate, "PPP", { locale: es })}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    Fecha de Finalización
                  </dt>
                  <dd className="font-medium">
                    {format(endDate, "PPP", { locale: es })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar Disputa</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas iniciar una disputa para este
              contrato? Nuestro equipo revisará el caso y te contactará en
              breve.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDisputeDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsSubmitting(true);
                // TODO: Implement dispute initiation
                setTimeout(() => {
                  toast.success("Disputa iniciada correctamente");
                  setShowDisputeDialog(false);
                  setIsSubmitting(false);
                }, 1000);
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Iniciando..." : "Iniciar Disputa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
