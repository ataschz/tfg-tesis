"use server";

import { db } from "@/lib/db";
import { disputeEvidence } from "@/lib/db/schema/platform";
import { requireAuth } from "@/lib/auth";

export async function addDisputeEvidence(
  disputeId: string,
  evidenceData: {
    evidenceType: 'document' | 'image' | 'video' | 'text';
    description: string;
    fileUrl?: string;
  }
) {
  try {
    const user = await requireAuth();

    // Insert evidence into database
    const [evidence] = await db
      .insert(disputeEvidence)
      .values({
        disputeId,
        userProfileId: user.profile.id,
        evidenceType: evidenceData.evidenceType,
        description: evidenceData.description,
        fileUrl: evidenceData.fileUrl || null,
      })
      .returning();

    return { 
      success: true, 
      message: "Evidencia agregada exitosamente",
      evidence 
    };
  } catch (error) {
    console.error("Error adding dispute evidence:", error);
    return { 
      success: false, 
      error: "Error al agregar la evidencia",
      evidence: null 
    };
  }
}

export async function getDisputeEvidence(disputeId: string) {
  try {
    const user = await requireAuth();

    const evidence = await db.query.disputeEvidence.findMany({
      where: (evidence, { eq }) => eq(evidence.disputeId, disputeId),
      with: {
        userProfile: {
          with: {
            authUser: {
              columns: { email: true }
            }
          }
        }
      },
      orderBy: (evidence, { desc }) => [desc(evidence.createdAt)]
    });

    return { 
      success: true, 
      evidence 
    };
  } catch (error) {
    console.error("Error fetching dispute evidence:", error);
    return { 
      success: false, 
      error: "Error al obtener la evidencia",
      evidence: [] 
    };
  }
}