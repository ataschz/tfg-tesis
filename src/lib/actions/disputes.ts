"use server";

import { db } from "@/lib/db";
import { disputes, contracts, disputeEvidence } from "@/lib/db/schema/platform";
import { requireAuth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { blockchainService } from "@/lib/blockchain";

export async function createDispute(formData: {
  contractId: string;
  reason: string;
  description: string;
  disputeType: "total" | "partial";
  milestoneId?: string;
  evidenceFiles?: string[]; // File URLs or identifiers - mocked for now
}) {
  try {
    const user = await requireAuth();

    // Verify user has access to this contract
    const contract = await db.query.contracts.findFirst({
      where: eq(contracts.id, formData.contractId),
      with: {
        contractClients: {
          with: { client: true },
        },
        contractContractors: {
          with: { contractor: true },
        },
      },
    });

    if (!contract) {
      return { success: false, error: "Contrato no encontrado" };
    }

    // Check if user is a participant in the contract
    const isClient = contract.clientId === user.profile.id;
    const isContractor = contract.contractorId === user.profile.id;
    const isAdditionalClient = contract.contractClients?.some(
      (cc) => cc.clientId === user.profile.id
    );
    const isAdditionalContractor = contract.contractContractors?.some(
      (cc) => cc.contractorId === user.profile.id
    );

    if (
      !isClient &&
      !isContractor &&
      !isAdditionalClient &&
      !isAdditionalContractor
    ) {
      return {
        success: false,
        error: "No tienes permisos para crear una disputa en este contrato",
      };
    }

    // Check if contract is already in dispute
    if (contract.status === "in_dispute") {
      return { success: false, error: "Este contrato ya está en disputa" };
    }

    // Check if contract can be disputed (should be accepted or in_progress)
    if (!["accepted", "in_progress", "completed"].includes(contract.status)) {
      return {
        success: false,
        error:
          "Solo se pueden disputar contratos aceptados, en progreso o completados",
      };
    }

    // Mediators cannot initiate disputes, they can only mediate them
    if (user.profile.userType === "mediator") {
      return {
        success: false,
        error: "Los mediadores no pueden iniciar disputas",
      };
    }

    return await db.transaction(async (tx) => {
      // Determine who initiated the dispute (contractor or client)
      const initiatedBy =
        user.profile.userType === "contractor" ? "contractor" : "client";

      // Create the dispute
      const [dispute] = await tx
        .insert(disputes)
        .values({
          contractId: formData.contractId,
          initiatorId: user.profile.id,
          initiatedBy,
          reason: formData.reason,
          description: formData.description,
          status: "open",
          milestoneId:
            formData.disputeType === "partial"
              ? formData.milestoneId || null
              : null,
        })
        .returning();

      // Update contract status to in_dispute
      await tx
        .update(contracts)
        .set({
          status: "in_dispute",
          updatedAt: new Date(),
        })
        .where(eq(contracts.id, formData.contractId));

      // Mark the contract as disputed in the blockchain
      if (contract.blockchainContractId) {
        try {
          await blockchainService.setDisputed(contract.blockchainContractId);
          console.log(
            "✅ Contract marked as disputed in blockchain:",
            contract.blockchainContractId
          );
        } catch (blockchainError) {
          console.error(
            "❌ Error marking contract as disputed in blockchain:",
            blockchainError
          );
          // Don't fail the transaction if blockchain call fails, but log it
          // The admin can manually set disputed status if needed
        }
      } else {
        console.warn(
          "⚠️ Contract does not have blockchainContractId, cannot mark as disputed in blockchain"
        );
      }

      // Add evidence files if provided (mocked for now)
      if (formData.evidenceFiles && formData.evidenceFiles.length > 0) {
        const evidenceData = formData.evidenceFiles.map((fileUrl) => ({
          disputeId: dispute.id,
          userProfileId: user.profile.id,
          evidenceType: "document" as const,
          fileUrl,
          description: "Archivo adjunto como prueba",
        }));

        await tx.insert(disputeEvidence).values(evidenceData);
      }

      // Revalidate relevant paths
      revalidatePath("/dashboard");
      revalidatePath(`/contracts/${formData.contractId}`);

      return {
        success: true,
        message: "Disputa creada exitosamente",
        disputeId: dispute.id,
      };
    });
  } catch (error) {
    console.error("Error creating dispute:", error);
    return {
      success: false,
      error: "Error interno del servidor al crear la disputa",
    };
  }
}

export async function getDisputedContracts() {
  try {
    const user = await requireAuth();

    const disputedContracts = await db.query.contracts.findMany({
      where: eq(contracts.status, "in_dispute"),
      with: {
        client: {
          with: {
            clientProfile: true,
            authUser: {
              columns: { email: true },
            },
          },
        },
        contractor: {
          with: {
            contractorProfile: true,
            authUser: {
              columns: { email: true },
            },
          },
        },
        contractClients: {
          with: {
            client: {
              with: {
                clientProfile: true,
                authUser: {
                  columns: { email: true },
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
                  columns: { email: true },
                },
              },
            },
          },
        },
        disputes: {
          with: {
            initiator: true,
            mediator: true,
          },
        },
      },
    });

    // Filter contracts where user is a participant
    const userContracts = disputedContracts.filter((contract) => {
      const isClient = contract.clientId === user.profile.id;
      const isContractor = contract.contractorId === user.profile.id;
      const isAdditionalClient = contract.contractClients?.some(
        (cc) => cc.clientId === user.profile.id
      );
      const isAdditionalContractor = contract.contractContractors?.some(
        (cc) => cc.contractorId === user.profile.id
      );

      return (
        isClient || isContractor || isAdditionalClient || isAdditionalContractor
      );
    });

    return { success: true, contracts: userContracts };
  } catch (error) {
    console.error("Error fetching disputed contracts:", error);
    return {
      success: false,
      error: "Error al obtener contratos en disputa",
      contracts: [],
    };
  }
}
