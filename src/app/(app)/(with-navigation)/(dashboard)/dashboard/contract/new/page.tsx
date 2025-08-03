import {
  getActiveContractors,
  getActiveClients,
} from "@/lib/db/queries/platform";
import { NewContractClient } from "@/components/company/new-contract-client";
import { requireAuth } from "@/lib/auth";

export default async function NewContractPage() {
  const [contractors, clients, currentUser] = await Promise.all([
    getActiveContractors(),
    getActiveClients(),
    requireAuth(),
  ]);

  const mappedContractors = contractors.map((contractor) => ({
    id: contractor.id,
    firstName: contractor.firstName,
    lastName: contractor.lastName,
    email: contractor.authUser?.email || "",
    contractorProfile: contractor.contractorProfile
      ? {
          skills: contractor.contractorProfile.skills || [],
          hourlyRate: contractor.contractorProfile.hourlyRate || "0",
          bio: contractor.contractorProfile.bio || "",
        }
      : null,
  }));

  const mappedClients = clients.map((client) => ({
    id: client.id,
    firstName: client.firstName,
    lastName: client.lastName,
    email: client.authUser?.email || "",
    clientProfile: client.clientProfile
      ? {
          companyName: client.clientProfile.company || "",
          companyDescription: client.clientProfile.companyDescription || "",
          industry: client.clientProfile.industry || "",
        }
      : null,
  }));

  const userType =
    currentUser.role === "client" || currentUser.role === "contractor"
      ? currentUser.role
      : undefined;

  return (
    <div className="container space-y-6 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Contrato</h1>
        <p className="text-lg text-muted-foreground">
          Define contract terms and add participants. Our AI system will help
          generate a professional contract.
        </p>
      </div>

      <NewContractClient
        contractors={mappedContractors}
        clients={mappedClients}
        currentUserId={currentUser.profile.id}
        currentUserType={userType}
      />
    </div>
  );
}
