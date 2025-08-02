import { db } from "@/lib/db";
import {
  contracts,
  disputes,
  payments,
  userProfiles,
} from "@/lib/db/schema/platform";
import { eq } from "drizzle-orm";

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
  } else {
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
}

export async function getContractById(contractId: string) {
  return await db.query.contracts.findFirst({
    where: eq(contracts.id, contractId),
  });
}

export async function getUserProfileByAuthId(authUserId: string) {
  return await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, authUserId),
    with: {
      clientProfile: true,
      contractorProfile: true,
    },
  });
}
