import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, CircleDot, Minus, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[50%] top-0 h-[1000px] w-[1000px] -translate-x-[50%] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute right-[25%] top-[300px] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="space-y-24 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
          <section className="container relative">
            <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-medium">
                    Actualmente en Beta Cerrada
                  </span>
                </span>
              </Badge>
              <h1 className="text-4xl font-bold sm:text-6xl md:text-7xl lg:text-8xl">
                Paga a tu Equipo
                <span className="relative block whitespace-nowrap">
                  <span className="relative bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 bg-clip-text text-transparent">
                    En Cualquier País
                  </span>
                </span>
              </h1>
              <p className="max-w-[42rem] text-lg leading-normal text-muted-foreground sm:text-xl sm:leading-8 md:text-2xl">
                Contratos seguros, pagos instantáneos y cumplimiento
                automatizado. Todo en una plataforma.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/signin">
                  <Button size="lg" className="gap-2 text-lg px-8 py-6">
                    Empieza Gratis
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 text-lg px-8 py-6"
                  >
                    Ver Demo
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Demo Section */}
          <section className="container">
            <div className="mx-auto max-w-[1200px]">
              <div className="rounded-xl bg-gradient-to-b from-muted/50 to-muted p-1 shadow-xl">
                <div className="rounded-lg bg-background">
                  {/* Browser Chrome */}
                  <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="mx-auto w-full max-w-md rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground">
                        getcontract.app/dashboard
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <Image
                      src="/getcontract-preview.jpg"
                      alt="Dashboard Preview"
                      width={400}
                      height={300}
                      className="rounded-lg border shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Features />
          <HowItWorks />
          <Testimonials />

          <section className="container">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-background dark:to-cyan-950" />
              <div className="relative grid gap-6 p-8 md:grid-cols-2 md:p-12">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold md:text-3xl">
                    ¿Listo para transformar tu nómina?
                  </h3>
                  <p className="text-muted-foreground">
                    Únete a miles de empresas que usan getcontract para
                    gestionar su fuerza laboral global. Comienza tu prueba
                    gratuita hoy.
                  </p>
                  <ul className="grid gap-2">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold">14 días gratis</div>
                    <div className="text-muted-foreground">
                      Sin tarjeta de crédito
                    </div>
                  </div>
                  <Link href="/signin">
                    <Button size="lg" className="w-full md:w-auto">
                      Comenzar Prueba Gratuita
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

const benefits = [
  "Sin costos de configuración ni ocultos",
  "Cancela cuando quieras",
  "Soporte global 24/7",
  "Seguro y regulado",
];
