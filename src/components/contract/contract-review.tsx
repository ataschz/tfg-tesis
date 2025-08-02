'use client';

import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface ContractReviewProps {
  contract: any; // TODO: Add proper type
}

export function ContractReview({ contract }: ContractReviewProps) {
  return (
    <div className="divide-y p-6">
      <div className="space-y-4 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{contract.title}</h2>
          <Badge variant="outline">Pendiente de Revisión</Badge>
        </div>
        <p className="text-muted-foreground">{contract.description}</p>
      </div>

      <div className="space-y-6 py-6">
        <h3 className="font-semibold">Términos del Contrato</h3>
        <div className="prose prose-sm dark:prose-invert max-w-none" 
          dangerouslySetInnerHTML={{ __html: contract.content }} 
        />
      </div>

      <div className="space-y-6 pt-6">
        <h3 className="font-semibold">Entregables</h3>
        <div className="grid gap-4">
          {contract.deliverables.map((deliverable: any, index: number) => (
            <div
              key={index}
              className="rounded-lg border bg-card/50 p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="font-medium">{deliverable.title}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {deliverable.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}