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
    const { favorBuyer } = await request.json();

    // Para demo: sin verificación de admin

    // Verificar que el contrato existe y está en disputa
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

    if (contract.status !== 'in_dispute') {
      return NextResponse.json(
        { success: false, error: 'El contrato no está en disputa' },
        { status: 400 }
      );
    }

    if (typeof favorBuyer !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Debe especificar si se favorece al buyer (true) o seller (false)' },
        { status: 400 }
      );
    }

    // Llamar al smart contract para resolver la disputa
    if (contract.blockchainContractId) {
      try {
        await blockchainService.resolveDispute(contract.blockchainContractId, favorBuyer);
      } catch (blockchainError) {
        console.error('Error resolving dispute:', blockchainError);
        return NextResponse.json(
          { success: false, error: 'Error al resolver la disputa en blockchain' },
          { status: 500 }
        );
      }
    }

    // Actualizar el estado del contrato a 'completed'
    await db
      .update(contracts)
      .set({
        status: 'completed',
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, contractId));

    const winner = favorBuyer ? 'empresa' : 'freelancer';
    const action = favorBuyer ? 'devueltos a la empresa' : 'liberados al freelancer';

    return NextResponse.json({
      success: true,
      message: `Disputa resuelta a favor del ${winner}. Los fondos han sido ${action}.`,
    });

  } catch (error) {
    console.error('Error resolving dispute:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}