'use client';

import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { ParticipantSelector } from '@/components/company/participant-selector';
import { Users2, Building2 } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ContractParticipantsProps {
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
}

export function ContractParticipants({ contractors, clients }: ContractParticipantsProps) {
  const { control } = useFormContext();

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Participantes</h3>
            <p className="text-sm text-muted-foreground">
              Selecciona las empresas y contratistas involucrados
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <FormField
            control={control}
            name="contractors"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-muted-foreground" />
                  <FormLabel className="text-base">Contratistas</FormLabel>
                </div>
                <FormControl>
                  <ParticipantSelector
                    type="contractor"
                    value={field.value}
                    onChange={field.onChange}
                    contractors={contractors}
                    clients={clients}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="companies"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <FormLabel className="text-base">Empresas</FormLabel>
                </div>
                <FormControl>
                  <ParticipantSelector
                    type="company"
                    value={field.value}
                    onChange={field.onChange}
                    contractors={contractors}
                    clients={clients}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Card>
  );
}