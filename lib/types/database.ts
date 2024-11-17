// Previous imports and interfaces remain the same...

export interface Deliverable {
  title: string;
  description: string;
}

export interface Contract {
  id: string;
  companyId: string;
  contractorId: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  title: string;
  description: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  deliverables: Deliverable[];
  createdAt: string;
  updatedAt: string;
}