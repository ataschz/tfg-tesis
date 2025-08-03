"use client";

import { useState } from "react";
import { NewContractForm } from "@/components/company/new-contract-form";
import { ContractEditor } from "@/components/company/contract-editor";

interface NewContractClientProps {
  contractors: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    contractorProfile?: {
      skills: string[];
      hourlyRate: string;
      bio: string;
    } | null;
  }>;
  clients: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    clientProfile?: {
      companyName: string;
      companyDescription: string;
      industry: string;
    } | null;
  }>;
  currentUserId?: string;
  currentUserType?: "client" | "contractor";
}

export function NewContractClient({ 
  contractors, 
  clients, 
  currentUserId, 
  currentUserType 
}: NewContractClientProps) {
  const [step, setStep] = useState(1);
  const [contractData, setContractData] = useState(null);

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                step === 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div>
              <h3 className="font-semibold">Contract Information</h3>
              <p className="text-sm text-muted-foreground">
                Complete the basic contract details
              </p>
            </div>
          </div>
        </div>

        {step >= 2 && (
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  step === 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <div>
                <h3 className="font-semibold">Review and Edit Contract</h3>
                <p className="text-sm text-muted-foreground">
                  Review and customize the AI-generated contract
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {step === 1 ? (
        <NewContractForm
          contractors={contractors}
          clients={clients}
          currentUserId={currentUserId}
          currentUserType={currentUserType}
          onGenerate={(data: any) => {
            setContractData(data);
            setStep(2);
          }}
        />
      ) : (
        <ContractEditor
          initialData={contractData}
          onBack={() => setStep(1)}
        />
      )}
    </>
  );
}