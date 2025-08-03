"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Clock,
  Plus,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { WithdrawalDialog } from "./withdrawal-dialog";

interface ClientStats {
  userType: "client";
  totalBalance: number;
  totalWithdrawableAmount: number;
  totalInDisputeAmount: number;
  totalActiveContracts: number;
  totalInDisputeContracts: number;
  currency: string;
  userName: string;
}

interface ContractorStats {
  userType: "contractor";
  totalBalance: number;
  totalAvailableAmount: number;
  totalInProgressAmount: number;
  totalInDisputeAmount: number;
  totalActiveContracts: number;
  totalInDisputeContracts: number;
  currency: string;
  userName: string;
}

interface UnifiedStatsProps {
  stats: ClientStats | ContractorStats;
}

export function UnifiedStats({ stats }: UnifiedStatsProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
  const [showFundDialog, setShowFundDialog] = useState(false);

  const isClient = stats.userType === "client";
  const totalBalance = stats.totalBalance;
  const withdrawableAmount = isClient
    ? stats.totalWithdrawableAmount
    : stats.totalAvailableAmount;

  const formatBalance = (amount: number) => {
    if (showBalance) {
      return amount.toLocaleString();
    }
    return "∗∗,∗∗∗";
  };

  return (
    <div className="space-y-6">
      {/* Saludo y descripción */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          ¡Hola{stats.userName ? `, ${stats.userName}` : ""}! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          {isClient
            ? "Gestiona tus contratos, pagos y fondea tu cuenta desde un solo lugar."
            : "Gestiona todos tus trabajos, ingresos y retiros desde un solo lugar."}
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
                  <span className="text-lg">
                    {isClient
                      ? "Balance Total de la Cuenta"
                      : "Balance de Ganancias"}
                  </span>
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
                {/* Removed hardcoded percentage */}
              </div>
            </div>

            {/* Disponible y Botones */}
            <div className="flex flex-col items-end gap-3">
              <p className="text-lg text-slate-400">
                {isClient
                  ? "Disponible para retirar:"
                  : "Disponible para retirar:"}{" "}
                <span className="font-semibold text-white">
                  {stats.currency} {formatBalance(withdrawableAmount)}
                </span>
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                {isClient && (
                  <Button
                    onClick={() => setShowFundDialog(true)}
                    size="lg"
                    variant="outline"
                    className="h-12 gap-2 border-white/20 bg-transparent px-6 text-lg text-white hover:bg-white/10"
                  >
                    <Plus className="h-5 w-5" />
                    Fondear Cuenta
                  </Button>
                )}
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
                <p className="text-sm text-muted-foreground">En Disputa</p>
                <p className="text-2xl font-bold">
                  {stats.currency} {formatBalance(stats.totalInDisputeAmount)}
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
                <p className="text-sm text-muted-foreground">
                  Contratos Activos
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold">
                    {stats.totalActiveContracts}
                  </p>
                  {stats.totalInDisputeContracts > 0 && (
                    <div className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-500">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{stats.totalInDisputeContracts} en disputa</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Próximos a Liberar / En Progreso */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent" />
          <div className="relative p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10">
                {isClient ? (
                  <CreditCard className="h-6 w-6 text-violet-500" />
                ) : (
                  <Clock className="h-6 w-6 text-violet-500" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {isClient ? "Comprometido" : "En Progreso"}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {stats.currency}{" "}
                    {formatBalance(
                      isClient
                        ? totalBalance - withdrawableAmount
                        : (stats as ContractorStats).totalInProgressAmount
                    )}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {isClient ? "En contratos activos" : "Aceptados + En curso"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <WithdrawalDialog
        open={showWithdrawalDialog}
        onOpenChange={setShowWithdrawalDialog}
        availableAmount={withdrawableAmount}
        currency={stats.currency}
      />

      {/* Fund Account Dialog - Only for clients */}
      {isClient && showFundDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Fondear Cuenta</h3>
            <p className="text-muted-foreground mb-4">
              Esta funcionalidad estará disponible próximamente. Podrás agregar
              fondos a tu cuenta para financiar contratos.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowFundDialog(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
