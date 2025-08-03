"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Users2, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ContractParticipantsProps {
  clients: any[];
  contractors: any[];
}

export function ContractParticipants({ clients, contractors }: ContractParticipantsProps) {
  return (
    <div className="space-y-6">
      {/* Clients */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {clients.length === 1 ? 'Cliente' : 'Clientes'} ({clients.length})
        </h3>
        
        <div className="space-y-4">
          {clients.map((client, index) => {
            const isCompany = client.clientProfile?.company;
            const displayName = isCompany 
              ? client.clientProfile.company 
              : `${client.firstName} ${client.lastName}`;
            
            return (
              <div key={client.id} className="flex items-start gap-3">
                <Link href={`/profile/${client.id}`}>
                  <Avatar className="h-12 w-12 ring-2 ring-background hover:ring-primary/20 transition-all">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${displayName}`}
                      alt={displayName}
                    />
                    <AvatarFallback>
                      {isCompany ? client.clientProfile.company[0] : client.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/profile/${client.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {displayName}
                    </Link>
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Principal
                      </Badge>
                    )}
                  </div>
                  
                  {!isCompany && (
                    <p className="text-sm text-muted-foreground">
                      {client.firstName} {client.lastName}
                    </p>
                  )}
                  
                  {client.clientProfile?.industry && (
                    <p className="text-xs text-muted-foreground">
                      {client.clientProfile.industry}
                    </p>
                  )}
                  
                  {client.authUser?.email && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {client.authUser.email}
                    </div>
                  )}
                  
                  {client.clientProfile?.website && (
                    <a 
                      href={client.clientProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Sitio web
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Contractors */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users2 className="h-5 w-5" />
          {contractors.length === 1 ? 'Contratista' : 'Contratistas'} ({contractors.length})
        </h3>
        
        <div className="space-y-4">
          {contractors.map((contractor, index) => {
            const fullName = `${contractor.firstName} ${contractor.lastName}`;
            const username = contractor.contractorProfile?.username;
            
            return (
              <div key={contractor.id} className="flex items-start gap-3">
                <Link href={`/profile/${contractor.id}`}>
                  <Avatar className="h-12 w-12 ring-2 ring-background hover:ring-primary/20 transition-all">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`}
                      alt={fullName}
                    />
                    <AvatarFallback>
                      {contractor.firstName[0]}{contractor.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/profile/${contractor.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {fullName}
                    </Link>
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Principal
                      </Badge>
                    )}
                  </div>
                  
                  {username && (
                    <p className="text-sm text-muted-foreground">
                      @{username}
                    </p>
                  )}
                  
                  {contractor.contractorProfile?.hourlyRate && (
                    <p className="text-xs text-muted-foreground">
                      ${contractor.contractorProfile.hourlyRate}/hora
                    </p>
                  )}
                  
                  {contractor.authUser?.email && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {contractor.authUser.email}
                    </div>
                  )}
                  
                  {contractor.contractorProfile?.skills && contractor.contractorProfile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {contractor.contractorProfile.skills.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {contractor.contractorProfile.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{contractor.contractorProfile.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}