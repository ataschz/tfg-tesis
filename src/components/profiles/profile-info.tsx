"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Building2, DollarSign, Clock, Award } from "lucide-react";

interface ProfileInfoProps {
  profile: {
    userType: "contractor" | "client" | "mediator";
    country?: string | null;
    contractorProfile?: any;
    clientProfile?: any;
  };
  joinedDate: string;
}

export function ProfileInfo({ profile, joinedDate }: ProfileInfoProps) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Información General</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Se unió en {joinedDate}</span>
          </div>
          
          {profile.country && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profile.country}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Contractor Specific Info */}
      {profile.userType === "contractor" && profile.contractorProfile && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Perfil Profesional</h3>
          <div className="space-y-4">
            {profile.contractorProfile.hourlyRate && (
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  ${profile.contractorProfile.hourlyRate}/hora
                </span>
              </div>
            )}

            {profile.contractorProfile.experienceYears && (
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {profile.contractorProfile.experienceYears} años de experiencia
                </span>
              </div>
            )}

            {profile.contractorProfile.totalProjectsCompleted > 0 && (
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {profile.contractorProfile.totalProjectsCompleted} proyectos completados
                </span>
              </div>
            )}

            {profile.contractorProfile.skills && profile.contractorProfile.skills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Habilidades</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.contractorProfile.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Client Specific Info */}
      {profile.userType === "client" && profile.clientProfile && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Información de la Empresa</h3>
          <div className="space-y-4">
            {profile.clientProfile.industry && (
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.clientProfile.industry}</span>
              </div>
            )}

            {profile.clientProfile.size && (
              <div className="flex items-center gap-3">
                <span className="text-sm">Tamaño: {profile.clientProfile.size}</span>
              </div>
            )}

            {profile.clientProfile.totalContractsCreated > 0 && (
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {profile.clientProfile.totalContractsCreated} contratos creados
                </span>
              </div>
            )}

            {profile.clientProfile.website && (
              <div>
                <a 
                  href={profile.clientProfile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Sitio web
                </a>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}