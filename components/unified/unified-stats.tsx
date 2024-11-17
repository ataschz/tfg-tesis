'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  ShieldCheck, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  Wallet,
  LandmarkIcon,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface UnifiedStatsProps {
  stats: {
    totalActiveContracts: number;
    totalPendingAmount: number;
    totalEscrowAmount: number;
    totalEarnedThisMonth: number;
    currency: string;
  };
}

export function UnifiedStats({ stats }: UnifiedStatsProps) {
  const handleWithdraw = () => {
    toast.info('Funcionalidad de retiro próximamente disponible');
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-cyan-500/20 to-transparent" />
        
        <div className="relative p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Sección Principal - Balance y Retiro */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Balance Total Disponible</p>
                  <h3 className="text-3xl font-bold md:text-4xl">
                    {stats.currency} {stats.totalEarnedThisMonth.toLocaleString()}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-green-500">
                    <TrendingUp className="h-4 w-4" />
                    <span>+12% este mes</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleWithdraw}
                >
                  <LandmarkIcon className="h-4 w-4" />
                  Retirar Fondos
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span>Disponible para retiro inmediato sin comisiones</span>
                </div>
              </div>
            </div>

            {/* Sección de Métricas */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Contratos Activos */}
              <div className="rounded-lg border bg-card/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contratos Activos</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{stats.totalActiveContracts}</p>
                      <span className="text-xs text-muted-foreground">proyectos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fondos en Escrow */}
              <div className="rounded-lg border bg-card/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">En Escrow</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{stats.currency} {stats.totalEscrowAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagos Pendientes */}
              <div className="rounded-lg border bg-card/50 p-4 sm:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pagos Pendientes</p>
                        <p className="text-2xl font-bold">{stats.currency} {stats.totalPendingAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Próximos 30 días</p>
                        <p className="text-sm text-muted-foreground">3 pagos programados</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}