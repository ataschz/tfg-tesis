import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavigationClient } from "@/components/navigation-client";
import { NavigationDropdown } from "@/components/navigation-dropdown";
import { NavigationCreateButton } from "@/components/navigation-create-button";
import { getUserProfileByAuthId } from "@/lib/db/queries/platform";

export async function Navigation() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Get user profile to determine role
  let userRole: string | null = null;
  if (session) {
    const userProfile = await getUserProfileByAuthId(session.user.id);
    userRole = userProfile?.userType || null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold ">trato.</span>
          </Link>

          <NavigationClient />

          <div className="hidden md:flex md:items-center md:space-x-8">
            {session && userRole === "client" && <NavigationCreateButton />}

            {session ? (
              <NavigationDropdown user={session.user} userRole={userRole} />
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/sign-in">
                  <Button variant="default" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
