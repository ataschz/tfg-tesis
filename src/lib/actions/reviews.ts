"use server";

import { requireAuth } from "@/lib/auth";
import { getContractDetail } from "@/lib/db/queries/contracts";
import {
  createReview,
  hasUserReviewedContract,
} from "@/lib/db/queries/profiles";
import { reviewSchema } from "@/components/reviews/review-schema";

interface CreateReviewActionParams {
  contractId: string;
  reviewedUserId: string;
  rating: number;
  comment?: string;
}

export async function createReviewAction(params: CreateReviewActionParams) {
  try {
    // Authenticate user
    const currentUser = await requireAuth();
    const { contractId, reviewedUserId, rating, comment } = params;

    // Validate input
    const validatedData = reviewSchema.parse({ rating, comment });

    // Get contract details
    const contract = await getContractDetail(contractId);
    if (!contract) {
      return { success: false, error: "Contrato no encontrado" };
    }

    // Check if contract is in a final state that allows reviews
    const finalStates = ["completed", "cancelled"];
    if (!finalStates.includes(contract.status)) {
      return {
        success: false,
        error:
          "Solo se pueden dejar reseñas en contratos completados o cancelados",
      };
    }

    // Verify user has access to this contract
    const userIsClient =
      contract.clientId === currentUser.profile.id ||
      contract.contractClients?.some(
        (cc) => cc.clientId === currentUser.profile.id
      );

    const userIsContractor =
      contract.contractorId === currentUser.profile.id ||
      contract.contractContractors?.some(
        (cc) => cc.contractorId === currentUser.profile.id
      );

    if (!userIsClient && !userIsContractor) {
      return {
        success: false,
        error: "No tienes permisos para revisar este contrato",
      };
    }

    // Verify reviewed user is part of the contract
    const reviewedIsClient =
      contract.clientId === reviewedUserId ||
      contract.contractClients?.some((cc) => cc.clientId === reviewedUserId);

    const reviewedIsContractor =
      contract.contractorId === reviewedUserId ||
      contract.contractContractors?.some(
        (cc) => cc.contractorId === reviewedUserId
      );

    if (!reviewedIsClient && !reviewedIsContractor) {
      return {
        success: false,
        error: "El usuario a revisar no es parte de este contrato",
      };
    }

    // Verify user is not trying to review themselves
    if (currentUser.profile.id === reviewedUserId) {
      return {
        success: false,
        error: "No puedes escribir una reseña sobre ti mismo",
      };
    }

    // Verify user hasn't already reviewed this contract
    const hasReviewed = await hasUserReviewedContract(
      contractId,
      currentUser.profile.id
    );
    if (hasReviewed) {
      return {
        success: false,
        error: "Ya has dejado una reseña para este contrato",
      };
    }

    // Determine review type
    let reviewType: "client_to_contractor" | "contractor_to_client";

    if (userIsClient && reviewedIsContractor) {
      reviewType = "client_to_contractor";
    } else if (userIsContractor && reviewedIsClient) {
      reviewType = "contractor_to_client";
    } else {
      return {
        success: false,
        error:
          "Tipo de reseña inválido. Los clientes solo pueden revisar contratistas y viceversa",
      };
    }

    // Create the review
    const result = await createReview({
      contractId,
      reviewerId: currentUser.profile.id,
      reviewedId: reviewedUserId,
      rating: validatedData.rating,
      comment: validatedData.comment,
      reviewType,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, review: result.review };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function checkUserReviewStatus(contractId: string) {
  try {
    const currentUser = await requireAuth();
    const hasReviewed = await hasUserReviewedContract(
      contractId,
      currentUser.profile.id
    );
    return { success: true, hasReviewed };
  } catch (error) {
    console.error("Error checking review status:", error);
    return { success: false, hasReviewed: false };
  }
}
