"use client";

import { useState } from "react";
import { ContractCard } from "@/components/unified/contract-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ContractListProps {
  contracts: any[];
  type: "received" | "sent";
}

export function ContractList({ contracts, type }: ContractListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const safeContracts = contracts || [];

  // Define status options based on contract type
  const getStatusOptions = () => {
    const commonStatuses = [
      { value: "all", label: "Todos los estados" },
      { value: "in_dispute", label: "En Disputa" },
      { value: "cancelled", label: "Cancelados" },
      { value: "completed", label: "Completados" },
      { value: "in_progress", label: "En Proceso" },
      { value: "rejected", label: "Rechazados" },
      { value: "accepted", label: "Aceptados" },
    ];

    if (type === "sent") {
      // For sent contracts, add "Enviados" status
      return [
        ...commonStatuses,
        { value: "sent", label: "Enviados" },
      ];
    } else {
      // For received contracts, add "Recibidos" status (maps to "sent" in DB)
      return [
        ...commonStatuses,
        { value: "sent", label: "Recibidos" },
      ];
    }
  };

  const statusOptions = getStatusOptions();

  const filteredContracts = safeContracts.filter((contract) => {
    const matchesSearch =
      contract?.title?.toLowerCase().includes(search.toLowerCase()) ||
      contract?.description?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || contract?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">
          {type === "received" ? "Contratos Recibidos" : "Contratos Enviados"}
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar contratos..."
              className="w-full pl-8 sm:w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredContracts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            {search || statusFilter !== "all"
              ? "No se encontraron contratos con los filtros actuales"
              : "No hay contratos disponibles"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredContracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} type={type} />
          ))}
        </div>
      )}
    </div>
  );
}
