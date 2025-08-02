import { Card } from "@/components/ui/card";
import { Users, Globe2, Clock, Shield } from "lucide-react";

export function Stats() {
  return (
    <section className="container">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 backdrop-blur-sm">
            <stat.icon className="h-6 w-6 text-primary" />
            <div className="mt-4">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Empleados pagados",
  },
  {
    icon: Globe2,
    value: "150+",
    label: "Países soportados",
  },
  {
    icon: Clock,
    value: "99.9%",
    label: "Disponibilidad garantizada",
  },
  {
    icon: Shield,
    value: "$100M+",
    label: "Procesados de forma segura",
  },
];