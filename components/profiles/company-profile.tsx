import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Users, Mail, MapPin, Shield, Calendar } from "lucide-react";
import type { Company } from "@/lib/types/database";
import { ReviewCard } from "@/components/ui/review-card";
import { companyReviews } from "@/lib/data/reviews";

interface CompanyProfileProps {
  company: Company;
}

export function CompanyProfile({ company }: CompanyProfileProps) {
  return (
    <div className="space-y-8">
      {/* Previous code remains the same until the end of the grid */}
      <div className="relative">
        <div className="absolute inset-0 h-40 bg-gradient-to-r from-blue-600 to-cyan-500" />
        <div className="container relative pt-20">
          <Card className="overflow-hidden">
            <div className="relative flex flex-col items-center p-6 pb-8 text-center md:flex-row md:text-left">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={`https://avatar.vercel.sh/${company.companyName}`} />
                <AvatarFallback>{company.companyName[0]}</AvatarFallback>
              </Avatar>
              <div className="mt-4 md:ml-6 md:mt-0">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold">{company.companyName}</h1>
                  <Badge variant={company.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                    {company.verificationStatus === 'verified' ? 'Verificada' : 'Pendiente'}
                  </Badge>
                </div>
                <p className="mt-1 text-muted-foreground">{company.industry}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="container grid gap-8 lg:grid-cols-3">
        {/* Previous grid content remains the same */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h2 className="text-xl font-semibold">Información de la Empresa</h2>
            <div className="mt-6 grid gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tamaño de la Empresa</p>
                  <p className="font-medium">{company.size} empleados</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Globe className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sitio Web</p>
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <MapPin className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">País</p>
                  <p className="font-medium">{company.country}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Mail className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Correo de Contacto</p>
                  <p className="font-medium">{company.email}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="font-semibold">Estadísticas</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Contratos Activos</span>
                  </div>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tasa de Éxito</span>
                  </div>
                  <span className="font-medium">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Miembro desde</span>
                  </div>
                  <span className="font-medium">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="font-semibold">Plan Actual</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <Badge>{company.subscription.plan}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado</span>
                  <Badge variant={company.subscription.status === 'active' ? 'default' : 'destructive'}>
                    {company.subscription.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vence</span>
                  <span className="text-sm">
                    {new Date(company.subscription.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Reseñas</h2>
          <p className="text-muted-foreground">
            Opiniones de contratistas que han trabajado con {company.companyName}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companyReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}