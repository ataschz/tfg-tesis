"use client";

import { useEffect, useState } from "react";

export function SimpleEthPrice({ amount }: { amount: number }) {
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        console.log("Fetching ETH price...");
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        const data = await response.json();
        console.log("ETH price data:", data);
        
        if (data.ethereum?.usd) {
          setEthPrice(data.ethereum.usd);
        }
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, []);

  if (loading) {
    return <span className="text-sm text-muted-foreground">(Cargando precio...)</span>;
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

  return (
    <div className="text-center">
      <div className="text-sm text-slate-300">≈ {formattedUSD}</div>
      <div className="text-xs text-slate-400">1 ETH = ${ethPrice.toLocaleString()}</div>
    </div>
  );
}