import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Cómo Funciona</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Comienza en minutos con nuestro proceso simple de configuración
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-0 right-0 top-1/2 hidden h-px bg-border md:block" />
        <div className="relative grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={index} className="relative p-6">
              <div className="mb-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-muted-foreground md:block" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Crea tu Cuenta",
    description: "Regístrate y verifica tu empresa en minutos con nuestro proceso simplificado.",
  },
  {
    title: "Añade tu Equipo",
    description: "Invita a miembros del equipo y contratistas, configura horarios de pago y reglas de cumplimiento.",
  },
  {
    title: "Comienza a Pagar",
    description: "Fondea tu cuenta y comienza a procesar pagos globales con protección integrada.",
  },
];