import { getUserPublicProfile } from "@/lib/db/queries/profiles";
import { PublicProfile } from "@/components/profiles/public-profile";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  try {
    const { userId } = await params;
    const profile = await getUserPublicProfile(userId);
    
    if (!profile) {
      notFound();
    }

    return (
      <div className="container max-w-4xl mx-auto py-8">
        <PublicProfile profile={profile} />
      </div>
    );
  } catch (error) {
    console.error("Error loading profile:", error);
    notFound();
  }
}