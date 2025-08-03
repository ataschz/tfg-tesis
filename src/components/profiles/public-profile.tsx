"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileHeader } from "./profile-header";
import { ProfileInfo } from "./profile-info";
import { ProfileReviews } from "./profile-reviews";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PublicProfileProps {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    userType: "contractor" | "client" | "mediator";
    country?: string | null;
    createdAt: Date | null;
    contractorProfile?: any;
    clientProfile?: any;
    reviews: any[];
    averageRating: number;
    totalReviews: number;
  };
}

export function PublicProfile({ profile }: PublicProfileProps) {
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const joinedDate = profile.createdAt 
    ? format(profile.createdAt, "MMMM yyyy", { locale: es })
    : "Fecha no disponible";

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProfileHeader
        fullName={fullName}
        userType={profile.userType}
        averageRating={profile.averageRating}
        totalReviews={profile.totalReviews}
        contractorProfile={profile.contractorProfile}
        clientProfile={profile.clientProfile}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <ProfileInfo
            profile={profile}
            joinedDate={joinedDate}
          />
        </div>

        {/* Reviews */}
        <div className="lg:col-span-2">
          <ProfileReviews
            reviews={profile.reviews}
            averageRating={profile.averageRating}
            totalReviews={profile.totalReviews}
          />
        </div>
      </div>
    </div>
  );
}