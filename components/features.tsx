import { Card } from "@/components/ui/card";
import { Shield, Banknote, Scale, Globe, Clock, Users } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="container space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold md:text-4xl">¿Por qué elegir strap.so?</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Todo lo que necesitas para gestionar tu nómina global con confianza
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="group relative overflow-hidden p-6 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

const features = [
  {
    title: "Garantía de Pago",
    description: "Los fondos se mantienen seguros hasta que el trabajo se complete y verifique, protegiendo a ambas partes.",
    icon: Shield,
  },
  {
    title: "Nómina Global",
    description: "Paga a equipos en más de 150 países con tarifas competitivas y soporte de moneda local.",
    icon: Globe,
  },
  {
    title: "Pagos Instantáneos",
    description: "Procesa pagos en tiempo real con nuestra avanzada infraestructura de pagos.",
    icon: Clock,
  },
  {
    title: "Gestión de Equipos",
    description: "Administra fácilmente contratistas, empleados y proveedores en un solo lugar.",
    icon: Users,
  },
  {
    title: "Multi-Moneda",
    description: "Soporte para más de 50 monedas con tipos de cambio en tiempo real y comisiones mínimas.",
    icon: Banknote,
  },
  {
    title: "Resolución de Disputas",
    description: "Proceso justo y eficiente de resolución con equipo de soporte dedicado.",
    icon: Scale,
  },
];