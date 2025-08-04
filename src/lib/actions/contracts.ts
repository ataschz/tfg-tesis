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
import { user } from "@/lib/db/schema/auth";
import { blockchainService } from "@/lib/blockchain";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

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
      redirectTo: `/new/deposit/${result.id}`,
    };

  } catch (error) {
    console.error("Error creating contract:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear el contrato",
    };
  }
}

export async function initializeBlockchainContract(contractId: string) {
  try {
    const currentUser = await requireAuth();

    // Buscar el contrato en la DB
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, contractId));

    if (!contract) {
      return {
        success: false,
        error: 'Contrato no encontrado',
      };
    }

    // Verificar que el usuario actual sea el creator del contrato
    if (contract.clientId !== currentUser.profile.id) {
      return {
        success: false,
        error: 'No tienes permisos para inicializar este contrato',
      };
    }

    // Obtener los datos del buyer (client) y seller (contractor)
    const [buyerData] = await db
      .select({
        walletAddress: user.walletAddress,
      })
      .from(user)
      .where(eq(user.id, currentUser.id));

    const [sellerData] = await db
      .select({
        walletAddress: user.walletAddress,
      })
      .from(user)
      .innerJoin(contractContractors, eq(user.id, contractContractors.contractorId))
      .where(eq(contractContractors.contractId, contractId))
      .limit(1);

    if (!buyerData?.walletAddress) {
      return {
        success: false,
        error: 'Debes configurar tu wallet address en tu perfil antes de crear el contrato',
      };
    }

    if (!sellerData?.walletAddress) {
      return {
        success: false,
        error: 'El contractor debe tener una wallet address configurada',
      };
    }

    // Crear el contrato en blockchain
    const endDate = contract.endDate ? new Date(contract.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días por defecto
    
    await blockchainService.createEscrow(
      contractId,
      buyerData.walletAddress,
      sellerData.walletAddress,
      endDate,
      contract.description || contract.title
    );

    // Actualizar el estado del contrato en DB
    await db
      .update(contracts)
      .set({
        status: 'awaiting_deposit',
        blockchainContractId: contractId,
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, contractId));

    revalidatePath('/dashboard');

    return {
      success: true,
      contractId,
      escrowManagerAddress: blockchainService.getEscrowManagerAddress(),
      totalAmount: contract.amount,
      message: 'Contrato blockchain creado exitosamente',
    };
  } catch (error) {
    console.error('Error initializing blockchain contract:', error);
    return {
      success: false,
      error: 'Error al crear el contrato en blockchain',
    };
  }
}