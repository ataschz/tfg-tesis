"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NavigationCreateButton() {
  const pathname = usePathname();
  
  // Hide the "Crear Contrato" button when we're in the contract creation process
  const isInContractCreationFlow = 
    pathname === "/dashboard/contract/new" ||
    pathname.startsWith("/new/deposit/") ||
    pathname.startsWith("/accept/");

  if (isInContractCreationFlow) {
    return null;
  }

  return (
    <Link href="/dashboard/contract/new">
      <Button>Crear Contrato</Button>
    </Link>
  );
}