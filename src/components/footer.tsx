import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-bold">
              <Sparkles className="h-5 w-5" />
              trato.
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto sm:mx-0">
              Simplificando la gestión de equipos globales con pagos seguros y
              contratos inteligentes.
            </p>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="mb-4 text-sm font-semibold">Producto</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#features"
                  className="hover:text-foreground transition-colors"
                >
                  Características
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-foreground transition-colors"
                >
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Precios
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="mb-4 text-sm font-semibold">Empresa</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-foreground transition-colors"
                >
                  Trabaja con Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-6 border-t pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground text-center sm:text-left order-2 sm:order-1">
            © {new Date().getFullYear()} trato.. Todos los derechos reservados.
          </p>
          <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50 transition-colors"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
