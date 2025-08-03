import { db } from "@/lib/db";
import {
  contracts,
  disputes,
  payments,
  userProfiles,
  contractorProfiles,
  clientProfiles,
  contractClients,
  contractContractors,
  type NewUserProfile,
  type NewContractorProfile,
  type NewClientProfile,
} from "@/lib/db/schema/platform";
import { eq, or, inArray } from "drizzle-orm";

export async function getContractWithParties(contractId: string) {
  return await db.query.contracts.findFirst({
    where: eq(contracts.id, contractId),
    with: {
      client: {
        with: {
          clientProfile: true,
          contractorProfile: true,
        },
      },
      contractor: {
        with: {
          clientProfile: true,
          contractorProfile: true,
        },
      },
    },
  });
}

export async function updateContractStatus(contractId: string, status: any) {
  return await db
    .update(contracts)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(contracts.id, contractId));
}

export async function releaseContractPayments(contractId: string) {
  return await db
    .update(payments)
    .set({
      status: "released",
      releasedAt: new Date(),
    })
    .where(eq(payments.contractId, contractId));
}

export async function createDispute(data: {
  contractId: string;
  initiatorId: string;
  reason: string;
  description: string;
  initiatedBy: "client" | "contractor";
}) {
  return await db.insert(disputes).values({
    contractId: data.contractId,
    initiatorId: data.initiatorId,
    reason: data.reason,
    description: data.description,
    initiatedBy: data.initiatedBy,
    status: "open",
  });
}

export async function getUserContracts(
  userId: string,
  userType: "client" | "contractor"
) {
  if (userType === "client") {
    // Find contracts where user is either primary client or in contractClients table
    const clientContractIds = await db
      .select({ contractId: contractClients.contractId })
      .from(contractClients)
      .where(eq(contractClients.clientId, userId));
    
    const contractIds = clientContractIds.map(c => c.contractId);
    
    if (contractIds.length === 0) {
      // Also check primary client field for backward compatibility
      return await db.query.contracts.findMany({
        where: eq(contracts.clientId, userId),
        with: {
          client: {
            with: {
              clientProfile: true,
            },
          },
          contractor: {
            with: {
              contractorProfile: true,
            },
          },
        },
      });
    }
    
    return await db.query.contracts.findMany({
      where: or(
        eq(contracts.clientId, userId),
        inArray(contracts.id, contractIds)
      ),
      with: {
        client: {
          with: {
            clientProfile: true,
          },
        },
        contractor: {
          with: {
            contractorProfile: true,
          },
        },
      },
    });
  } else {
    // Find contracts where user is either primary contractor or in contractContractors table
    const contractorContractIds = await db
      .select({ contractId: contractContractors.contractId })
      .from(contractContractors)
      .where(eq(contractContractors.contractorId, userId));
    
    const contractIds = contractorContractIds.map(c => c.contractId);
    
    if (contractIds.length === 0) {
      // Also check primary contractor field for backward compatibility
      return await db.query.contracts.findMany({
        where: eq(contracts.contractorId, userId),
        with: {
          client: {
            with: {
              clientProfile: true,
            },
          },
          contractor: {
            with: {
              contractorProfile: true,
            },
          },
        },
      });
    }
    
    return await db.query.contracts.findMany({
      where: or(
        eq(contracts.contractorId, userId),
        inArray(contracts.id, contractIds)
      ),
      with: {
        client: {
          with: {
            clientProfile: true,
          },
        },
        contractor: {
          with: {
            contractorProfile: true,
          },
        },
      },
    });
  }
}

export async function getContractById(contractId: string) {
  return await db.query.contracts.findFirst({
    where: eq(contracts.id, contractId),
  });
}

export async function getUserProfileByAuthId(authUserId: string) {
  // Get user profile first
  const userProfile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, authUserId),
  });

  if (!userProfile) {
    return null;
  }

  // Get specific profiles based on user type
  let clientProfile = null;
  let contractorProfile = null;

  if (userProfile.userType === "client") {
    clientProfile = await db.query.clientProfiles.findFirst({
      where: eq(clientProfiles.userProfileId, userProfile.id),
    });
  } else if (userProfile.userType === "contractor") {
    contractorProfile = await db.query.contractorProfiles.findFirst({
      where: eq(contractorProfiles.userProfileId, userProfile.id),
    });
  }

  return {
    ...userProfile,
    clientProfile,
    contractorProfile,
  };
}

export async function getUserContractStats(
  userId: string,
  userType: "client" | "contractor"
) {
  const userContracts = await getUserContracts(userId, userType);

  const activeContracts = userContracts.filter(
    (contract) =>
      contract.status === "in_progress" || contract.status === "accepted"
  );

  const completedContracts = userContracts.filter(
    (contract) => contract.status === "completed"
  );

  // Calculate total earnings/spending
  const totalAmount = userContracts.reduce((sum, contract) => {
    return sum + Number(contract.amount);
  }, 0);

  // Calculate escrow amount (contracts in progress)
  const escrowAmount = activeContracts.reduce((sum, contract) => {
    return sum + Number(contract.amount);
  }, 0);

  return {
    totalContracts: userContracts.length,
    activeContracts: activeContracts.length,
    completedContracts: completedContracts.length,
    totalAmount,
    escrowAmount,
    contracts: userContracts,
  };
}

// Profile creation functions
export async function createUserProfile(data: NewUserProfile) {
  const [userProfile] = await db.insert(userProfiles).values(data).returning();
  return userProfile;
}

export async function createContractorProfile(data: NewContractorProfile) {
  const [contractorProfile] = await db
    .insert(contractorProfiles)
    .values(data)
    .returning();
  return contractorProfile;
}

export async function createClientProfile(data: NewClientProfile) {
  const [clientProfile] = await db
    .insert(clientProfiles)
    .values(data)
    .returning();
  return clientProfile;
}

export async function createCompleteProfile(profileData: {
  userProfile: Omit<NewUserProfile, "id">;
  contractorProfile?: Omit<NewContractorProfile, "id" | "userProfileId">;
  clientProfile?: Omit<NewClientProfile, "id" | "userProfileId">;
}) {
  return await db.transaction(async (tx) => {
    // Create user profile first
    const [userProfile] = await tx
      .insert(userProfiles)
      .values(profileData.userProfile)
      .returning();

    let contractorProfile = null;
    let clientProfile = null;

    // Create specific profile based on user type
    if (profileData.contractorProfile) {
      [contractorProfile] = await tx
        .insert(contractorProfiles)
        .values({
          ...profileData.contractorProfile,
          userProfileId: userProfile.id,
        })
        .returning();
    }

    if (profileData.clientProfile) {
      [clientProfile] = await tx
        .insert(clientProfiles)
        .values({
          ...profileData.clientProfile,
          userProfileId: userProfile.id,
        })
        .returning();
    }

    return {
      userProfile,
      contractorProfile,
      clientProfile,
    };
  });
}

// Profile update functions
export async function updateUserProfile(
  userId: string,
  data: Partial<NewUserProfile>
) {
  const [updatedProfile] = await db
    .update(userProfiles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.userId, userId))
    .returning();
  return updatedProfile;
}

export async function updateContractorProfile(
  userProfileId: string,
  data: Partial<NewContractorProfile>
) {
  const [updatedProfile] = await db
    .update(contractorProfiles)
    .set(data)
    .where(eq(contractorProfiles.userProfileId, userProfileId))
    .returning();
  return updatedProfile;
}

export async function updateClientProfile(
  userProfileId: string,
  data: Partial<NewClientProfile>
) {
  const [updatedProfile] = await db
    .update(clientProfiles)
    .set(data)
    .where(eq(clientProfiles.userProfileId, userProfileId))
    .returning();
  return updatedProfile;
}

export async function getActiveContractors() {
  return await db.query.userProfiles.findMany({
    where: eq(userProfiles.userType, "contractor"),
    with: {
      contractorProfile: true,
      authUser: {
        columns: {
          email: true,
        },
      },
    },
  });
}

export async function getActiveClients() {
  return await db.query.userProfiles.findMany({
    where: eq(userProfiles.userType, "client"),
    with: {
      clientProfile: true,
      authUser: {
        columns: {
          email: true,
        },
      },
    },
  });
}

export async function updateCompleteProfile(
  userId: string,
  profileData: {
    userProfile: Partial<NewUserProfile>;
    contractorProfile?: Partial<NewContractorProfile>;
    clientProfile?: Partial<NewClientProfile>;
  }
) {
  try {
    // Update user profile first
    const [userProfile] = await db
      .update(userProfiles)
      .set({
        ...profileData.userProfile,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId))
      .returning();

    let contractorProfile = null;
    let clientProfile = null;

    // Update or create contractor profile if data provided
    if (profileData.contractorProfile) {
      try {
        // Try to update first
        const updatedProfiles = await db
          .update(contractorProfiles)
          .set(profileData.contractorProfile)
          .where(eq(contractorProfiles.userProfileId, userProfile.id))
          .returning();

        if (updatedProfiles.length > 0) {
          contractorProfile = updatedProfiles[0];
        } else {
          // If no rows were updated, create new profile
          [contractorProfile] = await db
            .insert(contractorProfiles)
            .values({
              ...profileData.contractorProfile,
              userProfileId: userProfile.id,
            })
            .returning();
        }
      } catch (insertError) {
        console.error("Error with contractor profile:", insertError);
        // Fallback: just try to create
        try {
          [contractorProfile] = await db
            .insert(contractorProfiles)
            .values({
              ...profileData.contractorProfile,
              userProfileId: userProfile.id,
            })
            .returning();
        } catch (finalError) {
          console.error("Final contractor profile error:", finalError);
        }
      }
    }

    // Update or create client profile if data provided
    if (profileData.clientProfile) {
      try {
        // Try to update first
        const updatedProfiles = await db
          .update(clientProfiles)
          .set(profileData.clientProfile)
          .where(eq(clientProfiles.userProfileId, userProfile.id))
          .returning();

        if (updatedProfiles.length > 0) {
          clientProfile = updatedProfiles[0];
        } else {
          // If no rows were updated, create new profile
          [clientProfile] = await db
            .insert(clientProfiles)
            .values({
              ...profileData.clientProfile,
              userProfileId: userProfile.id,
            })
            .returning();
        }
      } catch (insertError) {
        console.error("Error with client profile:", insertError);
        // Fallback: just try to create
        try {
          [clientProfile] = await db
            .insert(clientProfiles)
            .values({
              ...profileData.clientProfile,
              userProfileId: userProfile.id,
            })
            .returning();
        } catch (finalError) {
          console.error("Final client profile error:", finalError);
        }
      }
    }

    return {
      userProfile,
      contractorProfile,
      clientProfile,
    };
  } catch (error) {
    console.error("Error updating complete profile:", error);
    throw new Error("Error al actualizar el perfil");
  }
}
