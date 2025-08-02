import { Navigation } from "@/components/navigation";

export default function WithNavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      <Navigation />
      <div className="mx-auto w-full max-w-7xl p-4">{children}</div>
    </div>
  );
}
