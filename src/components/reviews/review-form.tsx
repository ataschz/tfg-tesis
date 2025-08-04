"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { reviewSchema, type ReviewFormData } from "./review-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createReviewAction } from "@/lib/actions/reviews";
import { toast } from "sonner";

interface ReviewFormProps {
  contractId: string;
  contractTitle: string;
  reviewedUserId: string;
  reviewedUserName: string;
  reviewedUserType: "contractor" | "client";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  contractId,
  contractTitle,
  reviewedUserId,
  reviewedUserName,
  reviewedUserType,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const currentRating = form.watch("rating");

  const handleStarClick = (rating: number) => {
    form.setValue("rating", rating);
  };

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createReviewAction({
        contractId,
        reviewedUserId,
        rating: data.rating,
        comment: data.comment || undefined,
      });

      if (result.success) {
        toast.success("Reseña enviada exitosamente");
        form.reset();
        onSuccess?.();
      } else {
        toast.error(result.error || "Error al enviar la reseña");
      }
    } catch (error) {
      toast.error("Error inesperado al enviar la reseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userTypeLabel =
    reviewedUserType === "contractor" ? "contratista" : "cliente";

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Calificar {userTypeLabel}</h3>
          <p className="text-sm text-muted-foreground">
            Deja una reseña para <strong>{reviewedUserName}</strong> por el
            contrato "{contractTitle}"
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating Field */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calificación</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => {
                        const starValue = i + 1;
                        const isActive =
                          starValue <= (hoveredRating || currentRating);

                        return (
                          <button
                            key={i}
                            type="button"
                            className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                            onClick={() => handleStarClick(starValue)}
                            onMouseEnter={() => handleStarHover(starValue)}
                            onMouseLeave={handleStarLeave}
                          >
                            <Star
                              className={`h-8 w-8 transition-colors cursor-pointer ${
                                isActive
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 hover:text-yellow-300"
                              }`}
                            />
                          </button>
                        );
                      })}
                      {currentRating > 0 && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          {currentRating} de 5 estrellas
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment Field */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentario (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Comparte tu experiencia trabajando con este usuario..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-xs text-muted-foreground text-right">
                    {field.value?.length || 0} / 500
                  </div>
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting || currentRating === 0}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Enviar reseña
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
}
