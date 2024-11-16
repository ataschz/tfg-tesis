'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  FileText,
  ArrowUpRight,
  TrendingUp 
} from 'lucide-react';
import { toast } from 'sonner';

interface StatsCardsProps {
  stats: {
    escrowAmount: number;
    upcomingPayments: number;
    activeContracts: number;
    currency: string;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const handleWithdraw = () => {
    toast.info('Funcionalidad de retiro próximamente disponible');
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-2 overflow-hidden">
        <div className="relative">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-cyan-500/20 to-transparent" />
          
          <div className="relative grid gap-6 p-6 md:grid-cols-3 md:p-8">
            {/* Fondos en Escrow */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fondos en Escrow</p>
                  <h3 className="text-2xl font-bold">
                    {stats.currency} {stats.escrowAmount.toLocaleString()}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>Protegido por Smart Contracts</span>
              </div>
            </div>

            {/* Pagos Próximos */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pagos Próximos</p>
                  <h3 className="text-2xl font-bold">
                    {stats.currency} {stats.upcomingPayments.toLocaleString()}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>En los próximos 30 días</span>
              </div>
            </div>

            {/* Contratos Activos */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <FileText className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contratos Activos</p>
                  <h3 className="text-2xl font-bold">{stats.activeContracts}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>Gestionados actualmente</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}