'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Calendar,
  DollarSign,
  Building2,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Shield,
  FileText,
  ArrowRight
} from 'lucide-react';

interface ContractReviewSidebarProps {
  contract: any; // TODO: Add proper type
}

export function ContractReviewSidebar({ contract }: ContractReviewSidebarProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 ring-4 ring-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Monto Total del Contrato</p>
              <p className="text-3xl font-bold tracking-tight">
                {contract.currency} {contract.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 ring-4 ring-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-500">Duración del Contrato</p>
                <p className="text-sm text-muted-foreground">
                  {format(contract.endDate, 'PPP', { locale: es })}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-5 top-0 h-full w-px bg-border" />
              <div className="space-y-4">
                <div className="relative flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card shadow-sm">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Fecha de Inicio</p>
                    <p className="text-sm text-muted-foreground">
                      {format(contract.startDate, "PPP", { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Fecha de Finalización</p>
                    <p className="text-sm text-muted-foreground">
                      {format(contract.endDate, "PPP", { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="divide-y">
          <div className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Empresas Participantes</h3>
                <p className="text-sm text-muted-foreground">Partes contratantes</p>
              </div>
            </div>
            <div className="space-y-4">
              {contract.companies.map((company: any) => (
                <div 
                  key={company.id} 
                  className="flex items-center gap-4 rounded-lg border bg-card/50 p-3 shadow-sm"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                    <AvatarImage 
                      src={`https://avatar.vercel.sh/${company.name}`}
                      alt={company.name}
                    />
                    <AvatarFallback>{company.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-muted-foreground">{company.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Contratistas</h3>
                <p className="text-sm text-muted-foreground">Proveedores de servicios</p>
              </div>
            </div>
            <div className="space-y-4">
              {contract.contractors.map((contractor: any) => (
                <div 
                  key={contractor.id} 
                  className="flex items-center gap-4 rounded-lg border bg-card/50 p-3 shadow-sm"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contractor.name}`}
                      alt={contractor.name}
                    />
                    <AvatarFallback>{contractor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{contractor.name}</p>
                    <p className="text-sm text-muted-foreground">{contractor.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-l-4 border-yellow-500 bg-yellow-500/5 p-6">
          <h3 className="mb-4 font-semibold">Importante</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
                <Shield className="h-3.5 w-3.5 text-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Este es un contrato legalmente vinculante. Al aceptar, confirmas que tienes la autoridad para firmar en nombre de tu parte.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
                <FileText className="h-3.5 w-3.5 text-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Lee cuidadosamente todos los términos y condiciones, incluyendo los entregables y fechas límite.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Una vez aceptado, el contrato será efectivo inmediatamente y los fondos serán depositados en garantía.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}