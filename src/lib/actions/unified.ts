"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getUserContractStats,
  getUserProfileByAuthId,
} from "@/lib/db/queries/platform";

async function getCurrentUserProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userProfile = await getUserProfileByAuthId(session.user.id);

  if (!userProfile) {
    throw new Error("Perfil de usuario no encontrado");
  }

  return userProfile;
}

export async function getUnifiedDashboardData() {
  try {
    const user = await getCurrentUserProfile();

    let contractorData = null;
    let companyData = null;

    // Try to get contractor data if user is a contractor or has both roles
    if (user.userType === "contractor" || user.userType === "mediator") {
      try {
        const contractStats = await getUserContractStats(user.id, "contractor");
        
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

        contractorData = {
          stats: {
            totalEarnings: contractStats.totalAmount,
            escrowAmount: contractStats.escrowAmount,
            activeContracts: contractStats.activeContracts,
            completedContracts: contractStats.completedContracts,
            currency: user.preferredCurrency || "ETH",
          },
          contracts,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.userId,
            contractorProfile: user.contractorProfile,
          },
        };
      } catch (error) {
        console.log("User doesn't have contractor data:", error);
      }
    }

    // Try to get company data if user is a client or has both roles
    if (user.userType === "client" || user.userType === "mediator") {
      try {
        const contractStats = await getUserContractStats(user.id, "client");

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

        companyData = {
          stats: {
            totalSpent: contractStats.totalAmount,
            escrowAmount: contractStats.escrowAmount,
            activeContracts: contractStats.activeContracts,
            upcomingPayments: contractStats.activeContracts, // Simplified
            currency: user.preferredCurrency || "ETH",
          },
          contracts,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.userId,
            clientProfile: user.clientProfile,
          },
        };
      } catch (error) {
        console.log("User doesn't have company data:", error);
      }
    }

    return {
      userType: user.userType,
      userProfile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.userId,
        preferredCurrency: user.preferredCurrency,
      },
      contractorData: contractorData || {
        contracts: [],
        stats: { totalEarnings: 0, escrowAmount: 0, activeContracts: 0, completedContracts: 0, currency: "ETH" }
      },
      companyData: companyData || {
        contracts: [],
        stats: { totalSpent: 0, escrowAmount: 0, activeContracts: 0, upcomingPayments: 0, currency: "ETH" }
      },
    };
  } catch (error) {
    console.error("Error al obtener datos unificados:", error);
    throw new Error("Error al obtener datos del dashboard");
  }
}