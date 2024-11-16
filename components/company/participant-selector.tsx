'use client';

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ParticipantSelectorProps {
  type: 'company' | 'contractor';
  value: string[];
  onChange: (value: string[]) => void;
}

const mockCompanies = [
  { value: "comp_01", label: "TechSolutions SA" },
  { value: "comp_02", label: "InnovateMX" },
  { value: "comp_03", label: "DigitalCO" },
];

const mockContractors = [
  { value: "cont_01", label: "Ana García" },
  { value: "cont_02", label: "Carlos Rodríguez" },
  { value: "cont_03", label: "María López" },
];

export function ParticipantSelector({ type, value, onChange }: ParticipantSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const items = type === 'company' ? mockCompanies : mockContractors;
  const selectedItems = items.filter(item => value.includes(item.value));

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (itemValue: string) => {
    const newValue = value.includes(itemValue)
      ? value.filter(v => v !== itemValue)
      : [...value, itemValue];
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedItems.length > 0
                ? `${selectedItems.length} seleccionado${selectedItems.length > 1 ? 's' : ''}`
                : `Seleccionar ${type === 'company' ? 'empresas' : 'contratistas'}`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder={`Buscar ${type === 'company' ? 'empresa' : 'contratista'}...`}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => handleSelect(item.value)}
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value.includes(item.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <Badge
              key={item.value}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleSelect(item.value)}
            >
              {item.label}
              <Check className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}