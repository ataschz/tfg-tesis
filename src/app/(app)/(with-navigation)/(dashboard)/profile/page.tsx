import { redirect } from "next/navigation";
import { ProfileSetupForm } from "@/components/auth/profile-setup-form";
import { getCurrentUser } from "@/lib/actions/auth";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  // Si no hay perfil, significa que necesita completar el registro
  if (!currentUser.profile) {
    redirect("/sign-in");
  }

  // Get wallet address from auth table
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const authUser = await db.query.user.findFirst({
    where: eq(user.id, session!.user.id),
    columns: {
      walletAddress: true,
    },
  });

  const userType = currentUser.profile.userType;
  
  // Combine user data with wallet address
  const userWithWallet = {
    ...currentUser,
    walletAddress: authUser?.walletAddress || null,
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <ProfileSetupForm user={userWithWallet} userType={userType} />
    </div>
  );
}
