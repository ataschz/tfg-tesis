import { getContractDetail } from "@/lib/db/queries/contracts";
import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  try {
    const currentUser = await requireAuth();
    const { contractId } = await params;

    // Obtener los detalles del contrato
    const contract = await getContractDetail(contractId);

    if (!contract) {
      return NextResponse.json(
        { success: false, error: "Contrato no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que el usuario tenga acceso al contrato
    const hasAccess =
      contract.clientId === currentUser.profile.id ||
      contract.contractorId === currentUser.profile.id ||
      contract.contractClients?.some(
        (cc) => cc.clientId === currentUser.profile.id
      ) ||
      contract.contractContractors?.some(
        (cc) => cc.contractorId === currentUser.profile.id
      );

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: "No tienes acceso a este contrato" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      contract,
    });
  } catch (error) {
    console.error("Error fetching contract:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
