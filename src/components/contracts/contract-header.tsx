"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  CalendarDays, 
  DollarSign, 
  FileText,
  AlertTriangle,
  Clock
} from "lucide-react";

interface ContractHeaderProps {
  contract: any;
}

export function ContractHeader({ contract }: ContractHeaderProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
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

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent dark:from-slate-900" />
      <div className="relative p-8">
        <div className="space-y-4">
          {/* Title and Status */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{contract.title}</h1>
              <Badge className={status.badge}>
                {status.text}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">ID del Contrato</p>
              <p className="font-mono text-sm">{contract.id.slice(0, 8)}...</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-lg leading-relaxed">
            {contract.description}
          </p>

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monto</p>
                <p className="font-semibold">
                  {contract.currency} {Number(contract.amount).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inicio</p>
                <p className="font-semibold">
                  {format(new Date(contract.startDate), "d MMM yyyy", { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Finalización</p>
                <p className="font-semibold">
                  {format(new Date(contract.endDate), "d MMM yyyy", { locale: es })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}