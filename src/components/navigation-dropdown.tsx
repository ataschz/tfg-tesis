"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

interface User {
  id: string;
  name?: string;
  email: string;
  image?: string | null;
}

interface NavigationDropdownProps {
  user: User;
}

export function NavigationDropdown({ user }: NavigationDropdownProps) {
  const handleSignOut = async () => {
    await authClient.signOut();
    redirect("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-3">
          {user.name || user.email}
          <Avatar className="h-8 w-8 border-2 border-background transition-transform hover:scale-105 hover:z-10">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
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
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
