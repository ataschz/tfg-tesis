import { getCurrentUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import { ProfileSetupForm } from '@/components/auth/profile-setup-form';

export default async function ProfileSetupPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/signin');
  }

  // If user already has a profile, redirect to dashboard
  if (user.profile) {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto max-w-md py-10">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Completa tu perfil</h1>
          <p className="text-muted-foreground">
            Por favor, completa la información de tu perfil para continuar
          </p>
        </div>
        
        <ProfileSetupForm user={user} />
      </div>
    </div>
  );
}