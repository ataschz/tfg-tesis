"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

type Dispute = {
  id: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  initiatedBy: string;
  contract: {
    id: string;
    title: string;
    amount: string;
    currency: string;
    client: {
      id: string;
      firstName: string;
      lastName: string;
      authUser?: { email: string };
      clientProfile?: { company?: string };
    };
    contractor: {
      id: string;
      firstName: string;
      lastName: string;
      authUser?: { email: string };
    };
  };
  initiator: {
    id: string;
    firstName: string;
    lastName: string;
    userType: string;
  };
  mediator?: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

const statusConfig = {
  open: {
    label: "Abierta",
    className: "bg-yellow-100 text-yellow-800",
  },
  under_review: {
    label: "En Revisión",
    className: "bg-blue-100 text-blue-800",
  },
  resolved: {
    label: "Resuelta",
    className: "bg-green-100 text-green-800",
  },
  closed: {
    label: "Cerrada",
    className: "bg-gray-100 text-gray-800",
  },
};

const reasonConfig = {
  trabajo_incompleto: "Trabajo Incompleto",
  calidad_insatisfactoria: "Calidad Insatisfactoria",
  incumplimiento_plazos: "Incumplimiento de Plazos",
  falta_de_pago: "Falta de Pago",
  cambios_no_autorizados: "Cambios No Autorizados",
  falta_de_comunicacion: "Falta de Comunicación",
  incumplimiento_contrato: "Incumplimiento de Contrato",
  otro: "Otro",
};

export const columns: ColumnDef<Dispute>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "contract.title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contrato
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const contract = row.original.contract;
      const clientName = contract.client.clientProfile?.company || 
        `${contract.client.firstName} ${contract.client.lastName}`;
      const contractorName = `${contract.contractor.firstName} ${contract.contractor.lastName}`;

      return (
        <div className="space-y-1">
          <div className="font-medium">{contract.title}</div>
          <div className="text-xs text-muted-foreground">
            {clientName} → {contractorName}
          </div>
          <div className="text-xs text-muted-foreground">
            {contract.currency} {Number(contract.amount).toLocaleString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Motivo",
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;
      return (
        <Badge variant="outline">
          {reasonConfig[reason as keyof typeof reasonConfig] || reason}
        </Badge>
      );
    },
  },
  {
    accessorKey: "initiator",
    header: "Iniciado por",
    cell: ({ row }) => {
      const initiator = row.original.initiator;
      const initiatedBy = row.original.initiatedBy;
      
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://avatar.vercel.sh/${initiator.firstName}`} />
            <AvatarFallback>
              {initiator.firstName[0]}{initiator.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">
              {initiator.firstName} {initiator.lastName}
            </div>
            <div className="text-xs text-muted-foreground capitalize">
              {initiatedBy}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const config = statusConfig[status as keyof typeof statusConfig];
      
      return (
        <Badge className={config?.className}>
          {config?.label || status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "mediator",
    header: "Mediador",
    cell: ({ row }) => {
      const mediator = row.original.mediator;
      
      if (!mediator) {
        return (
          <span className="text-xs text-muted-foreground">Sin asignar</span>
        );
      }
      
      return (
        <div className="text-sm">
          {mediator.firstName} {mediator.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm">
          {format(date, "dd/MM/yyyy", { locale: es })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const dispute = row.original;

      return <DisputeRowActions dispute={dispute} />;
    },
  },
];

function DisputeRowActions({ dispute }: { dispute: Dispute }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(dispute.id)}
        >
          Copiar ID de disputa
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/admin/disputes/${dispute.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver detalles
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DisputesDataTableProps {
  disputes: Dispute[];
}

export function DisputesDataTable({ disputes }: DisputesDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: disputes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por título de contrato..."
          value={(table.getColumn("contract_title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("contract_title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay disputas para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}