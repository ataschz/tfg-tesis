import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    lastName: z
      .string()
      .min(2, { message: "El apellido debe tener al menos 2 caracteres." }),
    email: z.string().email({ message: "Correo electrónico inválido." }),
    userType: z.enum(["contractor", "client"], {
      message: "Debes seleccionar un tipo de usuario.",
    }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });
