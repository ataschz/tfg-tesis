"use client";

import { useState } from "react";
import { NewContractForm } from "@/components/company/new-contract-form";
import { ContractEditor } from "@/components/company/contract-editor";

export default function NewContractPage() {
  const [step, setStep] = useState(1);
  const [contractData, setContractData] = useState(null);

  return (
    <div className="container space-y-6 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Contrato</h1>
        <p className="text-lg text-muted-foreground">
          Define contract terms and add participants. Our AI system will help
          generate a professional contract.
        </p>
      </div>

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
          onGenerate={(data: any) => {
            setContractData(data);
            setStep(2);
          }}
        />
      ) : (
        <ContractEditor
          initialData={contractData}
          onBack={() => setStep(1)}
          onSubmit={(finalContract) => {
            console.log("Final contract:", finalContract);
            // TODO: Handle contract submission
          }}
        />
      )}
    </div>
  );
}
