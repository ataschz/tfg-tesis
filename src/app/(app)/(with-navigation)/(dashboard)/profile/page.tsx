import { redirect } from "next/navigation";
import { ProfileSetupForm } from "@/components/auth/profile-setup-form";
import { getCurrentUser } from "@/lib/actions/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Si no hay perfil, significa que necesita completar el registro
  if (!user.profile) {
    redirect("/sign-in");
  }

  const userType = user.profile.userType;

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <ProfileSetupForm user={user} userType={userType} />
    </div>
  );
}
