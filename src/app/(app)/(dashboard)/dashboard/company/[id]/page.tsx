import { notFound } from "next/navigation";
import { getCompanyProfile } from "@/lib/actions/company";
import { CompanyProfile } from "@/components/profiles/company-profile";
import companiesData from "@/lib/data/companies.json";

interface CompanyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return companiesData.companies.map((company) => ({
    id: company.id,
  }));
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const company = await getCompanyProfile(id);

  if (!company) {
    notFound();
  }

  return <CompanyProfile company={company} />;
}
