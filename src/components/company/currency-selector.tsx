'use client';

import { Badge } from "@/components/ui/badge";
import { Banknote } from "lucide-react";

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  // Solo ETH está disponible
  if (value !== 'ETH') {
    onChange('ETH');
  }

  return (
    <Badge variant="outline" className="flex items-center gap-2 w-fit px-3 py-2">
      <Banknote className="h-4 w-4" />
      <span>ETH - Ethereum</span>
    </Badge>
  );
}