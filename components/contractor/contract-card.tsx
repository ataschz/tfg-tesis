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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  MoreVertical, 
  FileDown, 
  Eye,
  Clock,
  DollarSign,
  Building2,
  Users2
} from 'lucide-react';
import type { ContractWithParties } from '@/lib/types/dashboard';
import { getContractPDF } from '@/lib/actions/contractor';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface ContractCardProps {
  contract: ContractWithParties;
}

export function ContractCard({ contract }: ContractCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
                {contract.companies.map((company) => (
                  <div key={company.id} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${company.companyName}`} alt={company.companyName} />
                      <AvatarFallback>{company.companyName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{company.companyName}</p>
                      <p className="text-xs text-muted-foreground">{company.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Contratistas</span>
              </div>
              <div className="space-y-3">
                {contract.contractors.map((contractor) => (
                  <div key={contractor.id} className="flex items-center gap-3">
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
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-border/50 pt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {contract.type === 'fixed-price' 
                  ? `${contract.currency} ${contract.amount?.toLocaleString()}`
                  : `${contract.currency} ${contract.hourlyRate}/hora`
                }
              </span>
            </div>
            {contract.hoursPerWeek && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{contract.hoursPerWeek}h/semana</span>
              </div>
            )}
            <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
              {contract.status === 'active' ? 'Activo' : 'Finalizado'}
            </Badge>
          </div>
        </div>
      </Card>

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
                  <dt className="text-muted-foreground">Tipo</dt>
                  <dd className="font-medium">{contract.type === 'fixed-price' ? 'Precio Fijo' : 'Por Hora'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Monto</dt>
                  <dd className="font-medium">
                    {contract.currency} {contract.amount || contract.hourlyRate}
                    {contract.type === 'hourly' && '/hora'}
                  </dd>
                </div>
                {contract.hoursPerWeek && (
                  <div>
                    <dt className="text-muted-foreground">Horas por Semana</dt>
                    <dd className="font-medium">{contract.hoursPerWeek}</dd>
                  </div>
                )}
                {contract.milestones && (
                  <div>
                    <dt className="text-muted-foreground">Hitos</dt>
                    <dd className="mt-2">
                      <div className="space-y-2">
                        {contract.milestones.map((milestone) => (
                          <div key={milestone.id} className="rounded-lg border p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{milestone.title}</span>
                              <Badge variant={
                                milestone.status === 'completed' ? 'default' :
                                milestone.status === 'in-progress' ? 'secondary' : 'outline'
                              }>
                                {milestone.status === 'completed' ? 'Completado' :
                                 milestone.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                              </Badge>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              {contract.currency} {milestone.amount.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}