import { requireAuth } from "@/lib/auth";
import { UnifiedDashboard } from "@/components/unified/dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await requireAuth();

  // Show appropriate dashboard content based on user role
  switch (user.role) {
    case "client":
    case "contractor":
      return <UnifiedDashboard />;
    case "mediator":
      // Mediators use their separate admin dashboard
      redirect("/admin/disputes");
    default:
      redirect("/signin");
  }
}
