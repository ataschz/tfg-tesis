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
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, type HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import { signInSchema } from "./schema";

interface SignInFormProps extends HTMLAttributes<HTMLDivElement> {}

export function SignInForm({ className, ...props }: SignInFormProps) {
  const router = useRouter();
  const [isEmailSignInLoading, setIsEmailSignInLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setIsEmailSignInLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        toast.error("Correo o contraseña inválidos");
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
    } finally {
      setIsEmailSignInLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-4 max-w-[400px] w-full", className)}>
      <Card {...props} className="overflow-hidden">
        <CardContent className="flex flex-col gap-4 p-4">
          <Form {...form}>
            <form
              id="sign-in"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="text-xl font-medium">Bienvenido de nuevo</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Inicia sesión en tu cuenta de Retrip
                </p>
              </div>
              <div className="space-y-4">
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
                          placeholder="agencia@retrip.io"
                          {...field}
                          disabled={isEmailSignInLoading}
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
                          placeholder="*********"
                          disabled={isEmailSignInLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                form="sign-in"
                type="submit"
                className="w-full"
                isLoading={isEmailSignInLoading}
                disabled={isEmailSignInLoading}
              >
                Iniciar sesión
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <a
          href="/sign-up"
          className="underline underline-offset-4 hover:text-primary"
        >
          Regístrate aquí
        </a>
        .
      </div>
    </div>
  );
}
