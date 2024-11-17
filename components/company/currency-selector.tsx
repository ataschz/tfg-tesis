'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Banknote, Bitcoin, DollarSign, Euro } from "lucide-react";

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const currencies = [
  { value: "USD", label: "USD - Dólar Estadounidense", icon: DollarSign },
  { value: "EUR", label: "EUR - Euro", icon: Euro },
  { value: "BTC", label: "BTC - Bitcoin", icon: Bitcoin },
  { value: "USDT", label: "USDT - Tether", icon: Banknote },
  { value: "USDC", label: "USDC - USD Coin", icon: Banknote },
];

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona una moneda" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.value} value={currency.value}>
            <div className="flex items-center gap-2">
              <currency.icon className="h-4 w-4" />
              <span>{currency.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}