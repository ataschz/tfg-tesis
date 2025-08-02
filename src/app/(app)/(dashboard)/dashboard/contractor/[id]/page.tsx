import { notFound } from "next/navigation";
import { getContractorProfile } from "@/lib/actions/contractor";
import { ContractorProfile } from "@/components/profiles/contractor-profile";
import contractorsData from "@/lib/data/contractors.json";

interface ContractorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return contractorsData.contractors.map((contractor) => ({
    id: contractor.id,
  }));
}

export default async function ContractorPage({ params }: ContractorPageProps) {
  const { id } = await params;
  const contractor = await getContractorProfile(id);

  if (!contractor) {
    notFound();
  }

  return <ContractorProfile contractor={contractor} />;
}
