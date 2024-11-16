'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, PiggyBank, ArrowUpRight, TrendingUp, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface BalanceCardProps {
  balance: {
    available: number;
    pending: number;
    currency: string;
  };
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const handleWithdraw = () => {
    toast.info('Funcionalidad de retiro próximamente disponible');
  };

  return (
    <Card className="col-span-2 overflow-hidden">
      <div className="relative">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-cyan-500/20 to-transparent" />
        
        <div className="relative p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Saldo Disponible */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saldo Disponible</p>
                  <h3 className="text-2xl font-bold md:text-3xl">
                    {balance.currency} {balance.available.toLocaleString()}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleWithdraw}
                >
                  Retirar Fondos
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Último retiro hace 7 días</span>
                </div>
              </div>
            </div>

            {/* Saldo Pendiente */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <PiggyBank className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Próximo a Liberarse</p>
                  <h3 className="text-2xl font-bold md:text-3xl">
                    {balance.currency} {balance.pending.toLocaleString()}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Próximos pagos</span>
                  </div>
                  <span className="text-sm font-medium">Estado</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Desarrollo Frontend React</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <span className="text-muted-foreground">En revisión</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Consultoría DevOps</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">Aprobado</span>
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