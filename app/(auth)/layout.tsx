export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500" />
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative h-full flex items-center justify-center p-8">
          <div className="space-y-4 text-white">
            <h1 className="text-4xl font-bold">strap.so</h1>
            <p className="text-lg">La plataforma líder en pagos seguros para equipos globales</p>
          </div>
        </div>
      </div>
      <main className="flex items-center justify-center p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}