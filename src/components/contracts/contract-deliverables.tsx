"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface ContractDeliverablesProps {
  deliverables: string[];
}

export function ContractDeliverables({ deliverables }: ContractDeliverablesProps) {
  if (!deliverables || deliverables.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Entregables
        </h3>
        <p className="text-muted-foreground text-center py-4">
          No se han especificado entregables para este contrato.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Package className="h-5 w-5" />
        Entregables ({deliverables.length})
      </h3>
      
      <div className="space-y-3">
        {deliverables.map((deliverable, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 mt-1">
              <span className="text-xs font-medium text-primary">{index + 1}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed">{deliverable}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}