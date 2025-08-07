"use client";

import { useEffect, useState } from "react";

export function InternalEthPrice({ amount }: { amount: number }) {
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [priceChange24h, setPriceChange24h] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        console.log("Fetching ETH price from internal API...");
        const response = await fetch("/api/eth-price");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("ETH price response:", data);
        
        if (data.usd) {
          setEthPrice(data.usd);
          setPriceChange24h(data.price_change_percentage_24h || null);
        } else if (data.error) {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error("Error fetching ETH price:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <span className="text-sm text-slate-300">(Cargando precio...)</span>;
  }

  if (error) {
    // Show error in development
    if (process.env.NODE_ENV === "development") {
      return <span className="text-xs text-red-400">Error: {error}</span>;
    }
    return null;
  }

  if (!ethPrice || amount === 0) {
    return null;
  }

  const usdValue = amount * ethPrice;
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
  }).format(ethPrice);

  const isPositiveChange = priceChange24h && priceChange24h > 0;
  const isNegativeChange = priceChange24h && priceChange24h < 0;

  return (
    <div className="text-center space-y-1">
      <div className="text-sm text-slate-300">≈ {formattedUSD}</div>
      <div className="flex items-center justify-center gap-2 text-xs">
        <span className="text-slate-400">1 ETH = {formattedETHPrice}</span>
        {priceChange24h !== null && (
          <span className={`flex items-center gap-1 ${
            isPositiveChange ? 'text-green-400' : 
            isNegativeChange ? 'text-red-400' : 
            'text-slate-400'
          }`}>
            {isPositiveChange && '▲'}
            {isNegativeChange && '▼'}
            {Math.abs(priceChange24h).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}