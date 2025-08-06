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
        { success: false, error: 'El contrato no está en un estado válido para liberar fondos' },
        { status: 400 }
      );
    }

    // Para demo: sin verificación de permisos

    // Los fondos ya fueron liberados por el frontend via MetaMask
    // Este endpoint solo actualiza el estado en la base de datos

    // Actualizar el estado del contrato a 'completed'
    await db
      .update(contracts)
      .set({
        status: 'completed',
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, contractId));

    return NextResponse.json({
      success: true,
      message: 'Fondos liberados exitosamente al freelancer. El contrato ha sido completado.',
    });

  } catch (error) {
    console.error('Error releasing funds:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}