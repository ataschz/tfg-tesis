"use client";

import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  CalendarDays, 
  DollarSign, 
  FileText,
  Clock
} from "lucide-react";

interface ContractInfoProps {
  contract: any;
}

export function ContractInfo({ contract }: ContractInfoProps) {
  const startDate = new Date(contract.startDate);
  const endDate = new Date(contract.endDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Información del Contrato</h3>
      
      <div className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Descripción
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            {contract.description}
          </p>
        </div>

        {/* Financial Details */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Detalles Financieros
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Monto Total</p>
              <p className="text-xl font-bold">
                {contract.currency} {Number(contract.amount).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Moneda</p>
              <p className="text-xl font-bold">{contract.currency}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Cronograma
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
                <p className="font-semibold">
                  {format(startDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Finalización</p>
                <p className="font-semibold">
                  {format(endDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm text-muted-foreground">Duración</p>
                <p className="font-semibold flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {duration} {duration === 1 ? 'día' : 'días'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Created Date */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Contrato creado el {format(new Date(contract.createdAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
          </p>
          {contract.updatedAt && contract.updatedAt !== contract.createdAt && (
            <p className="text-xs text-muted-foreground">
              Última actualización: {format(new Date(contract.updatedAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}