"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { signOut } from "@/lib/actions/auth";

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserDisplayName = () => {
    if (!user?.profile) return user?.email || "Usuario";

    if (user.role === "client" && user.profile.extended?.company) {
      return user.profile.extended.company || user.email;
    } else {
      return (
        `${user.profile.firstName} ${user.profile.lastName}`.trim() ||
        user.email
      );
    }
  };

  const getUserInitials = () => {
    if (!user?.profile) return user?.email?.charAt(0).toUpperCase() || "U";

    if (user.role === "client" && user.profile.extended?.company) {
      return user.profile.extended.company.charAt(0).toUpperCase() || "C";
    } else {
      return `${user.profile.firstName?.charAt(0) || ""}${
        user.profile.lastName?.charAt(0) || ""
      }`.toUpperCase();
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">getcontract</span>
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
            {/* <Link
              href="#features"
              className="text-foreground/60 transition hover:text-foreground"
            >
              Características
            </Link>
            <Link
              href="#how-it-works"
              className="text-foreground/60 transition hover:text-foreground"
            >
              Cómo Funciona
            </Link>
            <Link
              href="#pricing"
              className="text-foreground/60 transition hover:text-foreground"
            >
              Precios
            </Link> */}
            {user &&
              !loading &&
              pathname !== "/dashboard/contract/new" &&
              pathname !== "/admin/disputes" &&
              user.role !== "mediator" && (
                <Link href="/dashboard/contract/new">
                  <Button>Crear Contrato</Button>
                </Link>
              )}

            {user && !loading ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-3">
                    {getUserDisplayName()}
                    <Avatar className="h-8 w-8 border-2 border-background transition-transform hover:scale-105 hover:z-10">
                      <AvatarImage src={undefined} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/signin">Iniciar sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Registrarse</Link>
                </Button>
              </div>
            )}
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
