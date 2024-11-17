'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Clock,
  Scale,
  CheckCircle2,
} from 'lucide-react';

interface DisputesListProps {
  disputes: any[]; // TODO: Add proper type
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  in_progress: {
    label: 'En Proceso',
    icon: Scale,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  resolved: {
    label: 'Resuelta',
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  escalated: {
    label: 'Escalada',
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
};

const priorityConfig = {
  high: {
    label: 'Alta',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  medium: {
    label: 'Media',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  low: {
    label: 'Baja',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
};

export function DisputesList({ disputes }: DisputesListProps) {
  return (
    <div className="space-y-4">
      {disputes.map((dispute) => {
        const status = statusConfig[dispute.status as keyof typeof statusConfig];
        const priority = priorityConfig[dispute.priority as keyof typeof priorityConfig];
        const StatusIcon = status.icon;

        return (
          <Card key={dispute.id} className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${status.bg}`}>
                    <StatusIcon className={`h-5 w-5 ${status.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{dispute.contract.title}</h3>
                      <Badge variant="outline" className={`${priority.color} ${priority.bg}`}>
                        {priority.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Disputa iniciada el {format(new Date(dispute.createdAt), 'PPP', { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {dispute.currency} {dispute.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage 
                          src={`https://avatar.vercel.sh/${dispute.contract.company.name}`}
                          alt={dispute.contract.company.name}
                        />
                        <AvatarFallback>{dispute.contract.company.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{dispute.contract.company.name}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dispute.contract.contractor.name}`}
                          alt={dispute.contract.contractor.name}
                        />
                        <AvatarFallback>{dispute.contract.contractor.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{dispute.contract.contractor.name}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {dispute.description}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline">Ver Detalles</Button>
                <Button>Tomar Caso</Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}