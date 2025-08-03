'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Users, Star, FileText, AlertTriangle } from 'lucide-react';

interface DisputePartiesProps {
  clients: Array<{
    id: string;
    name: string;
    email: string;
    isPrimary: boolean;
  }>;
  contractors: Array<{
    id: string;
    name: string;
    email: string;
    isPrimary: boolean;
  }>;
}

export function DisputeParties({ clients, contractors }: DisputePartiesProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="border-l-4 border-primary p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Clientes</h3>
              <p className="text-sm text-muted-foreground">Parte contratante ({clients.length} usuario{clients.length > 1 ? 's' : ''})</p>
            </div>
          </div>

          <div className="space-y-4">
            {clients.map((client, index) => (
              <div key={client.id} className={`${index > 0 ? 'border-t pt-4' : ''}`}>
                <div className="flex items-center gap-4 mb-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                    <AvatarImage 
                      src={`https://avatar.vercel.sh/${client.name}`}
                      alt={client.name}
                    />
                    <AvatarFallback>{client.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{client.name}</h4>
                      {client.isPrimary && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                
                <div className="rounded-lg border bg-card/50 p-3">
                  <div className="text-sm">
                    <div className="mb-1">
                      <span className="font-medium">ID:</span> <span className="font-mono text-xs">{client.id}</span>
                    </div>
                    <div>
                      <span className="font-medium">Rol:</span> {client.isPrimary ? 'Cliente Principal' : 'Cliente Adicional'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-l-4 border-blue-500 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold">Contratistas</h3>
              <p className="text-sm text-muted-foreground">Proveedor{contractors.length > 1 ? 'es' : ''} de servicios ({contractors.length} usuario{contractors.length > 1 ? 's' : ''})</p>
            </div>
          </div>

          <div className="space-y-4">
            {contractors.map((contractor, index) => (
              <div key={contractor.id} className={`${index > 0 ? 'border-t pt-4' : ''}`}>
                <div className="flex items-center gap-4 mb-3">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-500/10">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contractor.name}`}
                      alt={contractor.name}
                    />
                    <AvatarFallback>{contractor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{contractor.name}</h4>
                      {contractor.isPrimary && (
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{contractor.email}</p>
                  </div>
                </div>
                
                <div className="rounded-lg border bg-card/50 p-3">
                  <div className="text-sm">
                    <div className="mb-1">
                      <span className="font-medium">ID:</span> <span className="font-mono text-xs">{contractor.id}</span>
                    </div>
                    <div>
                      <span className="font-medium">Rol:</span> {contractor.isPrimary ? 'Contratista Principal' : 'Contratista Adicional'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}