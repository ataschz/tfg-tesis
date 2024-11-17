'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { Wallet, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableAmount: number;
  currency: string;
}

const NETWORKS = [
  { id: 'ethereum', name: 'Ethereum', fee: 0.35 },
  { id: 'polygon', name: 'Polygon', fee: 0.15 },
  { id: 'arbitrum', name: 'Arbitrum', fee: 0.25 },
  { id: 'optimism', name: 'Optimism', fee: 0.20 },
];

export function WithdrawalDialog({ open, onOpenChange, availableAmount, currency }: WithdrawalDialogProps) {
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const networkFee = NETWORKS.find(n => n.id === selectedNetwork)?.fee || 0;
  const parsedAmount = parseFloat(amount) || 0;
  const total = parsedAmount + networkFee;

  const isValidAmount = parsedAmount > 0 && parsedAmount <= availableAmount;
  const isValidWallet = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
  const canSubmit = isValidAmount && isValidWallet && selectedNetwork && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Retiro iniciado correctamente');
      onOpenChange(false);
      setAmount('');
      setWalletAddress('');
      setSelectedNetwork('');
    } catch (error) {
      toast.error('Error al procesar el retiro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Retirar Fondos</DialogTitle>
              <DialogDescription>
                Disponible: {currency} {availableAmount.toLocaleString()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto a retirar</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                max={availableAmount}
                step="0.01"
                className="pl-12"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <span className="text-sm font-medium">{currency}</span>
              </div>
            </div>
            {parsedAmount > availableAmount && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                Monto excede el disponible
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="network">Red</Label>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una red" />
              </SelectTrigger>
              <SelectContent>
                {NETWORKS.map((network) => (
                  <SelectItem key={network.id} value={network.id}>
                    <div className="flex items-center justify-between gap-2">
                      <span>{network.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Fee: {currency} {network.fee}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet">Dirección de Wallet</Label>
            <Input
              id="wallet"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
            />
            {walletAddress && !isValidWallet && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                Dirección inválida
              </p>
            )}
          </div>

          {selectedNetwork && parsedAmount > 0 && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monto</span>
                  <span>{currency} {parsedAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Comisión de red</span>
                  <span>{currency} {networkFee}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>{currency} {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSubmit} 
            disabled={!canSubmit}
            className="w-full gap-2"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Procesando retiro...
              </>
            ) : (
              <>
                Confirmar Retiro
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}