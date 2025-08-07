"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BalanceDisplayProps {
  ethAmount: number;
  title: string;
  subtitle: string;
  showBalance: boolean;
  onToggleBalance: () => void;
  className?: string;
}

export function BalanceDisplay({
  ethAmount,
  title,
  subtitle,
  showBalance,
  onToggleBalance,
  className,
}: BalanceDisplayProps) {
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [priceChange24h, setPriceChange24h] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch("/api/eth-price");
        if (response.ok) {
          const data = await response.json();
          if (data.usd) {
            setEthPrice(data.usd);
            setPriceChange24h(data.price_change_percentage_24h || null);
          }
        }
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatBalance = (amount: number, isUSD = false) => {
    if (!showBalance) {
      return isUSD ? "$∗∗,∗∗∗" : "∗.∗∗∗∗ ETH";
    }

    if (isUSD) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } else {
      return `${amount.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      })} ETH`;
    }
  };

  const usdValue = ethPrice ? ethAmount * ethPrice : 0;
  const isPositiveChange = priceChange24h && priceChange24h > 0;
  const isNegativeChange = priceChange24h && priceChange24h < 0;

  return (
    <div className={cn("text-center space-y-3", className)}>
      {/* Title and Toggle */}
      <div className="flex items-center justify-center gap-3">
        <h3 className="text-lg font-medium text-slate-400">{title}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleBalance}
          className="h-8 w-8 text-slate-400 hover:text-white"
        >
          {showBalance ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* USD Value - Primary Display */}
      <div className="space-y-2">
        {loading || !ethPrice ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            <span className="text-4xl font-bold text-white">Cargando...</span>
          </div>
        ) : (
          <>
            <h2 className="text-5xl font-bold text-white md:text-6xl ">
              {formatBalance(usdValue, true)}
            </h2>
            {showBalance && (
              <div className="flex items-center justify-center gap-3 text-slate-300">
                <span className="text-lg">
                  {formatBalance(ethAmount, false)}
                </span>
                {priceChange24h !== null && (
                  <span
                    className={cn(
                      "flex items-center gap-1 text-sm px-2 py-1 rounded-full",
                      isPositiveChange
                        ? "bg-green-500/20 text-green-400"
                        : isNegativeChange
                        ? "bg-red-500/20 text-red-400"
                        : "bg-slate-500/20 text-slate-400"
                    )}
                  >
                    {isPositiveChange && <TrendingUp className="h-3 w-3" />}
                    {isNegativeChange && <TrendingDown className="h-3 w-3" />}
                    {Math.abs(priceChange24h).toFixed(1)}% 24h
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Subtitle */}
      <p className="text-sm text-slate-400 max-w-md mx-auto">{subtitle}</p>

      {/* ETH Price Context */}
      {showBalance && ethPrice && (
        <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
          1 ETH = ${ethPrice.toLocaleString()} USD
          {priceChange24h !== null && (
            <span className="ml-2">
              ({priceChange24h > 0 ? "+" : ""}
              {priceChange24h.toFixed(2)}% hoy)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
