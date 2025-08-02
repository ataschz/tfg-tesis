import Link from "next/link";
import { LogOut } from "lucide-react";
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
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NavigationClient } from "@/components/navigation-client";

async function signOutAction() {
  "use server";
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/");
}

export async function Navigation() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">trato.</span>
          </Link>

          <NavigationClient />

          <div className="hidden md:flex md:items-center md:space-x-8">
            {session && (
              <Link href="/dashboard/contract/new">
                <Button>Crear Contrato</Button>
              </Link>
            )}

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-3">
                    {session.user.name || session.user.email}
                    <Avatar className="h-8 w-8 border-2 border-background transition-transform hover:scale-105 hover:z-10">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback>
                        {(session.user.name || session.user.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
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
                  <DropdownMenuItem>
                    <form action={signOutAction}>
                      <button
                        type="submit"
                        className="flex items-center w-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Iniciar sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Registrarse</Link>
                </Button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
