"use client";

import { useState } from 'react';
import { DisputesStats } from '@/components/admin/disputes-stats';
import { DisputesHeader } from '@/components/admin/disputes-header';
import { DisputesDataTable } from '@/components/admin/disputes-data-table';

interface AdminDisputesClientProps {
  initialDisputes: any[];
  initialStats: any;
}

export function AdminDisputesClient({ initialDisputes, initialStats }: AdminDisputesClientProps) {
  const [disputes] = useState(initialDisputes);

  return (
    <>
      <DisputesHeader />
      
      <div className="mt-8 space-y-6">
        <DisputesStats stats={initialStats} />
        <DisputesDataTable disputes={disputes} />
      </div>
    </>
  );
}