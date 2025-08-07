"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function EthPriceMetric() {
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

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-lg text-white font-bold">Cargando...</span>
      </div>
    );
  }

  if (!ethPrice) {
    return (
      <div className="text-lg font-bold text-white text-muted-foreground">
        No disponible
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(ethPrice);

  const isPositive = priceChange24h && priceChange24h > 0;
  const isNegative = priceChange24h && priceChange24h < 0;

  return (
    <div>
      <div className="text-lg text-white font-bold">{formattedPrice}</div>
      {priceChange24h !== null && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs",
            isPositive
              ? "text-green-600 dark:text-green-400"
              : isNegative
              ? "text-red-600 dark:text-red-400"
              : "text-muted-foreground"
          )}
        >
          {isPositive && <TrendingUp className="h-3 w-3" />}
          {isNegative && <TrendingDown className="h-3 w-3" />}
          {isPositive ? "+" : ""}
          {priceChange24h.toFixed(1)}% 24h
        </div>
      )}
    </div>
  );
}
