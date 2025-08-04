import { db } from '@/lib/db';
import { contracts, contractClients, contractContractors } from '@/lib/db/schema/platform';
import { blockchainService } from '@/lib/blockchain';
import { requireAuth } from '@/lib/auth';
import { eq, and, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { contractId: string } }
) {
  try {
    const currentUser = await requireAuth();

    // Verificar que el contrato existe y está en estado apropiado
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

    if (contract.status !== 'accepted' && contract.status !== 'in_progress') {
      return NextResponse.json(
        { success: false, error: 'Solo se pueden disputar contratos activos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario actual es participante del contrato
    const [clientRecord] = await db
      .select()
      .from(contractClients)
      .where(
        and(
          eq(contractClients.contractId, params.contractId),
          eq(contractClients.clientId, currentUser.profile.id)
        )
      );

    const [contractorRecord] = await db
      .select()
      .from(contractContractors)
      .where(
        and(
          eq(contractContractors.contractId, params.contractId),
          eq(contractContractors.contractorId, currentUser.profile.id)
        )
      );

    if (!clientRecord && !contractorRecord) {
      return NextResponse.json(
        { success: false, error: 'Solo los participantes del contrato pueden iniciar una disputa' },
        { status: 403 }
      );
    }

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
      .where(eq(contracts.id, params.contractId));

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