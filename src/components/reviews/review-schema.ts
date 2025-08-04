import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "La calificación debe ser al menos 1 estrella")
    .max(5, "La calificación debe ser máximo 5 estrellas"),
  comment: z
    .string()
    .min(10, "El comentario debe tener al menos 10 caracteres")
    .max(500, "El comentario no puede exceder 500 caracteres")
    .optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
