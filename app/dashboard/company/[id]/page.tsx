import { notFound } from "next/navigation";
import { getCompanyProfile } from "@/lib/actions/company";
import { CompanyProfile } from "@/components/profiles/company-profile";
import { companies } from "@/lib/data/companies.json";

interface CompanyPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return companies.map((company) => ({
    id: company.id,
  }));
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const company = await getCompanyProfile(params.id);

  if (!company) {
    notFound();
  }

  return <CompanyProfile company={company} />;
}
