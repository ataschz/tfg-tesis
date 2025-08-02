"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProfileSetupFormProps {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export function ProfileSetupForm({ user }: ProfileSetupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.name?.split(" ")[0] || "",
    lastName: user.name?.split(" ").slice(1).join(" ") || "",
    phone: "",
    country: "",
    userType: "" as "client" | "contractor" | "mediator" | "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userType) {
      alert("Por favor selecciona un tipo de usuario");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement profile creation logic
      console.log("Creating profile with data:", formData);
      
      // For now, just redirect to dashboard
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <Label>Tipo de usuario</Label>
            <RadioGroup
              value={formData.userType}
              onValueChange={(value) => setFormData({ ...formData, userType: value as any })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client">Cliente / Empresa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contractor" id="contractor" />
                <Label htmlFor="contractor">Contratista</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mediator" id="mediator" />
                <Label htmlFor="mediator">Mediador</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando perfil..." : "Completar configuración"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}