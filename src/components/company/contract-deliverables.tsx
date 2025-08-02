'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, PackageOpen, FileText, ListChecks } from 'lucide-react';
import type { Deliverable } from '@/lib/types/database';

interface ContractDeliverablesProps {
  deliverables: Deliverable[];
  setDeliverables: (deliverables: Deliverable[]) => void;
}

export function ContractDeliverables({ deliverables, setDeliverables }: ContractDeliverablesProps) {
  const [newDeliverable, setNewDeliverable] = useState({ title: '', description: '' });

  const addDeliverable = () => {
    if (newDeliverable.title && newDeliverable.description) {
      const deliverableWithId: Deliverable = {
        ...newDeliverable,
        id: Math.random().toString(36).substr(2, 9),
        completed: false,
      };
      setDeliverables([...deliverables, deliverableWithId]);
      setNewDeliverable({ title: '', description: '' });
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <PackageOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Entregables</h3>
            <p className="text-sm text-muted-foreground">
              Define los entregables específicos y sus criterios de aceptación
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {deliverables.map((deliverable, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-lg border bg-card/50 p-4 shadow-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <ListChecks className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="font-medium">{deliverable.title}</div>
                <div className="text-sm text-muted-foreground">
                  {deliverable.description}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeDeliverable(index)}
                className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="space-y-6 rounded-lg border bg-card/50 p-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <Label>Título del Entregable</Label>
                </div>
                <Input
                  value={newDeliverable.title}
                  onChange={(e) =>
                    setNewDeliverable({
                      ...newDeliverable,
                      title: e.target.value,
                    })
                  }
                  placeholder="ej. Diseño de Interfaz de Usuario"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                  <Label>Descripción y Criterios</Label>
                </div>
                <Textarea
                  value={newDeliverable.description}
                  onChange={(e) =>
                    setNewDeliverable({
                      ...newDeliverable,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe los criterios de aceptación..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={addDeliverable}
            >
              <Plus className="h-4 w-4" />
              Agregar Entregable
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}