'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signUpContractor, signUpCompany } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { UserRole } from '@/lib/types/auth';

const contractorSchema = z.object({
  firstName: z.string().min(2, 'El nombre es requerido'),
  lastName: z.string().min(2, 'El apellido es requerido'),
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const companySchema = z.object({
  companyName: z.string().min(2, 'El nombre de la empresa es requerido'),
  website: z.string().url('URL inválida'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<UserRole>('contractor');

  const contractorForm = useForm<z.infer<typeof contractorSchema>>({
    resolver: zodResolver(contractorSchema),
  });

  const companyForm = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
  });

  function onSubmitContractor(values: z.infer<typeof contractorSchema>) {
    startTransition(async () => {
      await signUpContractor(values);
    });
  }

  function onSubmitCompany(values: z.infer<typeof companySchema>) {
    startTransition(async () => {
      await signUpCompany(values);
    });
  }

  return (
    <Tabs defaultValue="contractor" className="w-full" onValueChange={(value) => setRole(value as UserRole)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="contractor">Contratista</TabsTrigger>
        <TabsTrigger value="company">Empresa</TabsTrigger>
      </TabsList>
      <TabsContent value="contractor">
        <Form {...contractorForm}>
          <form onSubmit={contractorForm.handleSubmit(onSubmitContractor)} className="space-y-4">
            <FormField
              control={contractorForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={contractorForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={contractorForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={contractorForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={contractorForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Registrarse como Contratista
            </Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="company">
        <Form {...companyForm}>
          <form onSubmit={companyForm.handleSubmit(onSubmitCompany)} className="space-y-4">
            <FormField
              control={companyForm.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la empresa</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={companyForm.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sitio web</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={companyForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo corporativo</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={companyForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Registrarse como Empresa
            </Button>
          </form>
        </Form>
      </TabsContent>
      <div className="mt-4 text-center text-sm">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/signin" className="text-primary hover:underline">
          Inicia sesión
        </Link>
      </div>
    </Tabs>
  );
}