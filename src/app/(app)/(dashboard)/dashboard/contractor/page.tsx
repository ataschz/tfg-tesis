import { requireContractor } from "@/lib/auth";
import { ContractorDashboard } from "@/components/contractor/dashboard";

export default async function ContractorDashboardPage() {
  const user = await requireContractor();

  return <ContractorDashboard />;
}
