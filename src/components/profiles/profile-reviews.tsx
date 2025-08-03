"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

interface ProfileReviewsProps {
  reviews: any[];
  averageRating: number;
  totalReviews: number;
}

export function ProfileReviews({ reviews, averageRating, totalReviews }: ProfileReviewsProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (totalReviews === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Reseñas</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Aún no hay reseñas para este perfil.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Reseñas</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{averageRating}</span>
          </div>
          <span className="text-muted-foreground">
            ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => {
          const reviewerName = `${review.reviewer.firstName} ${review.reviewer.lastName}`;
          const reviewerDisplayName = review.reviewer.contractorProfile?.username 
            ? `@${review.reviewer.contractorProfile.username}`
            : review.reviewer.clientProfile?.company || reviewerName;

          return (
            <div key={review.id} className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
              <div className="flex gap-4">
                {/* Reviewer Avatar */}
                <Link href={`/profile/${review.reviewer.id}`}>
                  <Avatar className="h-10 w-10 ring-2 ring-background hover:ring-primary/20 transition-all">
                    <AvatarImage
                      src={
                        review.reviewer.contractorProfile
                          ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${reviewerName}`
                          : `https://avatar.vercel.sh/${review.reviewer.clientProfile?.company || reviewerName}`
                      }
                      alt={reviewerName}
                    />
                    <AvatarFallback>
                      {reviewerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex-1 space-y-2">
                  {/* Reviewer Info */}
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/profile/${review.reviewer.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {reviewerDisplayName}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(review.createdAt), "d MMM yyyy", { locale: es })}
                    </span>
                    {review.contract && (
                      <Badge variant="outline" className="text-xs">
                        {review.contract.title}
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm font-medium">{review.rating}/5</span>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}