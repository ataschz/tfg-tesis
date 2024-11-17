'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  MoreVertical, 
  FileDown,
  Eye,
  DollarSign,
  Building2,
  Users2,
  AlertTriangle,
  CheckCircle2,
  Unlock
} from 'lucide-react';
import { getContractPDF } from '@/lib/actions/contractor';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

interface ContractCardProps {
  contract: any;
  type: 'received' | 'sent';
}

export function ContractCard({ contract, type }: ContractCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [showReleaseDialog, setShowReleaseDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const pdfBlob = await getContractPDF(contract.id);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contrato-${contract.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Contrato descargado correctamente');
    } catch (error) {
      toast.error('Error al descargar el contrato');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleInitiateDispute = async () => {
    if (!disputeReason.trim()) {
      toast.error('Por favor, describe el motivo de la disputa');
      return;
    }

    try {
      setIsSubmitting(true);
      // TODO: Implement dispute initiation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Disputa iniciada correctamente');
      setShowDisputeDialog(false);
      setDisputeReason('');
    } catch (error) {
      toast.error('Error al iniciar la disputa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReleaseFunds = async () => {
    try {
      setIsSubmitting(true);
      // TODO: Implement funds release
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Fondos liberados correctamente');
      setShowReleaseDialog(false);
    } catch (error) {
      toast.error('Error al liberar los fondos');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="w-full overflow-hidden transition-all hover:shadow-lg">
        <div className="border-b border-border/50 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold">{contract.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(contract.startDate).toLocaleDateString()} -{' '}
                  {contract.endDate
                    ? new Date(contract.endDate).toLocaleDateString()
                    : 'En curso'}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
                  <FileDown className="mr-2 h-4 w-4" />
                  {isDownloading ? 'Descargando...' : 'Descargar contrato'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDisputeDialog(true)}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Solicitar disputa
                </DropdownMenuItem>
                {type === 'sent' && (
                  <DropdownMenuItem onClick={() => setShowReleaseDialog(true)}>
                    <Unlock className="mr-2 h-4 w-4" />
                    Liberar fondos
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Empresas</span>
              </div>
              <div className="space-y-3">
                {contract.companies.map((company: any) => (
                  <Link key={company.id} href={`/company/${company.id}`}>
                    <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${company.companyName}`} alt={company.companyName} />
                        <AvatarFallback>{company.companyName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{company.companyName}</p>
                        <p className="text-xs text-muted-foreground">{company.email}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Contratistas</span>
              </div>
              <div className="space-y-3">
                {contract.contractors.map((contractor: any) => (
                  <Link key={contractor.id} href={`/contractor/${contractor.id}`}>
                    <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                      <Avatar>
                        <AvatarImage 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contractor.firstName}`} 
                          alt={`${contractor.firstName} ${contractor.lastName}`} 
                        />
                        <AvatarFallback>{contractor.firstName[0]}{contractor.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{contractor.firstName} {contractor.lastName}</p>
                        <p className="text-xs text-muted-foreground">{contractor.email}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-border/50 pt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {contract.currency} {contract.amount.toLocaleString()}
              </span>
            </div>
            <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
              {contract.status === 'active' ? 'Activo' : 'Finalizado'}
            </Badge>
            <Badge variant="outline">
              {type === 'received' ? 'Recibido' : 'Enviado'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Diálogos */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{contract.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Descripción</h4>
              <p className="text-sm text-muted-foreground">{contract.description}</p>
            </div>
            <div>
              <h4 className="font-medium">Detalles del Contrato</h4>
              <dl className="mt-2 space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Monto</dt>
                  <dd className="font-medium">
                    {contract.currency} {contract.amount.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Fecha de Inicio</dt>
                  <dd className="font-medium">
                    {new Date(contract.startDate).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Fecha de Finalización</dt>
                  <dd className="font-medium">
                    {new Date(contract.endDate).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar Disputa</DialogTitle>
            <DialogDescription>
              Describe el motivo de la disputa. Nuestro equipo revisará el caso y te contactará en breve.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Describe el motivo de la disputa..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisputeDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInitiateDispute} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Enviando...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Iniciar Disputa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReleaseDialog} onOpenChange={setShowReleaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Liberar Fondos</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas liberar los fondos? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReleaseDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleReleaseFunds} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Liberando...
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Confirmar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}