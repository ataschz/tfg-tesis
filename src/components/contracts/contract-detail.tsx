"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContractHeader } from "./contract-header";
import { ContractInfo } from "./contract-info";
import { ContractParticipants } from "./contract-participants";
import { ContractDeliverables } from "./contract-deliverables";
import { ContractTerms } from "./contract-terms";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContractDetailProps {
  contract: any;
  currentUserId: string;
}

export function ContractDetail({ contract, currentUserId }: ContractDetailProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>

      {/* Contract Header */}
      <ContractHeader contract={contract} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <ContractInfo contract={contract} />
          <ContractDeliverables deliverables={contract.deliverables || []} />
          {contract.termsAndConditions && (
            <ContractTerms termsAndConditions={contract.termsAndConditions} />
          )}
        </div>

        {/* Right Column - Participants */}
        <div className="lg:col-span-1">
          <ContractParticipants 
            clients={contract.allClients || []}
            contractors={contract.allContractors || []}
          />
        </div>
      </div>
    </div>
  );
}