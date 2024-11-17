'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DisputesFiltersProps {
  selectedStatus: string;
  selectedPriority: string;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

export function DisputesFilters({
  selectedStatus,
  selectedPriority,
  onStatusChange,
  onPriorityChange,
}: DisputesFiltersProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por contrato, empresa o contratista..."
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="in_progress">En Proceso</SelectItem>
              <SelectItem value="resolved">Resueltas</SelectItem>
              <SelectItem value="escalated">Escaladas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPriority} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las prioridades</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline" className="gap-2">
          Pendientes
          <span className="rounded-full bg-yellow-500/10 px-1.5 py-0.5 text-xs text-yellow-500">
            8
          </span>
        </Badge>
        <Badge variant="outline" className="gap-2">
          Alta Prioridad
          <span className="rounded-full bg-red-500/10 px-1.5 py-0.5 text-xs text-red-500">
            3
          </span>
        </Badge>
      </div>
    </Card>
  );
}