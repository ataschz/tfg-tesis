"use client";

import { Check, ChevronsUpDown, Mail, Search, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface ParticipantSelectorProps {
  type: "company" | "contractor";
  value: string[];
  onChange: (value: string[]) => void;
  contractors: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    contractorProfile?: {
      skills: string[];
      hourlyRate: string;
      bio: string;
    } | null;
  }>;
  clients: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    clientProfile?: {
      companyName: string;
      companyDescription: string;
      industry: string;
    } | null;
  }>;
}


export function ParticipantSelector({
  type,
  value,
  onChange,
  contractors,
  clients,
}: ParticipantSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "email">("search");

  // Transform and filter data based on type
  const transformedContractors = contractors.map(contractor => ({
    value: contractor.id,
    label: `${contractor.firstName} ${contractor.lastName}`,
    email: contractor.email,
  }));

  const transformedClients = clients.map(client => ({
    value: client.id,
    label: client.clientProfile?.companyName || `${client.firstName} ${client.lastName}`,
    email: client.email,
  }));

  // Only show relevant users based on selector type
  const items = type === "company" ? transformedClients : transformedContractors;
  const selectedItems = items.filter((item) => value.includes(item.value));

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = useCallback(
    (itemValue: string) => {
      const newValue = value.includes(itemValue)
        ? value.filter((v) => v !== itemValue)
        : [...value, itemValue];
      onChange(newValue);
    },
    [value, onChange]
  );

  const handleAddByEmail = useCallback(() => {
    if (emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      toast.info("Invitación enviada a " + emailInput);
      setEmailInput("");
    } else {
      toast.error("Por favor ingresa un email válido");
    }
  }, [emailInput]);

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
                ? `${selectedItems.length} seleccionado${
                    selectedItems.length > 1 ? "s" : ""
                  }`
                : `Seleccionar ${
                    type === "company" ? "empresas" : "contratistas"
                  }`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={`Buscar por nombre o email...`}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item.value)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            type === "company"
                              ? `https://avatar.vercel.sh/${item.label}`
                              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.label}`
                          }
                          alt={item.label}
                        />
                        <AvatarFallback>{item.label[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-medium">{item.label}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {item.email}
                        </p>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0",
                          value.includes(item.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <div
              key={item.value}
              className="flex items-center gap-2 rounded-lg border bg-card p-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={
                    type === "company"
                      ? `https://avatar.vercel.sh/${item.label}`
                      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.label}`
                  }
                  alt={item.label}
                />
                <AvatarFallback>{item.label[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">
                  {item.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleSelect(item.value)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
