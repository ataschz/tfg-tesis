"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Eye,
  EyeOff,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Clock,
  CreditCard,
} from "lucide-react";
import { EthPriceMetric } from "@/components/ui/eth-price-metric";

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

  const isClient = stats.userType === "client";
  const totalBalance = stats.totalBalance;

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
            ? "Gestiona tus contratos y pagos. Valores mostrados en USD con respaldo de Ethereum."
            : "Gestiona todos tus trabajos e ingresos. Valores en USD, pagos procesados en Ethereum."}
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
              </div>
            </div>

            {/* Estadísticas ETH - Derecha */}
            <div className="flex flex-col items-end gap-3">
              <div className="text-slate-400 text-sm">Precio ETH Actual</div>
              <div className="bg-white/10 rounded-lg p-4">
                <EthPriceMetric />
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
                        ? totalBalance
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

    </div>
  );
}
