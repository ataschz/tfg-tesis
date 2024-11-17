'use client';

import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, MessageSquare, FileText } from 'lucide-react';

interface DisputeTimelineProps {
  dispute: any; // TODO: Add proper type
}

export function DisputeTimeline({ dispute }: DisputeTimelineProps) {
  const events = [
    {
      type: 'dispute_created',
      title: 'Disputa Iniciada',
      description: 'El contratista inició una disputa por retraso en el pago',
      date: dispute.createdAt,
      icon: Clock,
    },
    {
      type: 'message',
      title: 'Comunicación Previa',
      description: 'Se intentó contactar al cliente múltiples veces sin éxito',
      date: '2024-03-09T15:30:00Z',
      icon: MessageSquare,
    },
    {
      type: 'evidence',
      title: 'Evidencia Presentada',
      description: 'Se adjuntó documentación de la entrega del milestone',
      date: '2024-03-08T10:00:00Z',
      icon: FileText,
    },
  ];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Línea de Tiempo</h3>
            <p className="text-sm text-muted-foreground">
              Historial de eventos de la disputa
            </p>
          </div>
        </div>

        <div className="relative ml-4 space-y-4">
          <div className="absolute bottom-0 left-3 top-0 w-px bg-border" />

          {events.map((event, index) => {
            const EventIcon = event.icon;
            return (
              <div key={index} className="relative pl-8">
                <div className="absolute left-0 flex h-6 w-6 items-center justify-center rounded-full bg-card ring-2 ring-border">
                  <EventIcon className="h-3 w-3 text-primary" />
                </div>
                <div className="rounded-lg border bg-card/50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">{event.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(event.date), 'PPp', { locale: es })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}