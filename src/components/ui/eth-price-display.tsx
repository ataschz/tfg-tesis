"use client";

import { useEthPrice } from "@/hooks/use-eth-price";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EthPriceDisplayProps {
  amount: number;
  className?: string;
  showIcon?: boolean;
  variant?: "inline" | "block";
}

export function EthPriceDisplay({ 
  amount, 
  className, 
  showIcon = true,
  variant = "inline" 
}: EthPriceDisplayProps) {
  const { usd: ethPriceUSD, loading, error } = useEthPrice();

  if (loading) {
    return (
      <div className={cn("flex items-center gap-1 text-muted-foreground", className)}>
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="text-sm">Cargando precio...</span>
      </div>
    );
  }

  if (error) {
    // Show error in development
    if (process.env.NODE_ENV === "development") {
      return (
        <div className={cn("text-xs text-red-500", className)}>
          Error: {error}
        </div>
      );
    }
    return null;
  }

  if (!ethPriceUSD) {
    return null;
  }

  // Don't show price conversion for zero amounts
  if (amount === 0) {
    return null;
  }

  const usdValue = amount * ethPriceUSD;
  const formattedUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdValue);

  const formattedETHPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(ethPriceUSD);

  if (variant === "block") {
    return (
      <div className={cn("space-y-1", className)}>
        <div className="text-sm text-muted-foreground">
          ≈ {formattedUSD}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {showIcon && <TrendingUp className="h-3 w-3" />}
          <span>1 ETH = {formattedETHPrice}</span>
        </div>
      </div>
    );
  }

  return (
    <span className={cn("text-sm text-muted-foreground", className)}>
      (≈ {formattedUSD})
    </span>
  );
}