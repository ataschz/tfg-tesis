import { requireAuth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect to /signin if user is not authenticated
  await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
