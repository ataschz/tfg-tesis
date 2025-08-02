export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen">
      <main className="flex-1 flex items-center justify-center p-6 lg:p-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
