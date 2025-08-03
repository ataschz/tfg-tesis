"use client";

import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ContractTermsProps {
  termsAndConditions: string;
}

export function ContractTerms({ termsAndConditions }: ContractTermsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Términos y Condiciones
      </h3>
      
      <div className="prose prose-sm max-w-none">
        <div 
          className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: termsAndConditions }}
        />
      </div>
    </Card>
  );
}