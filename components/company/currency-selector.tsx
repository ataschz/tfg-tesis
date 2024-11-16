'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const currencies = [
  { value: "USD", label: "USD - Dólar Estadounidense" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "BTC", label: "BTC - Bitcoin" },
  { value: "USDT", label: "USDT - Tether" },
  { value: "USDC", label: "USDC - USD Coin" },
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
            {currency.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}