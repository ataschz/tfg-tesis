'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wallet,
  LandmarkIcon,
  ArrowUpRight,
  TrendingUp,
  Eye,
  EyeOff,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { WithdrawalDialog } from './withdrawal-dialog';

interface UnifiedStatsProps {
  stats: {
    totalActiveContracts: number;
    totalPendingAmount: number;
    totalEscrowAmount: number;
    totalEarnedThisMonth: number;
    currency: string;
    userName?: string;
  };
}

export function UnifiedStats({ stats }: UnifiedStatsProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
  
  const totalBalance = stats.totalEarnedThisMonth + stats.totalEscrowAmount + stats.totalPendingAmount;

  const formatBalance = (amount: number) => {
    if (showBalance) {
      return amount.toLocaleString();
    }
    return '∗∗,∗∗∗';
  };

  return (
    <div className="space-y-6">
      {/* Saludo y descripción */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          ¡Hola, Ata Herrera{stats.userName ? `, ${stats.userName}` : ''}! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          Gestiona todos tus contratos, pagos y transacciones desde un solo lugar.
        </p>
      </div>

      {/* Tarjeta Principal */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Balance Total */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Wallet className="h-5 w-5" />
                  <span className="text-lg">Balance Total de la Cuenta</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="h-8 w-8 text-slate-400 hover:text-white"
                >
                  {showBalance ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-5xl font-bold text-white md:text-6xl">
                  {stats.currency} {formatBalance(totalBalance)}
                </h2>
                <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-sm text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+15%</span>
                </div>
              </div>
            </div>

            {/* Disponible y Botón de Retiro */}
            <div className="flex flex-col items-end gap-3">
              <p className="text-lg text-slate-400">
                Disponible para retirar:{' '}
                <span className="font-semibold text-white">
                  {stats.currency} {formatBalance(stats.totalEarnedThisMonth)}
                </span>
              </p>
              <Button 
                onClick={() => setShowWithdrawalDialog(true)} 
                size="lg"
                variant="secondary"
                className="h-12 gap-2 bg-white px-6 text-lg text-slate-900 hover:bg-slate-100"
              >
                <LandmarkIcon className="h-5 w-5" />
                Retirar Fondos
                <ArrowUpRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Indicadores */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Dinero en Escrow */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />
          <div className="relative p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <ShieldCheck className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Escrow</p>
                <p className="text-2xl font-bold">
                  {stats.currency} {formatBalance(stats.totalEscrowAmount)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Contratos Activos */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
          <div className="relative p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <FileText className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contratos Activos</p>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold">{stats.totalActiveContracts}</p>
                  <div className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-500">
                    <AlertTriangle className="h-3 w-3" />
                    <span>2 en disputa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Próximos a Liberar */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent" />
          <div className="relative p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10">
                <Clock className="h-6 w-6 text-violet-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próximos a Liberar</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {stats.currency} {formatBalance(stats.totalPendingAmount)}
                  </p>
                  <span className="text-xs text-muted-foreground">30d</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <WithdrawalDialog
        open={showWithdrawalDialog}
        onOpenChange={setShowWithdrawalDialog}
        availableAmount={stats.totalEarnedThisMonth}
        currency={stats.currency}
      />
    </div>
  );
}