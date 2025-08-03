"use server";

import { db } from "@/lib/db";
import { 
  contracts, 
  contractClients, 
  contractContractors,
  type NewContract,
  type NewContractClient,
  type NewContractContractor
} from "@/lib/db/schema/platform";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createContract(formData: {
  title: string;
  description: string;
  amount: string;
  currency: string;
  startDate: Date;
  endDate: Date;
  contractors: string[];
  companies: string[];
  deliverables: Array<{
    title: string;
    description: string;
  }>;
  termsAndConditions: string;
}) {
  try {
    const currentUser = await requireAuth();

    // Validate that we have at least one contractor and one client
    if (formData.contractors.length === 0) {
      throw new Error("Debe seleccionar al menos un contratista");
    }

    if (formData.companies.length === 0) {
      throw new Error("Debe seleccionar al menos una empresa");
    }

    // Determine primary participants (first in each array)
    const primaryContractorId = formData.contractors[0];
    const primaryClientId = formData.companies[0];

    // Prepare deliverables as text array
    const deliverablesArray = formData.deliverables.map(d => d.title);

    // Create contract in a transaction
    const result = await db.transaction(async (tx) => {
      // Create the main contract
      const [contract] = await tx.insert(contracts).values({
        title: formData.title,
        description: formData.description,
        amount: formData.amount,
        currency: formData.currency,
        startDate: formData.startDate.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD
        endDate: formData.endDate.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD
        deliverables: deliverablesArray,
        termsAndConditions: formData.termsAndConditions,
        clientId: primaryClientId,
        contractorId: primaryContractorId,
        status: "sent",
      } satisfies NewContract).returning();

      // Add all contractors to the many-to-many table
      const contractorInserts: NewContractContractor[] = formData.contractors.map((contractorId, index) => ({
        contractId: contract.id,
        contractorId: contractorId,
        isPrimary: index === 0, // First one is primary
      }));

      await tx.insert(contractContractors).values(contractorInserts);

      // Add all clients to the many-to-many table
      const clientInserts: NewContractClient[] = formData.companies.map((clientId, index) => ({
        contractId: contract.id,
        clientId: clientId,
        isPrimary: index === 0, // First one is primary
      }));

      await tx.insert(contractClients).values(clientInserts);

      return contract;
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contracts");
    
    return {
      success: true,
      contractId: result.id,
      message: "Contrato creado exitosamente",
    };

  } catch (error) {
    console.error("Error creating contract:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear el contrato",
    };
  }
}