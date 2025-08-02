import { requireAuth } from "@/lib/auth";
import { CompanyDashboard } from "@/components/company/dashboard";
import { ContractorDashboard } from "@/components/contractor/dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await requireAuth();

  // Show appropriate dashboard content based on user role
  switch (user.role) {
    case "client":
      return <CompanyDashboard />;
    case "contractor":
      return <ContractorDashboard />;
    case "mediator":
      // Mediators still use their separate admin dashboard
      redirect("/dashboard/admin");
    default:
      redirect("/signin");
  }
}
