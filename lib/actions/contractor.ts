'use server';

import { contractors } from '@/lib/data/contractors.json';
import { contracts } from '@/lib/data/contracts.json';
import { companies } from '@/lib/data/companies.json';
import type { ContractWithParties } from '@/lib/types/dashboard';
import type { Contractor } from '@/lib/types/database';

export async function getContractorData() {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // En el futuro, esto será una consulta a Supabase
  const contractor = contractors[0]; // Simulamos el contratista actual
  const contractorContracts = contracts.filter(
    (contract) => contract.contractorId === contractor.id
  );

  const contractsWithParties: ContractWithParties[] = contractorContracts.map((contract) => {
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

  // Calcular el saldo pendiente sumando los montos de los hitos pendientes
  const pendingAmount = contractorContracts.reduce((total, contract) => {
    if (contract.milestones) {
      return total + contract.milestones
        .filter(m => m.status !== 'completed')
        .reduce((sum, m) => sum + m.amount, 0);
    }
    return total;
  }, 0);

  return {
    user: contractor,
    balance: {
      available: 12500,
      pending: pendingAmount,
      currency: 'USD',
    },
    contracts: contractsWithParties,
  };
}

export async function getContractorProfile(id: string): Promise<Contractor | null> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // En el futuro, esto será una consulta a Supabase
  const contractor = contractors.find(c => c.id === id);
  return contractor || null;
}

export async function getContractPDF(contractId: string): Promise<Blob> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // En un caso real, esto generaría el PDF desde el servidor
  return new Blob(['Contenido del contrato'], { type: 'application/pdf' });
}