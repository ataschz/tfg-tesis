import { NewContractForm } from '@/components/company/new-contract-form';

export default function NewContractPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Contrato</h1>
        <p className="text-lg text-muted-foreground">
          Define los términos del contrato y agrega a los participantes. Nuestro sistema de IA te ayudará a generar un contrato profesional.
        </p>
      </div>
      <NewContractForm />
    </div>
  );
}