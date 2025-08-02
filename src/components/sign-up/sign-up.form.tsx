"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserIcon, BriefcaseIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import { signUpSchema } from "./schema";

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const router = useRouter();
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "contractor",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsSignUpLoading(true);

    try {
      // Usar la API de registro de better-auth
      const result = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: `${values.firstName} ${values.lastName}`,
      });

      if (result.error) {
        if (result.error.message?.includes("User already exists")) {
          toast.error("Ya existe una cuenta con este correo electrónico.");
        } else {
          toast.error(
            "Error al crear la cuenta. Por favor, inténtalo de nuevo."
          );
        }
        return;
      }

      // Si el registro fue exitoso, guardar información adicional del perfil
      // Esto se debería hacer mediante una API route que cree el userProfile
      try {
        const profileResponse = await fetch("/api/auth/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            userType: values.userType,
            userId: result.data?.user?.id,
          }),
        });

        if (!profileResponse.ok) {
          console.error(
            "Error creating profile:",
            await profileResponse.text()
          );
          // No mostramos error al usuario, solo logeamos
        }
      } catch (profileError) {
        console.error("Profile creation error:", profileError);
        // No mostramos error al usuario, solo logeamos
      }

      toast.success("¡Cuenta creada exitosamente!");

      // Redirigir según el tipo de usuario
      const redirectPath =
        values.userType === "contractor" ? "/dashboard" : "/dashboard";
      router.push(redirectPath);
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Error al crear la cuenta. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSignUpLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-4 max-w-[400px] w-full", className)}>
      <Card {...props} className="overflow-hidden">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xl font-medium">Crear cuenta</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Únete a nuestra plataforma de contratación
            </p>
          </div>

          <Form {...form}>
            <form
              id="sign-up"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Selección de tipo de usuario */}
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Tipo de cuenta</FormLabel>
                    <FormControl>
                      <Tabs
                        value={field.value}
                        onValueChange={field.onChange}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger
                            value="contractor"
                            className="flex items-center gap-2"
                          >
                            <UserIcon className="h-4 w-4" />
                            Contratista
                          </TabsTrigger>
                          <TabsTrigger
                            value="client"
                            className="flex items-center gap-2"
                          >
                            <BriefcaseIcon className="h-4 w-4" />
                            Contratante
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="contractor" className="mt-2">
                          <p className="text-xs text-muted-foreground text-center">
                            Ofrece tus servicios y trabaja en proyectos
                          </p>
                        </TabsContent>
                        <TabsContent value="client" className="mt-2">
                          <p className="text-xs text-muted-foreground text-center">
                            Contrata profesionales para tus proyectos
                          </p>
                        </TabsContent>
                      </Tabs>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Juan"
                          {...field}
                          disabled={isSignUpLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Apellido</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pérez"
                          {...field}
                          disabled={isSignUpLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Correo electrónico
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="usuario@ejemplo.com"
                        {...field}
                        disabled={isSignUpLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Mínimo 8 caracteres"
                        disabled={isSignUpLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Confirmar contraseña
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Repite tu contraseña"
                        disabled={isSignUpLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                form="sign-up"
                type="submit"
                className="w-full mt-2"
                isLoading={isSignUpLoading}
                disabled={isSignUpLoading}
              >
                Crear cuenta
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        ¿Ya tienes una cuenta? <a href="/sign-in">Inicia sesión aquí</a>.
      </div>
    </div>
  );
}
