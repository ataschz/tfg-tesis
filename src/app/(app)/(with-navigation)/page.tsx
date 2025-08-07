import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[50%] top-0 h-[1000px] w-[1000px] -translate-x-[50%] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute right-[25%] top-[300px] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            {/* Hero Section */}
            <section className="relative">
              <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-8 text-center">
                <h1 className="text-4xl font-bold sm:text-6xl md:text-7xl lg:text-8xl font-libre">
                  trato.
                  <span className="relative block whitespace-nowrap">
                    <span className="relative bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 bg-clip-text text-transparent">
                      Contratos Seguros
                    </span>
                  </span>
                </h1>
                <p className="max-w-[42rem] text-lg leading-normal text-muted-foreground sm:text-xl sm:leading-8 md:text-2xl">
                  Plataforma de pago de nóminas con resguardo de fondos y resolución de disputas. 
                  Pagos procesados en Ethereum para máxima seguridad y transparencia.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/sign-in">
                    <Button size="lg" className="gap-2 text-lg px-8 py-6">
                      Comenzar
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="mx-auto max-w-[1200px]">
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Pagos Seguros</h3>
                  <p className="text-muted-foreground">
                    Fondos protegidos mediante contratos inteligentes en blockchain Ethereum. 
                    Liberación automática o manual de pagos.
                  </p>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                    <Zap className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Resolución de Disputas</h3>
                  <p className="text-muted-foreground">
                    Sistema integrado de mediación para resolver conflictos de forma rápida 
                    y justa entre contratantes y contratistas.
                  </p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                    <Globe className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Global y Transparente</h3>
                  <p className="text-muted-foreground">
                    Trabaja con cualquier persona en el mundo. Todas las transacciones 
                    son verificables en la blockchain.
                  </p>
                </Card>
              </div>
            </section>

            {/* CTA Section */}
            <section>
              <Card className="relative overflow-hidden max-w-[800px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-background dark:to-cyan-950" />
                <div className="relative p-8 md:p-12 text-center space-y-6">
                  <h3 className="text-2xl font-bold md:text-3xl">
                    ¿Listo para trabajar de forma segura?
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Únete a trato. y gestiona tus contratos con la tranquilidad 
                    que brinda la tecnología blockchain.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/sign-up">
                      <Button size="lg" className="gap-2">
                        Crear Cuenta
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button size="lg" variant="outline">
                        Iniciar Sesión
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

