'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2,
  UserPlus,
  Users,
  Building2,
  AlertCircle,
  Wallet,
} from 'lucide-react';
import { useMetaMask } from '@/hooks/useMetaMask';
import { toast } from 'sonner';
import { useState } from 'react';

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

  const [isResolvingContractor, setIsResolvingContractor] = useState(false);
  const [isResolvingClient, setIsResolvingClient] = useState(false);
  const metaMask = useMetaMask();

  const canAssignSelf = !dispute.mediatorId;
  const canResolve = dispute.status === 'open' || dispute.status === 'under_review';
  const isAssigned = dispute.mediatorId;


  const handleMetaMaskResolve = async (party: 'contractor' | 'client') => {
    if (!dispute.contract.blockchainContractId) {
      toast.error('Este contrato no tiene un ID de blockchain válido');
      return;
    }

    const isContractor = party === 'contractor';
    const setLoading = isContractor ? setIsResolvingContractor : setIsResolvingClient;
    
    setLoading(true);
    try {
      // First connect to MetaMask if not connected
      if (!metaMask.isConnected) {
        await metaMask.connect();
        if (!metaMask.isConnected) {
          toast.error('No se pudo conectar a MetaMask');
          return;
        }
      }

      toast.loading(`Resolviendo disputa a favor del ${isContractor ? 'freelancer' : 'empresa'}...`);

      // Get the escrow manager address from environment
      const escrowManagerAddress = process.env.NEXT_PUBLIC_ESCROW_MANAGER_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

      // Resolve the dispute - favorBuyer = true means client wins, false means contractor wins
      const favorBuyer = !isContractor; // contractor wins = false, client wins = true
      
      const success = await metaMask.resolveDispute(
        escrowManagerAddress,
        dispute.contract.blockchainContractId,
        favorBuyer
      );

      if (success) {
        toast.success(`¡Disputa resuelta a favor del ${isContractor ? 'freelancer' : 'empresa'}! Los fondos han sido liberados.`);
        
        // Now call the backend to update database status
        // Get the userProfile IDs for the winner
        const winnerId = isContractor 
          ? dispute.contract.contractor?.id 
          : dispute.contract.client?.id;
        
        const resolution = isContractor ? 'completed' : 'refund';
        const resolutionDetails = isContractor
          ? 'El mediador ha determinado que el freelancer ha cumplido satisfactoriamente con los términos del contrato. Se procede a completar el contrato y liberar el pago.'
          : 'El mediador ha determinado que la empresa tiene razón en su disputa. Se procede a realizar el reembolso correspondiente.';
        
        await onResolve(resolution, resolutionDetails, winnerId);
        
        // Refresh the page to show updated status
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error(metaMask.error || 'Error al resolver la disputa');
      }
    } catch (error) {
      toast.error('Error inesperado al procesar la resolución de disputa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Acciones de Mediación</h3>
          
          {/* MetaMask Configuration Alert */}
          {isAssigned && canResolve && !metaMask.isAvailable && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                MetaMask no está instalado. <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="underline">Instálalo aquí</a> para resolver disputas.
              </AlertDescription>
            </Alert>
          )}
          
          {/* MetaMask Connection Status */}
          {isAssigned && canResolve && metaMask.isAvailable && (
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Configuración MetaMask requerida:</strong>
                <br />• Red: Hardhat Local (http://127.0.0.1:8545, Chain ID: 1337)
                <br />• Cuenta Admin: Account 2 de Hardhat
                {metaMask.isConnected && (
                  <>
                    <br />✅ Conectado: {metaMask.account?.slice(0, 6)}...{metaMask.account?.slice(-4)}
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {metaMask.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{metaMask.error}</AlertDescription>
            </Alert>
          )}
          
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
                  onClick={() => handleMetaMaskResolve('contractor')}
                  disabled={isResolvingContractor || isResolvingClient || !metaMask.isAvailable}
                  variant="default"
                >
                  {isResolvingContractor ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resolviendo...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4" />
                      Dar razón al Freelancer
                    </>
                  )}
                </Button>
                
                <Button
                  className="gap-2 w-full"
                  onClick={() => handleMetaMaskResolve('client')}
                  disabled={isResolvingContractor || isResolvingClient || !metaMask.isAvailable}
                  variant="secondary"
                >
                  {isResolvingClient ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resolviendo...
                    </>
                  ) : (
                    <>
                      <Building2 className="h-4 w-4" />
                      Dar razón a la Empresa
                    </>
                  )}
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