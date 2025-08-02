"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export function NavigationClient() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4 md:hidden">
        <ThemeToggle />
        <Button
          variant="ghost"
          className="h-9 w-9 rounded-lg p-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Abrir menú</span>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 md:hidden bg-background border-b">
          <div className="container mx-auto px-4">
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
                <Link href="/sign-in">
                  <Button className="w-full">Empezar Ahora</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
