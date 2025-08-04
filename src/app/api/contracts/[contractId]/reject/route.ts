import { db } from '@/lib/db';
import { contracts, contractContractors } from '@/lib/db/schema/platform';
import { blockchainService } from '@/lib/blockchain';
import { requireAuth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { contractId: string } }
) {
  try {
    const currentUser = await requireAuth();

    // Verificar que el contrato existe y está en estado pending_acceptance
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, params.contractId));

    if (!contract) {
      return NextResponse.json(
        { success: false, error: 'Contrato no encontrado' },
        { status: 404 }
      );
    }

    if (contract.status !== 'pending_acceptance') {
      return NextResponse.json(
        { success: false, error: 'El contrato no está disponible para rechazo' },
        { status: 400 }
      );
    }

    // Verificar que el usuario actual es el contractor del contrato
    const [contractorRecord] = await db
      .select()
      .from(contractContractors)
      .where(
        and(
          eq(contractContractors.contractId, params.contractId),
          eq(contractContractors.contractorId, currentUser.profile.id)
        )
      );

    if (!contractorRecord) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para rechazar este contrato' },
        { status: 403 }
      );
    }

    // Llamar al smart contract para devolver los fondos al buyer
    if (contract.blockchainContractId) {
      try {
        await blockchainService.refundToBuyer(contract.blockchainContractId);
      } catch (blockchainError) {
        console.error('Error refunding to buyer:', blockchainError);
        return NextResponse.json(
          { success: false, error: 'Error al devolver los fondos al cliente' },
          { status: 500 }
        );
      }
    }

    // Actualizar el estado del contrato a 'rejected'
    await db
      .update(contracts)
      .set({
        status: 'rejected',
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, params.contractId));

    return NextResponse.json({
      success: true,
      message: 'Contrato rechazado exitosamente. Los fondos han sido devueltos al cliente.',
    });

  } catch (error) {
    console.error('Error rejecting contract:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}