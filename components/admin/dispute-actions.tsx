'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface DisputeActionsProps {
  onResolve: (resolution: string) => Promise<void>;
  onEscalate: (reason: string) => Promise<void>;
  isSubmitting: boolean;
}

export function DisputeActions({ 
  onResolve, 
  onEscalate,
  isSubmitting 
}: DisputeActionsProps) {
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showEscalateDialog, setShowEscalateDialog] = useState(false);
  const [resolution, setResolution] = useState('');
  const [escalationReason, setEscalationReason] = useState('');

  const handleResolve = async () => {
    await onResolve(resolution);
    setShowResolveDialog(false);
    setResolution('');
  };

  const handleEscalate = async () => {
    await onEscalate(escalationReason);
    setShowEscalateDialog(false);
    setEscalationReason('');
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowEscalateDialog(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
            Escalar Disputa
          </Button>
          <Button
            className="gap-2"
            onClick={() => setShowResolveDialog(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Resolver Disputa
          </Button>
        </div>
      </Card>

      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolver Disputa</DialogTitle>
            <DialogDescription>
              Describe la resolución y las acciones tomadas para resolver esta disputa.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Detalla la resolución..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResolveDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleResolve}
              disabled={isSubmitting || !resolution.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Confirmar Resolución
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEscalateDialog} onOpenChange={setShowEscalateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escalar Disputa</DialogTitle>
            <DialogDescription>
              Explica por qué esta disputa necesita ser escalada a un nivel superior.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Motivo de escalación..."
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEscalateDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEscalate}
              disabled={isSubmitting || !escalationReason.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="mr-2 h-4 w-4" />
              )}
              Confirmar Escalación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}