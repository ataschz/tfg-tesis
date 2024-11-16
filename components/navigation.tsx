"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Pact Fast</span>
          </Link>

          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-lg p-0"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Abrir menú</span>
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="#features" className="text-foreground/60 transition hover:text-foreground">
              Características
            </Link>
            <Link href="#how-it-works" className="text-foreground/60 transition hover:text-foreground">
              Cómo Funciona
            </Link>
            <Link href="#pricing" className="text-foreground/60 transition hover:text-foreground">
              Precios
            </Link>
            <Link href="/signin">
              <Button>Empezar Ahora</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <Link
                href="#features"
                className="block rounded-lg px-3 py-2 text-base font-medium text-foreground/60 hover:bg-accent hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Características
              </Link>
              <Link
                href="#how-it-works"
                className="block rounded-lg px-3 py-2 text-base font-medium text-foreground/60 hover:bg-accent hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Cómo Funciona
              </Link>
              <Link
                href="#pricing"
                className="block rounded-lg px-3 py-2 text-base font-medium text-foreground/60 hover:bg-accent hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Precios
              </Link>
              <div className="px-3 py-2">
                <Link href="/signin">
                  <Button className="w-full">Empezar Ahora</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}