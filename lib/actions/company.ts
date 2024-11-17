'use server';

import { companies } from '@/lib/data/companies.json';
import { contracts } from '@/lib/data/contracts.json';
import { contractors } from '@/lib/data/contractors.json';
import type { ContractWithParties } from '@/lib/types/dashboard';
import type { Company } from '@/lib/types/database';

export async function getCompanyData() {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // En el futuro, esto será una consulta a Supabase
  const company = companies[0]; // Simulamos la empresa actual
  const companyContracts = contracts.filter(
    (contract) => contract.companyId === company.id
  );

  const contractsWithParties: ContractWithParties[] = companyContracts.map((contract) => {
    const contractContractors = contractors.filter((c) =>
      contract.contractorId === c.id
    );
    const contractCompanies = companies.filter((c) =>
      contract.companyId === c.id
    );

    return {
      ...contract,
      contractors: contractContractors,
      companies: contractCompanies,
    };
  });

  // Calcular montos
  const escrowAmount = companyContracts.reduce((total, contract) => {
    if (contract.status === 'active') {
      return total + contract.amount;
    }
    return total;
  }, 0);

  const upcomingPayments = companyContracts.reduce((total, contract) => {
    if (contract.status === 'active') {
      return total + contract.amount;
    }
    return total;
  }, 0);

  const activeContracts = companyContracts.filter(
    contract => contract.status === 'active'
  ).length;

  return {
    user: company,
    stats: {
      escrowAmount,
      upcomingPayments,
      activeContracts,
      currency: 'USD',
    },
    contracts: contractsWithParties,
  };
}

export async function getCompanyProfile(id: string): Promise<Company | null> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // En el futuro, esto será una consulta a Supabase
  const company = companies.find(c => c.id === id);
  return company || null;
}

export async function releaseFunds(contractId: string) {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // En el futuro, esto será una mutación en Supabase
  return { success: true };
}

export async function initiateDispute(contractId: string, reason: string) {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // En el futuro, esto será una mutación en Supabase
  return { success: true };
}

export async function getContractPDF(contractId: string): Promise<Blob> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // En un caso real, esto generaría el PDF desde el servidor
  return new Blob(['Contenido del contrato'], { type: 'application/pdf' });
}