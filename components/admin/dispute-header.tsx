'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Scale,
  ArrowLeft,
  Clock,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface DisputeHeaderProps {
  dispute: any; // TODO: Add proper type
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
};

const priorityConfig = {
  high: {
    label: 'Alta',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
};

export function DisputeHeader({ dispute }: DisputeHeaderProps) {
  const status = statusConfig[dispute.status as keyof typeof statusConfig];
  const priority = priorityConfig[dispute.priority as keyof typeof priorityConfig];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/disputes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Scale className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{dispute.contract.title}</h1>
            <Badge variant="outline" className={`${priority.color} ${priority.bg}`}>
              {priority.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Disputa iniciada el {format(new Date(dispute.createdAt), 'PPP', { locale: es })}
          </p>
        </div>
      </div>

      <div className="grid gap-4 rounded-lg border bg-card/50 p-4 sm:grid-cols-3">
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${status.bg}`}>
            <StatusIcon className={`h-5 w-5 ${status.color}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estado</p>
            <p className="font-medium">{status.label}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monto en Disputa</p>
            <p className="font-medium">
              {dispute.currency} {dispute.amount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Iniciada por</p>
            <p className="font-medium">
              {dispute.initiatedBy === 'contractor' ? 'Contratista' : 'Empresa'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}