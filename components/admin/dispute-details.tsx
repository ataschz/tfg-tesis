'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, Calendar, DollarSign } from 'lucide-react';

interface DisputeDetailsProps {
  dispute: any; // TODO: Add proper type
}

export function DisputeDetails({ dispute }: DisputeDetailsProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Detalles de la Disputa</h3>
            <p className="text-sm text-muted-foreground">
              Información del contrato y motivo de la disputa
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="mb-2 font-medium">Motivo de la Disputa</h4>
            <p className="text-sm text-muted-foreground">{dispute.description}</p>
          </div>

          <div className="rounded-lg border bg-card/50 p-4">
            <h4 className="mb-4 font-medium">Detalles del Contrato</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Monto Total</span>
                </div>
                <p className="font-medium">
                  {dispute.contract.currency} {dispute.contract.amount.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Duración</span>
                </div>
                <p className="font-medium">
                  {format(new Date(dispute.contract.startDate), 'PP', { locale: es })} -{' '}
                  {format(new Date(dispute.contract.endDate), 'PP', { locale: es })}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Descripción del Contrato</h4>
            <p className="text-sm text-muted-foreground">
              {dispute.contract.description}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}