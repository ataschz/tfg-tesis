"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsdPrimaryDisplayProps {
  ethAmount: number;
  className?: string;
  showChange?: boolean;
  size?: "sm" | "md" | "lg";
  showBalance?: boolean;
}

export function UsdPrimaryDisplay({ 
  ethAmount, 
  className, 
  showChange = false,
  size = "md",
  showBalance = true
}: UsdPrimaryDisplayProps) {
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

  if (loading || !ethPrice) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">Cargando...</span>
      </div>
    );
  }

  if (ethAmount === 0) {
    return null;
  }

  const usdValue = ethAmount * ethPrice;
  const formattedUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdValue);

  const formattedETH = ethAmount.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });

  const isPositiveChange = priceChange24h && priceChange24h > 0;
  const isNegativeChange = priceChange24h && priceChange24h < 0;

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl", 
    lg: "text-4xl md:text-5xl"
  };

  return (
    <div className={cn("space-y-1", className)}>
      {/* USD Value - Primary */}
      <div className={cn("font-bold", sizeClasses[size])}>
        {showBalance ? formattedUSD : "$∗∗,∗∗∗"}
      </div>
      
      {/* ETH Value - Secondary */}
      {showBalance && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formattedETH} ETH</span>
          {showChange && priceChange24h !== null && (
            <span className={cn(
              "flex items-center gap-1 text-xs",
              isPositiveChange ? 'text-green-600 dark:text-green-400' : 
              isNegativeChange ? 'text-red-600 dark:text-red-400' : 
              'text-muted-foreground'
            )}>
              {isPositiveChange && <TrendingUp className="h-3 w-3" />}
              {isNegativeChange && <TrendingDown className="h-3 w-3" />}
              {Math.abs(priceChange24h).toFixed(1)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}