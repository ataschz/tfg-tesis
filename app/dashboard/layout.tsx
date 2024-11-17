export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}