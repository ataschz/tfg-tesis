import { db } from '@/lib/db';
import { contracts } from '@/lib/db/schema/platform';
import { blockchainService } from '@/lib/blockchain';
import { requireAuth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { contractId: string } }
) {
  try {
    await requireAuth();

    // Buscar el contrato en la DB
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

    if (!contract.blockchainContractId) {
      return NextResponse.json(
        { success: false, error: 'Contrato no desplegado en blockchain' },
        { status: 400 }
      );
    }

    // Verificar el depósito en blockchain
    const hasDeposit = await blockchainService.hasDeposit(contract.blockchainContractId);

    if (hasDeposit && contract.status === 'awaiting_deposit') {
      // Actualizar el estado del contrato a pending_acceptance
      await db
        .update(contracts)
        .set({
          status: 'pending_acceptance',
          updatedAt: new Date(),
        })
        .where(eq(contracts.id, params.contractId));

      return NextResponse.json({
        success: true,
        hasDeposit: true,
        message: 'Depósito detectado. Contrato actualizado a pending_acceptance.',
      });
    }

    return NextResponse.json({
      success: true,
      hasDeposit,
      message: hasDeposit ? 'Depósito confirmado' : 'Depósito no detectado aún',
    });

  } catch (error) {
    console.error('Error checking deposit:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}