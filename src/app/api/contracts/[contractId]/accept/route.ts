import { db } from '@/lib/db';
import { contracts, contractContractors } from '@/lib/db/schema/platform';
import { user } from '@/lib/db/schema/auth';
import { requireAuth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { contractId: string } }
) {
  try {
    const currentUser = await requireAuth();
    const { walletAddress } = await request.json();

    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Dirección de wallet inválida' },
        { status: 400 }
      );
    }

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
        { success: false, error: 'El contrato no está disponible para aceptación' },
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
        { success: false, error: 'No tienes permisos para aceptar este contrato' },
        { status: 403 }
      );
    }

    // Actualizar la wallet address del usuario
    await db
      .update(user)
      .set({
        walletAddress,
        updatedAt: new Date(),
      })
      .where(eq(user.id, currentUser.id));

    // Actualizar el estado del contrato a 'accepted' (o 'in_progress')
    await db
      .update(contracts)
      .set({
        status: 'accepted',
        acceptedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, params.contractId));

    return NextResponse.json({
      success: true,
      message: 'Contrato aceptado exitosamente. Los fondos están ahora asegurados en escrow.',
    });

  } catch (error) {
    console.error('Error accepting contract:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}