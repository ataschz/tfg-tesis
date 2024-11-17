'use client';

import { useState } from 'react';
import { DisputesList } from '@/components/admin/disputes-list';
import { DisputesStats } from '@/components/admin/disputes-stats';
import { DisputesFilters } from '@/components/admin/disputes-filters';
import { DisputesHeader } from '@/components/admin/disputes-header';

// TODO: Replace with real data fetching
const mockDisputes = [
  {
    id: "dispute_01",
    contractId: "contract_01",
    status: "pending",
    priority: "high",
    reason: "payment_delay",
    description: "Retraso en el pago del milestone completado",
    amount: 1500,
    currency: "USD",
    createdAt: "2024-03-10T14:00:00Z",
    contract: {
      title: "Desarrollo Frontend React",
      company: {
        name: "TechSolutions SA",
        email: "rrhh@techsolutions.com",
      },
      contractor: {
        name: "Ana García",
        email: "ana.garcia@gmail.com",
      },
    },
  },
  // Add more mock disputes...
];

export default function DisputesDashboardPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const stats = {
    total: 24,
    pending: 8,
    inProgress: 12,
    resolved: 4,
    escalated: 2,
  };

  return (
    <div className="container py-8">
      <DisputesHeader />
      
      <div className="mt-8 space-y-6">
        <DisputesStats stats={stats} />
        
        <DisputesFilters 
          selectedStatus={selectedStatus}
          selectedPriority={selectedPriority}
          onStatusChange={setSelectedStatus}
          onPriorityChange={setSelectedPriority}
        />

        <DisputesList disputes={mockDisputes} />
      </div>
    </div>
  );
}