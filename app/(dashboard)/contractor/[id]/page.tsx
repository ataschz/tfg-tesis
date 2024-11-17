import { notFound } from 'next/navigation';
import { getContractorProfile } from '@/lib/actions/contractor';
import { ContractorProfile } from '@/components/profiles/contractor-profile';
import { contractors } from '@/lib/data/contractors.json';

interface ContractorPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return contractors.map((contractor) => ({
    id: contractor.id,
  }));
}

export default async function ContractorPage({ params }: ContractorPageProps) {
  const contractor = await getContractorProfile(params.id);

  if (!contractor) {
    notFound();
  }

  return <ContractorProfile contractor={contractor} />;
}