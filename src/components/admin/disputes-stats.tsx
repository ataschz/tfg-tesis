'use client';

import { Card } from '@/components/ui/card';
import { 
  Scale,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

interface DisputesStatsProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    escalated: number;
  };
}

export function DisputesStats({ stats }: DisputesStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{stats.pending}</p>
              <span className="text-xs text-muted-foreground">disputas</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Scale className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">En Proceso</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{stats.inProgress}</p>
              <span className="text-xs text-muted-foreground">casos</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Resueltas</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{stats.resolved}</p>
              <span className="text-xs text-muted-foreground">disputas</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Escaladas</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{stats.escalated}</p>
              <span className="text-xs text-muted-foreground">casos</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}