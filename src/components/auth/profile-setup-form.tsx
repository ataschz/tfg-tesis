"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Esquema base con campos comunes
const baseSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  phone: z.string().optional(),
  country: z.string().optional(),
  preferredCurrency: z.string().default("ETH"),
  walletAddress: z.string()
    .optional()
    .refine((address) => {
      if (!address) return true; // Optional field
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    }, "La dirección de wallet debe ser válida (formato: 0x...)")
});

// Esquema para freelancers
const contractorSchema = baseSchema.extend({
  username: z.string().optional(),
  specialties: z.string().optional(),
  experienceYears: z.coerce.number().optional(),
  hourlyRate: z.coerce.number().optional(),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional(),
  skills: z.string().optional(),
  availability: z
    .enum(["full-time", "part-time", "unavailable"])
    .default("unavailable"),
  timezone: z.string().optional(),
});

// Esquema para empresas
const clientSchema = baseSchema.extend({
  company: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  companyDescription: z.string().optional(),
  size: z.string().optional(),
});

// Esquema para mediadores (solo campos base)
const mediatorSchema = baseSchema;

// Definir tipos para cada esquema
type ContractorFormValues = z.infer<typeof contractorSchema>;
type ClientFormValues = z.infer<typeof clientSchema>;
type MediatorFormValues = z.infer<typeof mediatorSchema>;
type ProfileFormValues =
  | ContractorFormValues
  | ClientFormValues
  | MediatorFormValues;

interface ProfileSetupFormProps {
  user: {
    id: string;
    email: string;
    name?: string;
    walletAddress?: string | null;
    profile?: any; // The existing profile data
  };
  userType: "client" | "contractor" | "mediator";
}

export function ProfileSetupForm({ user, userType }: ProfileSetupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Seleccionar el esquema apropiado según el tipo de usuario
  const getSchema = () => {
    switch (userType) {
      case "contractor":
        return contractorSchema;
      case "client":
        return clientSchema;
      case "mediator":
        return mediatorSchema;
      default:
        return baseSchema;
    }
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      firstName: user.profile?.firstName || user.name?.split(" ")[0] || "",
      lastName: user.profile?.lastName || user.name?.split(" ").slice(1).join(" ") || "",
      phone: user.profile?.phone || "",
      country: user.profile?.country || "",
      preferredCurrency: user.profile?.preferredCurrency || "ETH",
      walletAddress: user.walletAddress || "",
      // Campos específicos según tipo de usuario
      ...(userType === "contractor" && {
        availability: user.profile?.contractorProfile?.availability || "unavailable" as const,
        username: user.profile?.contractorProfile?.username || "",
        experienceYears: user.profile?.contractorProfile?.experienceYears || undefined,
        hourlyRate: user.profile?.contractorProfile?.hourlyRate || undefined,
        portfolioUrl: user.profile?.contractorProfile?.portfolioUrl || "",
        specialties: user.profile?.contractorProfile?.specialties?.join(", ") || "",
        skills: user.profile?.contractorProfile?.skills?.join(", ") || "",
        timezone: user.profile?.contractorProfile?.timezone || "",
        bio: user.profile?.contractorProfile?.bio || "",
      }),
      ...(userType === "client" && {
        company: user.profile?.clientProfile?.company || "",
        industry: user.profile?.clientProfile?.industry || "",
        website: user.profile?.clientProfile?.website || "",
        companyDescription: user.profile?.clientProfile?.companyDescription || "",
        size: user.profile?.clientProfile?.size || "",
      }),
    } as any,
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          userType: userType,
          // Datos comunes
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone || null,
          country: values.country || null,
          preferredCurrency: values.preferredCurrency,
          walletAddress: values.walletAddress || null,

          // Datos específicos según tipo de usuario
          ...(userType === "contractor" && {
            contractorData: {
              username: (values as ContractorFormValues).username || null,
              specialties: (values as ContractorFormValues).specialties
                ? (values as ContractorFormValues)
                    .specialties!.split(",")
                    .map((s: string) => s.trim())
                    .filter((s: string) => s.length > 0)
                : null,
              experienceYears:
                (values as ContractorFormValues).experienceYears || null,
              hourlyRate: (values as ContractorFormValues).hourlyRate || null,
              portfolioUrl:
                (values as ContractorFormValues).portfolioUrl || null,
              bio: (values as ContractorFormValues).bio || null,
              skills: (values as ContractorFormValues).skills
                ? (values as ContractorFormValues)
                    .skills!.split(",")
                    .map((s: string) => s.trim())
                    .filter((s: string) => s.length > 0)
                : null,
              availability:
                (values as ContractorFormValues).availability || "unavailable",
              timezone: (values as ContractorFormValues).timezone || null,
            },
          }),

          ...(userType === "client" && {
            clientData: {
              company: (values as ClientFormValues).company || null,
              industry: (values as ClientFormValues).industry || null,
              website: (values as ClientFormValues).website || null,
              companyDescription:
                (values as ClientFormValues).companyDescription || null,
              size: (values as ClientFormValues).size || null,
            },
          }),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el perfil");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Error al crear el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar Perfil</CardTitle>
        <CardDescription>
          Completa tu información para comenzar a usar la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Campos básicos */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="preferredCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda preferida</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">
                        USD - Dólar Estadounidense
                      </SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                      <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                      <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección de Wallet (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0x..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Tu dirección de wallet para recibir/enviar pagos en ETH. Puedes configurarla más tarde.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mostrar tipo de usuario como información */}
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">
                Tipo de cuenta:{" "}
                {userType === "contractor"
                  ? "Contratista"
                  : userType === "client"
                  ? "Cliente / Empresa"
                  : "Mediador"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {userType === "contractor"
                  ? "Puedes ofrecer tus servicios y trabajar en proyectos"
                  : userType === "client"
                  ? "Puedes contratar profesionales para tus proyectos"
                  : "Puedes mediar en disputas entre empresas y freelancers"}
              </p>
            </div>

            {/* Campos específicos para freelancers */}
            {userType === "contractor" && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">
                  Información de Contratista
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de usuario</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Nombre único para tu perfil público
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experienceYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Años de experiencia</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tarifa por hora</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disponibilidad</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full-time">
                              Tiempo completo
                            </SelectItem>
                            <SelectItem value="part-time">
                              Tiempo parcial
                            </SelectItem>
                            <SelectItem value="unavailable">
                              No disponible
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="portfolioUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL del portfolio</FormLabel>
                      <FormControl>
                        <Input type="url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialties"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidades</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Separa cada especialidad con comas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Habilidades</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Separa cada habilidad con comas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zona horaria</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biografía</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Describe tu experiencia y servicios
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Campos específicos para empresas */}
            {userType === "client" && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">Información de Empresa</h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company"
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
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industria</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sitio web</FormLabel>
                        <FormControl>
                          <Input type="url" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamaño de la empresa</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tamaño" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 empleados</SelectItem>
                            <SelectItem value="11-50">
                              11-50 empleados
                            </SelectItem>
                            <SelectItem value="51-200">
                              51-200 empleados
                            </SelectItem>
                            <SelectItem value="201-500">
                              201-500 empleados
                            </SelectItem>
                            <SelectItem value="501+">501+ empleados</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="companyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción de la empresa</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Describe tu empresa y sus servicios
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando perfil..." : "Completar configuración"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
