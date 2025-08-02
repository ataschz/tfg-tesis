import { requireClient } from "@/lib/auth";
import { CompanyDashboard } from "@/components/company/dashboard";

export default async function CompanyDashboardPage() {
  const user = await requireClient();

  return <CompanyDashboard />;
}
