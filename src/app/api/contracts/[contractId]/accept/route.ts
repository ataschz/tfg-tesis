import { db } from "@/lib/db";
import { contracts, contractContractors } from "@/lib/db/schema/platform";
import { user } from "@/lib/db/schema/auth";
import { requireAuth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  try {
    const currentUser = await requireAuth();
    const { contractId } = await params;

    // Obtener la información del usuario incluyendo wallet address
    const [userData] = await db
      .select({ walletAddress: user.walletAddress })
      .from(user)
      .where(eq(user.id, currentUser.id));

    // Verificar que el usuario tenga una wallet address configurada
    if (
      !userData?.walletAddress ||
      !/^0x[a-fA-F0-9]{40}$/.test(userData.walletAddress)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Debes configurar una dirección de wallet válida en tu perfil antes de aceptar contratos",
        },
        { status: 400 }
      );
    }

    // Verificar que el contrato existe y está en estado pending_acceptance
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, contractId));

    if (!contract) {
      return NextResponse.json(
        { success: false, error: "Contrato no encontrado" },
        { status: 404 }
      );
    }

    if (contract.status !== "pending_acceptance") {
      return NextResponse.json(
        {
          success: false,
          error: "El contrato no está disponible para aceptación",
        },
        { status: 400 }
      );
    }

    // La wallet address ya está configurada en el perfil del usuario, no es necesario actualizarla

    // Actualizar el estado del contrato a 'accepted'
    await db
      .update(contracts)
      .set({
        status: "accepted",
        acceptedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, contractId));

    return NextResponse.json({
      success: true,
      message:
        "Contrato aceptado exitosamente. Los fondos están ahora asegurados en escrow.",
    });
  } catch (error) {
    console.error("Error accepting contract:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
