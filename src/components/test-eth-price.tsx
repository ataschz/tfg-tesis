"use client";

import { useEthPrice } from "@/hooks/use-eth-price";

export function TestEthPrice() {
  const { usd, loading, error } = useEthPrice();

  return (
    <div style={{ 
      position: "fixed", 
      top: "10px", 
      right: "10px", 
      backgroundColor: "white", 
      padding: "10px", 
      border: "1px solid black",
      zIndex: 9999
    }}>
      <div>ETH Price Test:</div>
      {loading && <div>Loading...</div>}
      {error && <div style={{color: "red"}}>Error: {error}</div>}
      {usd > 0 && <div>Price: ${usd}</div>}
    </div>
  );
}