'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Users, Star, FileText, AlertTriangle } from 'lucide-react';

interface DisputePartiesProps {
  company: any;
  contractor: any;
}

export function DisputeParties({ company, contractor }: DisputePartiesProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="border-l-4 border-primary p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Empresa</h3>
              <p className="text-sm text-muted-foreground">Parte contratante</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-primary/10">
                <AvatarImage 
                  src={`https://avatar.vercel.sh/${company.name}`}
                  alt={company.name}
                />
                <AvatarFallback>{company.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{company.name}</h4>
                <p className="text-sm text-muted-foreground">{company.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg border bg-card/50 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Rating</span>
                </div>
                <p className="font-medium">{company.rating}/5.0</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Contratos</span>
                </div>
                <p className="font-medium">{company.totalContracts}</p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Tasa de Disputas</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div 
                  className="h-2 rounded-full bg-primary" 
                  style={{ width: `${company.disputeRate * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {(company.disputeRate * 100).toFixed(1)}% de contratos con disputas
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Reseñas Recientes</h4>
              {company.reviews.map((review: any) => (
                <div key={review.id} className="rounded-lg border bg-card/50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{review.author}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-sm">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
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
              <h3 className="font-semibold">Contratista</h3>
              <p className="text-sm text-muted-foreground">Proveedor de servicios</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-blue-500/10">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contractor.name}`}
                  alt={contractor.name}
                />
                <AvatarFallback>{contractor.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{contractor.name}</h4>
                <p className="text-sm text-muted-foreground">{contractor.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg border bg-card/50 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Rating</span>
                </div>
                <p className="font-medium">{contractor.rating}/5.0</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Contratos</span>
                </div>
                <p className="font-medium">{contractor.totalContracts}</p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Tasa de Disputas</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div 
                  className="h-2 rounded-full bg-blue-500" 
                  style={{ width: `${contractor.disputeRate * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {(contractor.disputeRate * 100).toFixed(1)}% de contratos con disputas
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Reseñas Recientes</h4>
              {contractor.reviews.map((review: any) => (
                <div key={review.id} className="rounded-lg border bg-card/50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{review.author}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-blue-500 text-blue-500" />
                      <span className="text-sm">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}