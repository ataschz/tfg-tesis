import { db } from '@/lib/db';
import { contracts } from '@/lib/db/schema/platform';
import { blockchainService } from '@/lib/blockchain';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  try {
    const { contractId } = await params;

    // Verificar que el contrato existe y está en estado pending_acceptance
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, contractId));

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

    // Para demo: sin verificación de permisos

    // Llamar al smart contract para devolver los fondos al buyer
    if (contract.blockchainContractId) {
      try {
        await blockchainService.refundToBuyer(contract.blockchainContractId);
      } catch (blockchainError) {
        console.error('Error refunding to buyer:', blockchainError);
        return NextResponse.json(
          { success: false, error: 'Error al devolver los fondos a la empresa' },
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
      .where(eq(contracts.id, contractId));

    return NextResponse.json({
      success: true,
      message: 'Contrato rechazado exitosamente. Los fondos han sido devueltos a la empresa.',
    });

  } catch (error) {
    console.error('Error rejecting contract:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}