import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="container space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Amado por las Empresas</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Descubre lo que nuestros clientes dicen sobre Pact Fast
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="flex flex-col justify-between p-6">
            <div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="mt-4">
                <p className="text-muted-foreground">{testimonial.quote}</p>
              </blockquote>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <Avatar>
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary">
                  {testimonial.author[0]}
                </div>
              </Avatar>
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote: "Pact Fast ha transformado la forma en que gestionamos nuestro equipo global. El sistema de garantía nos da tranquilidad y la plataforma es increíblemente fácil de usar.",
    author: "Sara Martínez",
    role: "CEO de TechFlow",
  },
  {
    quote: "La mejor solución de nómina para equipos internacionales. Hemos reducido el tiempo de procesamiento de pagos en un 75% y ahorrado miles en comisiones.",
    author: "Miguel Rodríguez",
    role: "COO de GlobalScale",
  },
  {
    quote: "Soporte excepcional y características robustas. Pact Fast ha simplificado nuestro cumplimiento y ha hecho que pagar a los contratistas sea libre de estrés.",
    author: "Elena Torres",
    role: "Directora de RRHH en DevCorp",
  },
];