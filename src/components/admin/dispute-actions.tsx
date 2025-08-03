'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Loader2,
  UserPlus,
  Users,
  Building2,
} from 'lucide-react';

interface DisputeActionsProps {
  dispute: any;
  onResolve: (resolution: string, resolutionDetails: string, winnerId?: string) => Promise<void>;
  onAssignMediator: () => Promise<void>;
  isSubmitting: boolean;
}

export function DisputeActions({ 
  dispute,
  onResolve, 
  onAssignMediator,
  isSubmitting 
}: DisputeActionsProps) {

  const canAssignSelf = !dispute.mediatorId;
  const canResolve = dispute.status === 'open' || dispute.status === 'under_review';
  const isAssigned = dispute.mediatorId;


  const handleQuickResolve = async (party: 'contractor' | 'client') => {
    const winnerId = party === 'contractor' 
      ? dispute.contract.contractor.id 
      : dispute.contract.client.id;
    
    const resolution = party === 'contractor' ? 'completed' : 'refund';
    const resolutionDetails = party === 'contractor'
      ? 'El mediador ha determinado que el contratista ha cumplido satisfactoriamente con los términos del contrato. Se procede a completar el contrato y liberar el pago.'
      : 'El mediador ha determinado que el cliente tiene razón en su disputa. Se procede a realizar el reembolso correspondiente.';
    
    await onResolve(resolution, resolutionDetails, winnerId);
  };

  return (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Acciones de Mediación</h3>
          
          <div className="flex flex-col gap-3">
            {canAssignSelf && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={onAssignMediator}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Asignarme como Mediador
              </Button>
            )}
            
            {isAssigned && canResolve && (
              <div className="space-y-2">
                <Button
                  className="gap-2 w-full"
                  onClick={() => handleQuickResolve('contractor')}
                  disabled={isSubmitting}
                  variant="default"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                  Dar razón al Contratista
                </Button>
                
                <Button
                  className="gap-2 w-full"
                  onClick={() => handleQuickResolve('client')}
                  disabled={isSubmitting}
                  variant="secondary"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Building2 className="h-4 w-4" />
                  )}
                  Dar razón al Cliente
                </Button>
              </div>
            )}
            
            {!canResolve && dispute.status === 'resolved' && (
              <div className="text-sm text-muted-foreground bg-green-50 p-3 rounded">
                Esta disputa ya ha sido resuelta.
              </div>
            )}
          </div>
        </div>
      </Card>

    </>
  );
}