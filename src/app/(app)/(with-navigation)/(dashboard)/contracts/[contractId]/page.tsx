import { getContractDetail } from "@/lib/db/queries/contracts";
import { ContractDetail } from "@/components/contracts/contract-detail";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";

interface ContractDetailPageProps {
  params: Promise<{
    contractId: string;
  }>;
}

export default async function ContractDetailPage({ params }: ContractDetailPageProps) {
  try {
    const { contractId } = await params;
    const [currentUser, contract] = await Promise.all([
      requireAuth(),
      getContractDetail(contractId)
    ]);
    
    if (!contract) {
      notFound();
    }

    // Check if user has access to this contract
    const hasAccess = 
      contract.clientId === currentUser.profile.id ||
      contract.contractorId === currentUser.profile.id ||
      contract.contractClients?.some(cc => cc.clientId === currentUser.profile.id) ||
      contract.contractContractors?.some(cc => cc.contractorId === currentUser.profile.id);

    if (!hasAccess) {
      notFound();
    }

    return (
      <div className="container max-w-6xl mx-auto py-8">
        <ContractDetail contract={contract} currentUserId={currentUser.profile.id} />
      </div>
    );
  } catch (error) {
    console.error("Error loading contract:", error);
    notFound();
  }
}