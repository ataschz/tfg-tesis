import { db } from "@/lib/db";
import { 
  contracts, 
  contractClients, 
  contractContractors,
  userProfiles 
} from "@/lib/db/schema/platform";
import { eq } from "drizzle-orm";

export async function getContractDetail(contractId: string) {
  try {
    const contract = await db.query.contracts.findFirst({
      where: eq(contracts.id, contractId),
      with: {
        client: {
          with: {
            clientProfile: true,
            contractorProfile: true,
            authUser: {
              columns: {
                email: true,
              },
            },
          },
        },
        contractor: {
          with: {
            clientProfile: true,
            contractorProfile: true,
            authUser: {
              columns: {
                email: true,
              },
            },
          },
        },
        contractClients: {
          with: {
            client: {
              with: {
                clientProfile: true,
                authUser: {
                  columns: {
                    email: true,
                  },
                },
              },
            },
          },
        },
        contractContractors: {
          with: {
            contractor: {
              with: {
                contractorProfile: true,
                authUser: {
                  columns: {
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!contract) {
      return null;
    }

    // Get all participants
    const allClients = [
      contract.client,
      ...(contract.contractClients?.map(cc => cc.client) || [])
    ].filter((client, index, self) => 
      client && self.findIndex(c => c?.id === client.id) === index
    );

    const allContractors = [
      contract.contractor,
      ...(contract.contractContractors?.map(cc => cc.contractor) || [])
    ].filter((contractor, index, self) => 
      contractor && self.findIndex(c => c?.id === contractor.id) === index
    );

    return {
      ...contract,
      allClients,
      allContractors,
    };
  } catch (error) {
    console.error("Error fetching contract detail:", error);
    return null;
  }
}