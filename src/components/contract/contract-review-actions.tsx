'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle2, 
  XCircle,
  Loader2
} from 'lucide-react';

interface ContractReviewActionsProps {
  onAccept: () => void;
  onReject: () => void;
  isSubmitting: boolean;
}

export function ContractReviewActions({ 
  onAccept, 
  onReject,
  isSubmitting 
}: ContractReviewActionsProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          className="gap-2"
          onClick={onReject}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive" />
          )}
          Rechazar Contrato
        </Button>
        <Button
          className="gap-2"
          onClick={onAccept}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          Aceptar y Firmar
        </Button>
      </div>
    </Card>
  );
}