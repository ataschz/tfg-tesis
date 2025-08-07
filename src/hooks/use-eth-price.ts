"use client";

import { useState, useEffect } from "react";

interface EthPrice {
  usd: number;
  loading: boolean;
  error: string | null;
}

export function useEthPrice(): EthPrice {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);

        // Using CoinGecko's free API
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
          {
            method: "GET",
            headers: {
              "Accept": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (process.env.NODE_ENV === "development") {
          console.log("ETH Price API response:", data);
        }
        
        if (isMounted && data.ethereum?.usd) {
          setPrice(data.ethereum.usd);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Error fetching ETH price");
          console.error("Error fetching ETH price:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrice();

    // Refresh price every 5 minutes
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return {
    usd: price,
    loading,
    error,
  };
}