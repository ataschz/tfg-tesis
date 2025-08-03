"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Building2, User, Shield } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  userType: "contractor" | "client" | "mediator";
  averageRating: number;
  totalReviews: number;
  contractorProfile?: any;
  clientProfile?: any;
}

export function ProfileHeader({
  fullName,
  userType,
  averageRating,
  totalReviews,
  contractorProfile,
  clientProfile,
}: ProfileHeaderProps) {
  const getUserTypeInfo = (type: string) => {
    switch (type) {
      case "contractor":
        return {
          label: "Contratista",
          icon: User,
          badge: "bg-blue-500/10 text-blue-600",
        };
      case "client":
        return {
          label: "Cliente",
          icon: Building2,
          badge: "bg-green-500/10 text-green-600",
        };
      case "mediator":
        return {
          label: "Mediador",
          icon: Shield,
          badge: "bg-purple-500/10 text-purple-600",
        };
      default:
        return {
          label: "Usuario",
          icon: User,
          badge: "bg-gray-500/10 text-gray-600",
        };
    }
  };

  const typeInfo = getUserTypeInfo(userType);
  const TypeIcon = typeInfo.icon;

  // Get avatar source based on user type
  const avatarSrc = userType === "contractor" 
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`
    : `https://avatar.vercel.sh/${clientProfile?.company || fullName}`;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent dark:from-slate-900" />
      <div className="relative p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <Avatar className="h-24 w-24 ring-4 ring-background">
            <AvatarImage src={avatarSrc} alt={fullName} />
            <AvatarFallback className="text-xl">
              {fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{fullName}</h1>
                <Badge className={typeInfo.badge}>
                  <TypeIcon className="mr-1 h-3 w-3" />
                  {typeInfo.label}
                </Badge>
              </div>

              {/* Company name for clients or username for contractors */}
              {userType === "client" && clientProfile?.company && (
                <p className="text-xl text-muted-foreground">
                  {clientProfile.company}
                </p>
              )}
              
              {userType === "contractor" && contractorProfile?.username && (
                <p className="text-lg text-muted-foreground">
                  @{contractorProfile.username}
                </p>
              )}
            </div>

            {/* Rating */}
            {totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{averageRating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            )}

            {/* Bio for contractors */}
            {userType === "contractor" && contractorProfile?.bio && (
              <p className="text-muted-foreground max-w-2xl">
                {contractorProfile.bio}
              </p>
            )}

            {/* Company description for clients */}
            {userType === "client" && clientProfile?.companyDescription && (
              <p className="text-muted-foreground max-w-2xl">
                {clientProfile.companyDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}