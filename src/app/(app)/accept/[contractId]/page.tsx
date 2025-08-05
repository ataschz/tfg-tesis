'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Wallet,
  Loader2,
  FileText,
  Calendar,
  DollarSign,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface AcceptContractPageProps {
  params: { contractId: string };
}

export default function AcceptContractPage({ params }: AcceptContractPageProps) {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Mock contract data - en implementación real, esto vendría de una API
  const contractData = {
    id: params.contractId,
    title: 'Desarrollo de Aplicación Web',
    description: 'Desarrollo completo de una aplicación web con React y Node.js',
    amount: '2.5',
    currency: 'ETH',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    client: {
      name: 'Tech Corp',
      email: 'contact@techcorp.com'
    },
    deliverables: [
      'Diseño de UI/UX',
      'Desarrollo Frontend',
      'Desarrollo Backend',
      'Testing y Deploy'
    ],
    status: 'pending_acceptance'
  };

  const validateWalletAddress = (address: string): boolean => {
    // Validación básica de dirección Ethereum
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  };

  const handleWalletChange = (value: string) => {
    setWalletAddress(value);
    setIsValidating(true);
    
    // Debounce validation
    setTimeout(() => {
      setIsValidating(false);
    }, 500);
  };

  const acceptContract = async () => {
    if (!walletAddress) {
      toast.error('Por favor, ingresa tu dirección de wallet');
      return;
    }

    if (!validateWalletAddress(walletAddress)) {
      toast.error('Dirección de wallet inválida');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/contracts/${params.contractId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || '¡Contrato aceptado exitosamente!');
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Error al aceptar el contrato');
      }
    } catch (error) {
      toast.error('Error al aceptar el contrato');
    } finally {
      setIsLoading(false);
    }
  };

  const rejectContract = async () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres rechazar este contrato? Los fondos serán devueltos a la empresa automáticamente.'
    );

    if (!confirmed) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/contracts/${params.contractId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || 'Contrato rechazado exitosamente.');
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Error al rechazar el contrato');
      }
    } catch (error) {
      toast.error('Error al rechazar el contrato');
    } finally {
      setIsLoading(false);
    }
  };

  const isWalletValid = validateWalletAddress(walletAddress);

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Aceptar Contrato</h1>
        <p className="text-lg text-muted-foreground">
          Revisa los detalles del contrato y decide si quieres aceptarlo o rechazarlo.
        </p>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Pendiente de aceptación
        </Badge>
      </div>

      {/* Contract Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalles del Contrato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Título</Label>
              <p className="font-medium">{contractData.title}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Empresa</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{contractData.client.name}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Monto Total</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-lg">{contractData.amount} {contractData.currency}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Duración</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{contractData.startDate} - {contractData.endDate}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Descripción</Label>
            <p className="text-sm">{contractData.description}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Entregables</Label>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {contractData.deliverables.map((deliverable, index) => (
                <li key={index}>{deliverable}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Configuración de Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Para aceptar este contrato, necesitas proporcionar tu dirección de wallet de Ethereum donde recibirás 
              los pagos cuando el contrato se complete exitosamente.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="walletAddress">Dirección de Wallet Ethereum</Label>
            <div className="relative">
              <Input
                id="walletAddress"
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => handleWalletChange(e.target.value)}
                className={`pr-10 ${
                  walletAddress && !isValidating
                    ? isWalletValid 
                      ? 'border-green-500 focus:border-green-500' 
                      : 'border-red-500 focus:border-red-500'
                    : ''
                }`}
              />
              {isValidating ? (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              ) : walletAddress ? (
                isWalletValid ? (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )
              ) : null}
            </div>
            {walletAddress && !isValidating && !isWalletValid && (
              <p className="text-sm text-red-500">
                La dirección de wallet debe tener el formato correcto (0x seguido de 40 caracteres hexadecimales)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          onClick={acceptContract} 
          disabled={isLoading || !isWalletValid || !walletAddress}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          {isLoading ? 'Aceptando...' : 'Aceptar Contrato'}
        </Button>
        
        <Button 
          onClick={rejectContract} 
          disabled={isLoading}
          variant="destructive"
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {isLoading ? 'Rechazando...' : 'Rechazar Contrato'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard')}
          disabled={isLoading}
        >
          Volver al Dashboard
        </Button>
      </div>

      {/* Information Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Si aceptas este contrato, se activará y los fondos permanecerán en escrow 
          hasta que se complete. Si lo rechazas, los fondos serán devueltos automáticamente a la empresa.
        </AlertDescription>
      </Alert>
    </div>
  );
}