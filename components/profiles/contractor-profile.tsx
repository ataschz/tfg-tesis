import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Clock, 
  MapPin, 
  DollarSign, 
  Calendar,
  Star,
  Briefcase,
  GraduationCap
} from "lucide-react";
import type { Contractor } from "@/lib/types/database";
import { ReviewCard } from "@/components/ui/review-card";
import { contractorReviews } from "@/lib/data/reviews";

interface ContractorProfileProps {
  contractor: Contractor;
}

export function ContractorProfile({ contractor }: ContractorProfileProps) {
  return (
    <div className="space-y-8">
      {/* Previous code remains the same until the end of the grid */}
      <div className="relative">
        <div className="absolute inset-0 h-40 bg-gradient-to-r from-blue-600 to-cyan-500" />
        <div className="container relative pt-20">
          <Card className="overflow-hidden">
            <div className="relative flex flex-col items-center p-6 pb-8 text-center md:flex-row md:text-left">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contractor.firstName}`}
                  alt={`${contractor.firstName} ${contractor.lastName}`}
                />
                <AvatarFallback>{contractor.firstName[0]}{contractor.lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="mt-4 md:ml-6 md:mt-0">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold">
                    {contractor.firstName} {contractor.lastName}
                  </h1>
                  <Badge variant={contractor.profileComplete ? 'default' : 'secondary'}>
                    {contractor.profileComplete ? 'Verificado' : 'Pendiente'}
                  </Badge>
                </div>
                <p className="mt-1 text-muted-foreground">@{contractor.username}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="container grid gap-8 lg:grid-cols-3">
        {/* Previous grid content remains the same */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h2 className="text-xl font-semibold">Información Profesional</h2>
            <div className="mt-6 grid gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Disponibilidad</p>
                  <p className="font-medium">
                    {contractor.availability === 'full-time' ? 'Tiempo Completo' : 'Medio Tiempo'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tarifa por Hora</p>
                  <p className="font-medium">USD {contractor.hourlyRate}/hora</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <MapPin className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zona Horaria</p>
                  <p className="font-medium">{contractor.timezone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Mail className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Correo de Contacto</p>
                  <p className="font-medium">{contractor.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold">Habilidades</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {contractor.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
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
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Calificación</span>
                  </div>
                  <span className="font-medium">4.9/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Proyectos Completados</span>
                  </div>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Horas Trabajadas</span>
                  </div>
                  <span className="font-medium">1,240</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Miembro desde</span>
                  </div>
                  <span className="font-medium">
                    {new Date(contractor.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="font-semibold">Certificaciones</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">AWS Certified Developer</p>
                    <p className="text-xs text-muted-foreground">Amazon Web Services</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Professional Scrum Master</p>
                    <p className="text-xs text-muted-foreground">Scrum.org</p>
                  </div>
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
            Opiniones de empresas que han trabajado con {contractor.firstName}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contractorReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}