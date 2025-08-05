"use server";

import { revalidatePath } from "next/cache";
import {
  updateContractStatus,
  releaseContractPayments,
  createDispute,
  getContractWithParties,
  getUserProfileByAuthId,
  getUserContractStats,
} from "@/lib/db/queries/platform";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getCurrentUserProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Obtener el perfil completo del usuario desde la base de datos
  const userProfile = await getUserProfileByAuthId(session.user.id);

  if (!userProfile) {
    throw new Error("Perfil de usuario no encontrado");
  }

  return userProfile;
}

export async function releaseFunds(contractId: string) {
  try {
    const user = await getCurrentUserProfile();

    // Actualizar el estado del contrato a completado
    await updateContractStatus(contractId, "completed");

    // Liberar fondos de pagos relacionados
    await releaseContractPayments(contractId);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error al liberar fondos:", error);
    throw new Error("Error al liberar fondos");
  }
}

export async function initiateDispute(contractId: string, reason: string) {
  try {
    const user = await getCurrentUserProfile();

    // Crear nueva disputa
    await createDispute({
      contractId,
      initiatorId: user.id, // Usando el ID del perfil de usuario
      reason,
      description: reason,
      initiatedBy: "client", // Asumiendo que es iniciada por el cliente
    });

    // Actualizar el estado del contrato
    await updateContractStatus(contractId, "in_dispute");

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error al iniciar disputa:", error);
    throw new Error("Error al iniciar disputa");
  }
}

export async function getCompanyData() {
  try {
    const user = await getCurrentUserProfile();

    if (user.userType !== "client") {
      throw new Error("El usuario no es una empresa/cliente");
    }

    // Obtener estadísticas y contratos de la empresa
    const contractStats = await getUserContractStats(user.id, "client");

    // Calcular estadísticas específicas
    const stats = {
      totalSpent: contractStats.totalAmount,
      escrowAmount: contractStats.escrowAmount,
      activeContracts: contractStats.activeContracts,
      upcomingPayments: contractStats.activeContracts, // Simplificado, podrías calcular pagos pendientes
      currency: user.preferredCurrency || "ETH",
    };

    // Transformar contratos para el frontend
    const contracts = contractStats.contracts.map((contract) => ({
      id: contract.id,
      title: contract.title,
      description: contract.description,
      amount: Number(contract.amount),
      currency: contract.currency,
      status: contract.status,
      startDate: contract.startDate,
      endDate: contract.endDate,
      client: {
        id: contract.client.id,
        firstName: contract.client.firstName,
        lastName: contract.client.lastName,
        company: contract.client.clientProfile?.company || null,
      },
      contractor: {
        id: contract.contractor.id,
        firstName: contract.contractor.firstName,
        lastName: contract.contractor.lastName,
        username: contract.contractor.contractorProfile?.username || null,
      },
    }));

    return {
      stats,
      contracts,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.userId, // Asumiendo que userId es el email o referencia al auth
        clientProfile: user.clientProfile,
      },
    };
  } catch (error) {
    console.error("Error al obtener datos de la empresa:", error);
    throw new Error("Error al obtener datos de la empresa");
  }
}

export async function getContractPDF(contractId: string): Promise<Blob> {
  try {
    const user = await getCurrentUserProfile();

    // Obtener los datos del contrato usando la query
    const contract = await getContractWithParties(contractId);

    if (!contract) {
      throw new Error("Contrato no encontrado");
    }

    // Verificar que el usuario tiene acceso al contrato
    if (contract.contractorId !== user.id && contract.clientId !== user.id) {
      throw new Error("No tienes acceso a este contrato");
    }

    // Generar PDF simple (en producción usarías una librería como jsPDF o Puppeteer)
    const pdfContent = `
      CONTRATO: ${contract.title}
      
      Descripción: ${contract.description}
      Monto: ${contract.currency} ${contract.amount}
      Estado: ${contract.status}
      Fecha de inicio: ${contract.startDate || "No especificada"}
      Fecha de fin: ${contract.endDate || "No especificada"}
      
      Cliente: ${contract.client.firstName} ${contract.client.lastName}
      Contratista: ${contract.contractor.firstName} ${
      contract.contractor.lastName
    }
      
      Términos y condiciones: ${
        contract.termsAndConditions || "No especificados"
      }
    `;

    // Crear un blob simple con el contenido (en producción generarías un PDF real)
    const blob = new Blob([pdfContent], { type: "application/pdf" });
    return blob;
  } catch (error) {
    console.error("Error al generar PDF:", error);
    throw new Error("Error al generar PDF del contrato");
  }
}
