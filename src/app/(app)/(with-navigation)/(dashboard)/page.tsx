import { requireAuth } from "@/lib/auth";
import { UnifiedDashboard } from "@/components/unified/dashboard";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
  const user = await requireAuth();

  // Redirect mediators to admin
  if (user.role === "mediator") {
    console.log("redirecting to admin");
    redirect("/admin");
  }

  // Show dashboard for clients and contractors
  return <UnifiedDashboard />;
}
