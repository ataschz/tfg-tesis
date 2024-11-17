'use client';

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
  type: 'company' | 'contractor';
  value: string[];
  onChange: (value: string[]) => void;
}

const mockCompanies = [
  { value: "comp_01", label: "TechSolutions SA", email: "rrhh@techsolutions.com" },
  { value: "comp_02", label: "InnovateMX", email: "talent@innovatemx.com" },
  { value: "comp_03", label: "DigitalCO", email: "hr@digitalco.co" },
];

const mockContractors = [
  { value: "cont_01", label: "Ana García", email: "ana.garcia@gmail.com" },
  { value: "cont_02", label: "Carlos Rodríguez", email: "carlos.rodriguez@outlook.com" },
  { value: "cont_03", label: "María López", email: "maria.lopez@yahoo.com" },
];

export function ParticipantSelector({ type, value, onChange }: ParticipantSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "email">("search");
  
  const items = type === 'company' ? mockCompanies : mockContractors;
  const selectedItems = items.filter(item => value.includes(item.value));

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = useCallback((itemValue: string) => {
    const newValue = value.includes(itemValue)
      ? value.filter(v => v !== itemValue)
      : [...value, itemValue];
    onChange(newValue);
  }, [value, onChange]);

  const handleAddByEmail = useCallback(() => {
    if (emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      toast.info('Invitación enviada a ' + emailInput);
      setEmailInput('');
    } else {
      toast.error('Por favor ingresa un email válido');
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
                ? `${selectedItems.length} seleccionado${selectedItems.length > 1 ? 's' : ''}`
                : `Seleccionar ${type === 'company' ? 'empresas' : 'contratistas'}`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "search" | "email")}>
            <div className="border-b px-3">
              <TabsList className="w-full">
                <TabsTrigger value="search" className="flex-1">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </TabsTrigger>
                <TabsTrigger value="email" className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Invitar por Email
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="search" className="p-0">
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
                              src={type === 'company' 
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
                              value.includes(item.value) ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </TabsContent>

            <TabsContent value="email" className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="nombre@empresa.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <Button 
                    type="button"
                    onClick={handleAddByEmail}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Se enviará una invitación al email proporcionado
                </p>
              </div>
            </TabsContent>
          </Tabs>
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
                  src={type === 'company' 
                    ? `https://avatar.vercel.sh/${item.label}`
                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.label}`
                  } 
                  alt={item.label} 
                />
                <AvatarFallback>{item.label[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.email}</span>
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