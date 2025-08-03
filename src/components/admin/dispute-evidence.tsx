'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, MessageSquare, Download, Upload } from 'lucide-react';
import { DisputeEvidenceForm } from '@/components/disputes/dispute-evidence-form';
import { addDisputeEvidence } from '@/lib/actions/evidence';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DisputeEvidenceProps {
  evidence: any[]; // TODO: Add proper type
  disputeId: string;
  canAddEvidence?: boolean;
}

export function DisputeEvidence({ evidence, disputeId, canAddEvidence = false }: DisputeEvidenceProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAddEvidence = async (evidenceData: {
    evidenceType: 'document' | 'image' | 'video' | 'text';
    description: string;
    fileUrl?: string;
  }) => {
    setIsSubmitting(true);
    try {
      const result = await addDisputeEvidence(disputeId, evidenceData);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Error al agregar evidencia");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Evidencia Presentada</h3>
              <p className="text-sm text-muted-foreground">
                Documentos y mensajes relevantes
              </p>
            </div>
          </div>
          {canAddEvidence && (
            <DisputeEvidenceForm
              disputeId={disputeId}
              onSubmit={handleAddEvidence}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        <div className="grid gap-4">
          {evidence.map((item) => (
            <div
              key={item.id || item.title}
              className="flex items-start justify-between gap-4 rounded-lg border bg-card/50 p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  {item.type === 'document' ? (
                    <FileText className="h-5 w-5 text-primary" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  {item.content && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.content}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {format(
                      new Date(item.uploadedAt || item.timestamp || item.createdAt),
                      'PPp',
                      { locale: es }
                    )}
                    {item.uploadedBy && (
                      <span className="ml-2">
                        • por {item.uploadedBy}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {item.type === 'document' && (
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}