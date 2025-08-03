import { db } from "@/lib/db";
import { 
  userProfiles, 
  contractorProfiles, 
  clientProfiles,
  reviews,
  contracts,
  type NewReview
} from "@/lib/db/schema/platform";
import { eq, desc, and } from "drizzle-orm";

export async function getUserPublicProfile(userId: string) {
  try {
    // Get user profile with related data
    const userProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.id, userId),
      with: {
        contractorProfile: true,
        clientProfile: true,
        authUser: {
          columns: {
            email: true,
          },
        },
      },
    });

    if (!userProfile) {
      return null;
    }

    // Get reviews received by this user
    const userReviews = await db.query.reviews.findMany({
      where: eq(reviews.reviewedId, userId),
      with: {
        reviewer: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
          with: {
            contractorProfile: {
              columns: {
                username: true,
              },
            },
            clientProfile: {
              columns: {
                company: true,
              },
            },
          },
        },
        contract: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [desc(reviews.createdAt)],
      limit: 20,
    });

    // Calculate average rating
    const avgRating = userReviews.length > 0 
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
      : 0;

    return {
      id: userProfile.id,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.authUser?.email,
      userType: userProfile.userType,
      country: userProfile.country,
      createdAt: userProfile.createdAt,
      contractorProfile: userProfile.contractorProfile,
      clientProfile: userProfile.clientProfile,
      reviews: userReviews,
      averageRating: Number(avgRating.toFixed(1)),
      totalReviews: userReviews.length,
    };
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return null;
  }
}

export async function getUserReviews(userId: string, limit: number = 10) {
  try {
    const userReviews = await db.query.reviews.findMany({
      where: eq(reviews.reviewedId, userId),
      with: {
        reviewer: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
          with: {
            contractorProfile: {
              columns: {
                username: true,
              },
            },
            clientProfile: {
              columns: {
                company: true,
              },
            },
          },
        },
        contract: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [desc(reviews.createdAt)],
      limit,
    });

    return userReviews;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }
}

export async function createReview(reviewData: {
  contractId: string;
  reviewerId: string;
  reviewedId: string;
  rating: number;
  comment?: string;
  reviewType: "client_to_contractor" | "contractor_to_client";
}) {
  try {
    const [review] = await db.insert(reviews).values({
      contractId: reviewData.contractId,
      reviewerId: reviewData.reviewerId,
      reviewedId: reviewData.reviewedId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      reviewType: reviewData.reviewType,
    } satisfies NewReview).returning();

    return { success: true, review };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Error al crear la reseña" };
  }
}

export async function getContractReviews(contractId: string) {
  try {
    const contractReviews = await db.query.reviews.findMany({
      where: eq(reviews.contractId, contractId),
      with: {
        reviewer: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
          with: {
            contractorProfile: {
              columns: {
                username: true,
              },
            },
            clientProfile: {
              columns: {
                company: true,
              },
            },
          },
        },
        reviewed: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
          with: {
            contractorProfile: {
              columns: {
                username: true,
              },
            },
            clientProfile: {
              columns: {
                company: true,
              },
            },
          },
        },
      },
      orderBy: [desc(reviews.createdAt)],
    });

    return contractReviews;
  } catch (error) {
    console.error("Error fetching contract reviews:", error);
    return [];
  }
}

export async function hasUserReviewedContract(contractId: string, reviewerId: string) {
  try {
    const existingReview = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.contractId, contractId),
        eq(reviews.reviewerId, reviewerId)
      ),
    });

    return !!existingReview;
  } catch (error) {
    console.error("Error checking if user has reviewed contract:", error);
    return false;
  }
}