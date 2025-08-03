"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Wand2 } from "lucide-react";
import { ContractBasicInfo } from "@/components/company/contract-basic-info";
import { ContractDeliverables } from "@/components/company/contract-deliverables";
import { ContractParticipants } from "@/components/company/contract-participants";
import type { Deliverable } from "@/lib/types/database";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  currency: z.string().min(1, "Please select a currency"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  contractors: z.array(z.string()).min(1, "Select at least one contractor"),
  companies: z.array(z.string()).min(1, "Select at least one company"),
  deliverables: z.array(
    z.object({
      title: z.string().min(3, "Title must be at least 3 characters"),
      description: z
        .string()
        .min(10, "Description must be at least 10 characters"),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;

interface NewContractFormProps {
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
  onGenerate: (data: FormData) => void;
}

export function NewContractForm({ 
  contractors, 
  clients, 
  currentUserId, 
  currentUserType, 
  onGenerate 
}: NewContractFormProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);

  // Get default selections based on current user
  const getDefaultSelections = () => {
    const defaults = {
      contractors: [] as string[],
      companies: [] as string[],
    };

    if (currentUserId && currentUserType) {
      if (currentUserType === "contractor") {
        defaults.contractors = [currentUserId];
      } else if (currentUserType === "client") {
        defaults.companies = [currentUserId];
      }
    }

    return defaults;
  };

  const defaultSelections = getDefaultSelections();

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      currency: "USD",
      contractors: defaultSelections.contractors,
      companies: defaultSelections.companies,
      deliverables: [],
    },
  });

  const generateContract = async () => {
    const values = methods.getValues();
    
    // Validate required fields
    if (!values.title || !values.description || deliverables.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate participants
    if (values.contractors.length === 0) {
      toast.error("Debe seleccionar al menos un contratista");
      return;
    }

    if (values.companies.length === 0) {
      toast.error("Debe seleccionar al menos una empresa");
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI contract generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onGenerate({ ...values, deliverables });
    } catch (error) {
      toast.error("Error generating contract");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="lg:grid lg:grid-cols-[1fr,400px] lg:gap-8">
        <div className="space-y-8">
          <ContractBasicInfo />
          <ContractDeliverables
            deliverables={deliverables}
            setDeliverables={setDeliverables}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              onClick={generateContract}
              disabled={isGenerating}
            >
              <Wand2 className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Contract"}
            </Button>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <ContractParticipants 
              contractors={contractors}
              clients={clients}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
