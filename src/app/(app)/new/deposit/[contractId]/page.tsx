'use client';

import { initializeBlockchainContract } from '@/lib/actions/contracts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, ExternalLink, Wallet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useMetaMask } from '@/hooks/useMetaMask';

interface DepositPageProps {
  params: { contractId: string };
}

interface ContractData {
  escrowManagerAddress: string;
  totalAmount: string;
  contractId: string;
}

export default function DepositPage({ params }: DepositPageProps) {
  const router = useRouter();
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCheckingDeposit, setIsCheckingDeposit] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const metaMask = useMetaMask();

  const initializeContract = useCallback(async () => {
    setIsInitializing(true);
    setError(null);

    try {
      const result = await initializeBlockchainContract(params.contractId);

      if (result.success) {
        setContractData({
          escrowManagerAddress: result.escrowManagerAddress || '',
          totalAmount: result.totalAmount || '0',
          contractId: result.contractId || params.contractId,
        });
        toast.success(result.message || 'Contrato inicializado correctamente');
      } else {
        setError(result.error || 'Error al inicializar el contrato');
        toast.error(result.error || 'Error al inicializar el contrato');
      }
    } catch (error) {
      const errorMsg = 'Error inesperado al inicializar el contrato';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsInitializing(false);
    }
  }, [params.contractId]);

  useEffect(() => {
    initializeContract();
  }, [initializeContract]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const checkDeposit = async () => {
    if (!contractData) return;

    setIsCheckingDeposit(true);
    try {
      const response = await fetch(`/api/contracts/${params.contractId}/check-deposit`);
      const result = await response.json();

      if (result.success) {
        if (result.hasDeposit) {
          toast.success('¡Depósito detectado! Redirigiendo...');
          router.push('/dashboard');
        } else {
          toast.info('Depósito aún no detectado. Inténtalo de nuevo en unos momentos.');
        }
      } else {
        toast.error(result.error || 'Error al verificar el depósito');
      }
    } catch (error) {
      toast.error('Error al verificar el depósito');
    } finally {
      setIsCheckingDeposit(false);
    }
  };

  const handleMetaMaskDeposit = async () => {
    if (!contractData) return;

    setIsDepositing(true);
    try {
      // First connect to MetaMask if not connected
      if (!metaMask.isConnected) {
        await metaMask.connect();
        if (!metaMask.isConnected) {
          toast.error('No se pudo conectar a MetaMask');
          return;
        }
      }

      toast.loading('Procesando depósito...');

      // Make the deposit
      const success = await metaMask.makeDeposit(
        contractData.escrowManagerAddress,
        contractData.contractId,
        contractData.totalAmount
      );

      if (success) {
        toast.success('¡Depósito realizado exitosamente!');
        
        // Wait a moment for the blockchain to process, then check
        setTimeout(async () => {
          await checkDeposit();
        }, 2000);
      } else {
        toast.error(metaMask.error || 'Error al realizar el depósito');
      }
    } catch (error) {
      toast.error('Error inesperado al procesar el depósito');
    } finally {
      setIsDepositing(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Inicializando contrato...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Estamos preparando tu contrato en la blockchain. Esto puede tomar unos momentos.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error al inicializar contrato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={initializeContract} variant="outline">
                Reintentar
              </Button>
              <Button onClick={() => router.push('/dashboard')} variant="secondary">
                Volver al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!contractData) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Realizar Depósito</h1>
        <p className="text-lg text-muted-foreground">
          Para activar tu contrato, debes depositar {contractData.totalAmount} ETH en el contrato de escrow.
        </p>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Wallet className="h-3 w-3" />
          Esperando depósito
        </Badge>
      </div>

      {/* MetaMask Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🦊 Depósito con MetaMask
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!metaMask.isAvailable ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                MetaMask no está instalado. <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="underline">Instálalo aquí</a> para usar esta opción.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Configuración necesaria:</strong>
                  <br />• Red: Hardhat Local (http://127.0.0.1:8545, Chain ID: 1337)
                  <br />• Wallet: Importar cuenta con private key de Hardhat
                </AlertDescription>
              </Alert>
              
              {metaMask.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{metaMask.error}</AlertDescription>
                </Alert>
              )}
              
              <div className="text-sm text-muted-foreground">
                {!metaMask.isConnected ? (
                  <p>Conecta tu MetaMask para realizar el depósito automáticamente.</p>
                ) : (
                  <p>✅ Conectado: {metaMask.account?.slice(0, 6)}...{metaMask.account?.slice(-4)}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleMetaMaskDeposit}
                  disabled={isDepositing || metaMask.isConnecting}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  {isDepositing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : metaMask.isConnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wallet className="h-4 w-4" />
                  )}
                  {isDepositing ? 'Procesando...' : 
                   metaMask.isConnecting ? 'Conectando...' :
                   !metaMask.isConnected ? 'Conectar y Depositar' : 
                   'Depositar con MetaMask'}
                </Button>
                
                {metaMask.isConnected && (
                  <Button variant="outline" onClick={metaMask.disconnect}>
                    Desconectar
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instrucciones de depósito manual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Depósito Manual (Alternativo)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Si prefieres no usar MetaMask, puedes transferir manualmente <strong>{contractData.totalAmount} ETH</strong> a la 
              dirección del contrato usando cualquier wallet. Luego usa "Verificar Depósito" para confirmar.
            </AlertDescription>
          </Alert>

          {/* Información del contrato */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dirección del Contrato Escrow</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                  {contractData.escrowManagerAddress}
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(contractData.escrowManagerAddress, 'Dirección del contrato')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Monto a Depositar</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded-md font-mono text-sm">
                  {contractData.totalAmount} ETH
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(contractData.totalAmount, 'Monto')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ID del Contrato</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                  {contractData.contractId}
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(contractData.contractId, 'ID del contrato')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Pasos para depositar */}
          <div className="space-y-4">
            <h3 className="font-semibold">Pasos para realizar el depósito:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Abre tu wallet de Ethereum (MetaMask, Trust Wallet, etc.)</li>
              <li>Envía exactamente <strong>{contractData.totalAmount} ETH</strong> a la dirección del contrato</li>
              <li>Asegúrate de incluir suficiente gas para la transacción</li>
              <li>Una vez enviado, haz clic en "Verificar Depósito" para continuar</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Acciones adicionales */}
      <div className="flex gap-4 flex-wrap">
        <Button 
          onClick={checkDeposit} 
          disabled={isCheckingDeposit}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isCheckingDeposit ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          {isCheckingDeposit ? 'Verificando...' : 'Verificar Depósito Manual'}
        </Button>
        
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Volver al Dashboard
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => window.open(`https://etherscan.io/address/${contractData.escrowManagerAddress}`, '_blank')}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Ver Contrato
        </Button>
      </div>
    </div>
  );
}