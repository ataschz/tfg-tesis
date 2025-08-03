"use server";

import { db } from "@/lib/db";
import { disputes, contracts, disputeEvidence, payments } from "@/lib/db/schema/platform";
import { requireAuth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function getAllDisputes() {
  try {
    const user = await requireAuth();

    // Only mediators/admins can access all disputes
    if (user.profile.userType !== "mediator") {
      return { success: false, error: "No tienes permisos para acceder a esta sección", disputes: [] };
    }

    const disputesList = await db.query.disputes.findMany({
      orderBy: [desc(disputes.createdAt)],
      with: {
        contract: {
          with: {
            client: {
              with: {
                clientProfile: true,
                authUser: {
                  columns: { email: true }
                }
              }
            },
            contractor: {
              with: {
                contractorProfile: true,
                authUser: {
                  columns: { email: true }
                }
              }
            }
          }
        },
        initiator: {
          with: {
            clientProfile: true,
            contractorProfile: true,
            authUser: {
              columns: { email: true }
            }
          }
        },
        mediator: {
          with: {
            authUser: {
              columns: { email: true }
            }
          }
        },
        evidence: true
      }
    });

    return { success: true, disputes: disputesList };
  } catch (error) {
    console.error("Error fetching all disputes:", error);
    return { success: false, error: "Error al obtener las disputas", disputes: [] };
  }
}

export async function getDisputeDetail(disputeId: string) {
  try {
    const user = await requireAuth();

    // Only mediators/admins can access dispute details
    if (user.profile.userType !== "mediator") {
      return { success: false, error: "No tienes permisos para acceder a esta disputa", dispute: null };
    }

    const dispute = await db.query.disputes.findFirst({
      where: eq(disputes.id, disputeId),
      with: {
        contract: {
          with: {
            client: {
              with: {
                clientProfile: true,
                contractorProfile: true,
                authUser: {
                  columns: { email: true }
                }
              }
            },
            contractor: {
              with: {
                clientProfile: true,
                contractorProfile: true,
                authUser: {
                  columns: { email: true }
                }
              }
            },
            contractClients: {
              with: {
                client: {
                  with: {
                    clientProfile: true,
                    authUser: {
                      columns: { email: true }
                    }
                  }
                }
              }
            },
            contractContractors: {
              with: {
                contractor: {
                  with: {
                    contractorProfile: true,
                    authUser: {
                      columns: { email: true }
                    }
                  }
                }
              }
            }
          }
        },
        initiator: {
          with: {
            clientProfile: true,
            contractorProfile: true,
            authUser: {
              columns: { email: true }
            }
          }
        },
        mediator: {
          with: {
            authUser: {
              columns: { email: true }
            }
          }
        },
        evidence: {
          with: {
            userProfile: {
              with: {
                authUser: {
                  columns: { email: true }
                }
              }
            }
          }
        }
      }
    });

    if (!dispute) {
      return { success: false, error: "Disputa no encontrada", dispute: null };
    }

    return { success: true, dispute };
  } catch (error) {
    console.error("Error fetching dispute detail:", error);
    return { success: false, error: "Error al obtener los detalles de la disputa", dispute: null };
  }
}

export async function resolveDispute(disputeId: string, resolution: string, resolutionDetails: string, winnerId?: string) {
  try {
    const user = await requireAuth();

    // Only mediators/admins can resolve disputes
    if (user.profile.userType !== "mediator") {
      return { success: false, error: "No tienes permisos para resolver disputas" };
    }

    await db.transaction(async (tx) => {
      // Update dispute
      await tx.update(disputes)
        .set({
          status: "resolved",
          resolution,
          resolutionDetails,
          winnerId,
          mediatorId: user.profile.id,
          resolvedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(disputes.id, disputeId));

      // Update contract status based on resolution type
      const dispute = await tx.query.disputes.findFirst({
        where: eq(disputes.id, disputeId),
        with: { contract: true }
      });

      if (dispute?.contract) {
        let contractStatus: "sent" | "accepted" | "rejected" | "in_progress" | "completed" | "cancelled" | "in_dispute" = "completed";
        let paymentStatus: "pending" | "held" | "released" | "refunded" | "cancelled" = "released";
        
        // Si el ganador es el contratista, se completa el contrato y se libera el pago
        // Si el ganador es el cliente, se cancela el contrato y se reembolsa
        if (winnerId === dispute.contract.contractorId) {
          contractStatus = "completed";
          paymentStatus = "released";
        } else if (winnerId === dispute.contract.clientId) {
          contractStatus = "cancelled";
          paymentStatus = "refunded";
        } else {
          // Resolución sin ganador específico basada en el tipo
          switch (resolution) {
            case "completed":
              contractStatus = "completed";
              paymentStatus = "released";
              break;
            case "refund":
              contractStatus = "cancelled";
              paymentStatus = "refunded";
              break;
            default:
              contractStatus = "completed";
              paymentStatus = "released";
          }
        }
        
        // Actualizar contrato
        await tx.update(contracts)
          .set({
            status: contractStatus,
            updatedAt: new Date()
          })
          .where(eq(contracts.id, dispute.contract.id));

        // Actualizar pagos asociados al contrato
        await tx.update(payments)
          .set({
            status: paymentStatus,
            releasedAt: paymentStatus === "released" ? new Date() : null,
            paidAt: paymentStatus === "refunded" ? new Date() : null,
            updatedAt: new Date()
          })
          .where(eq(payments.contractId, dispute.contract.id));
      }
    });

    return { success: true, message: "Disputa resuelta exitosamente" };
  } catch (error) {
    console.error("Error resolving dispute:", error);
    return { success: false, error: "Error al resolver la disputa" };
  }
}

export async function assignMediatorToDispute(disputeId: string) {
  try {
    const user = await requireAuth();

    // Only mediators/admins can assign themselves to disputes
    if (user.profile.userType !== "mediator") {
      return { success: false, error: "No tienes permisos para asignar mediadores" };
    }

    await db.update(disputes)
      .set({
        mediatorId: user.profile.id,
        status: "under_review",
        updatedAt: new Date()
      })
      .where(eq(disputes.id, disputeId));

    return { success: true, message: "Te has asignado como mediador de esta disputa" };
  } catch (error) {
    console.error("Error assigning mediator:", error);
    return { success: false, error: "Error al asignar mediador" };
  }
}

export async function getDisputeStats() {
  try {
    const user = await requireAuth();

    // Only mediators/admins can access dispute stats
    if (user.profile.userType !== "mediator") {
      return { success: false, error: "No tienes permisos para acceder a las estadísticas", stats: null };
    }

    // Get all disputes and calculate stats
    const allDisputes = await db.query.disputes.findMany();

    const stats = {
      total: allDisputes.length,
      open: allDisputes.filter(d => d.status === "open").length,
      in_progress: allDisputes.filter(d => d.status === "under_review").length,
      resolved: allDisputes.filter(d => d.status === "resolved").length,
      escalated: allDisputes.filter(d => d.status === "closed").length,
    };

    return { success: true, stats };
  } catch (error) {
    console.error("Error fetching dispute stats:", error);
    return { success: false, error: "Error al obtener las estadísticas", stats: null };
  }
}