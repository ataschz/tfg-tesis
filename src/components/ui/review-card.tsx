'use client';

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: {
    rating: number;
    comment: string;
    date: string;
    author: {
      name: string;
      role: string;
      avatar: string;
    };
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={review.author.avatar} alt={review.author.name} />
          <AvatarFallback>{review.author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{review.author.name}</div>
          <div className="text-sm text-muted-foreground">{review.author.role}</div>
        </div>
      </div>
      <div className="mt-4 flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < review.rating
                ? "fill-primary text-primary"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{review.comment}</p>
      <div className="mt-4 text-xs text-muted-foreground">
        {new Date(review.date).toLocaleDateString()}
      </div>
    </Card>
  );
}