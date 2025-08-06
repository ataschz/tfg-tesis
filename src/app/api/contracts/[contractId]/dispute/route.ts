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

    // Verificar que el contrato existe y está en estado apropiado
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

    if (contract.status !== 'accepted' && contract.status !== 'in_progress') {
      return NextResponse.json(
        { success: false, error: 'Solo se pueden disputar contratos activos' },
        { status: 400 }
      );
    }

    // Para demo: sin verificación de participantes

    // Llamar al smart contract para marcar como disputado
    if (contract.blockchainContractId) {
      try {
        await blockchainService.setDisputed(contract.blockchainContractId);
      } catch (blockchainError) {
        console.error('Error setting dispute:', blockchainError);
        return NextResponse.json(
          { success: false, error: 'Error al marcar el contrato como disputado en blockchain' },
          { status: 500 }
        );
      }
    }

    // Actualizar el estado del contrato a 'in_dispute'
    await db
      .update(contracts)
      .set({
        status: 'in_dispute',
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, contractId));

    return NextResponse.json({
      success: true,
      message: 'Disputa iniciada exitosamente. Un administrador revisará el caso y resolverá la disputa.',
    });

  } catch (error) {
    console.error('Error initiating dispute:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}