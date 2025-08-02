"use server";

import { revalidatePath } from "next/cache";
import {
  updateContractStatus,
  releaseContractPayments,
  createDispute,
  getContractWithParties,
  getUserProfileByAuthId,
} from "@/lib/db/queries/platform";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

async function getCurrentUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  // Obtener el perfil completo del usuario desde la base de datos
  const userProfile = await getUserProfileByAuthId(user.id);

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

export async function getContractPDF(contractId: string): Promise<Blob> {
  try {
    const user = await getCurrentUserProfile();

    // Obtener los datos del contrato usando la query
    const contract = await getContractWithParties(contractId);

    if (!contract) {
      throw new Error("Contrato no encontrado");
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
