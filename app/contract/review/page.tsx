'use client';

import { useState } from 'react';
import { ContractReview } from '@/components/contract/contract-review';
import { ContractReviewActions } from '@/components/contract/contract-review-actions';
import { ContractReviewSidebar } from '@/components/contract/contract-review-sidebar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

// TODO: Replace with real data fetching
const mockContract = {
  id: 'contract_01',
  title: 'Desarrollo Frontend React',
  description: 'Desarrollo de nueva plataforma de e-commerce con React, Next.js y TypeScript.',
  amount: 5000,
  currency: 'USD',
  startDate: new Date('2024-02-01'),
  endDate: new Date('2024-04-30'),
  status: 'pending_review',
  companies: [{
    id: 'comp_01',
    name: 'TechSolutions SA',
    email: 'rrhh@techsolutions.com',
  }],
  contractors: [{
    id: 'cont_01',
    name: 'Ana García',
    email: 'ana.garcia@gmail.com',
  }],
  deliverables: [
    {
      title: 'Diseño de Componentes',
      description: 'Implementación de sistema de diseño y componentes reutilizables.',
    },
    {
      title: 'Integración de APIs',
      description: 'Conexión con backend y manejo de estado global.',
    },
  ],
  content: `
    <h1>Contrato de Servicios Profesionales</h1>
    <p>Este contrato establece los términos y condiciones para el desarrollo del proyecto...</p>
    <!-- More contract content -->
  `,
};

export default function ContractReviewPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement contract acceptance
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Contrato aceptado exitosamente');
    } catch (error) {
      toast.error('Error al aceptar el contrato');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement contract rejection
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Contrato rechazado');
    } catch (error) {
      toast.error('Error al rechazar el contrato');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Revisión de Contrato</h1>
            <p className="text-muted-foreground">
              Por favor, revisa cuidadosamente los términos y condiciones antes de aceptar.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
        <div className="space-y-6">
          <Card>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <ContractReview contract={mockContract} />
            </ScrollArea>
          </Card>

          <ContractReviewActions
            onAccept={handleAccept}
            onReject={handleReject}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <ContractReviewSidebar contract={mockContract} />
          </div>
        </div>
      </div>
    </div>
  );
}