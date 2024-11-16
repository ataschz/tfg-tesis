'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Editor } from '@/components/editor';
import { ParticipantSelector } from '@/components/company/participant-selector';
import { CurrencySelector } from '@/components/company/currency-selector';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  startDate: z.date(),
  endDate: z.date(),
  content: z.string().min(1, 'El contenido del contrato es requerido'),
  amount: z.string().min(1, 'El monto es requerido'),
  currency: z.string(),
  contractors: z.array(z.string()).min(1, 'Debe seleccionar al menos un contratista'),
  companies: z.array(z.string()).min(1, 'Debe seleccionar al menos una empresa'),
});

export function NewContractForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      amount: '',
      currency: 'USD',
      contractors: [],
      companies: [],
    },
  });

  const handleGenerateContract = async () => {
    const { title, description } = form.getValues();
    if (!title || !description) {
      toast.error('El título y la descripción son requeridos para generar el contrato');
      return;
    }

    try {
      setIsGenerating(true);
      // TODO: Integrar con API de IA para generar el contrato
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación
      const generatedContent = `
        CONTRATO DE SERVICIOS PROFESIONALES

        ENTRE LAS PARTES:
        [Empresa], representada en este acto por [Representante]
        Y
        [Contratista], en adelante "El Prestador"

        1. OBJETO DEL CONTRATO
        ${description}

        2. PLAZO
        El presente contrato tendrá una duración de [X] meses.

        3. HONORARIOS
        Por la prestación de los servicios, El Prestador recibirá la suma de [Monto].

        4. CONFIDENCIALIDAD
        Las partes se comprometen a mantener la más estricta confidencialidad...

        5. PROPIEDAD INTELECTUAL
        Todo el trabajo realizado será propiedad exclusiva del Cliente...

        6. TERMINACIÓN
        El contrato podrá ser terminado por cualquiera de las partes...
      `;
      form.setValue('content', generatedContent);
      toast.success('Contrato generado exitosamente');
    } catch (error) {
      toast.error('Error al generar el contrato');
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      // TODO: Integrar con Supabase
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación
      toast.success('Contrato creado exitosamente');
      router.push('/company');
    } catch (error) {
      toast.error('Error al crear el contrato');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título del Contrato</FormLabel>
                <FormControl>
                  <Input placeholder="ej. Desarrollo de Aplicación Web" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción Breve</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe el propósito principal del contrato"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Inicio</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Finalización</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < form.getValues("startDate")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="companies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresas Contratantes</FormLabel>
                  <FormControl>
                    <ParticipantSelector
                      type="company"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contratistas</FormLabel>
                  <FormControl>
                    <ParticipantSelector
                      type="contractor"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda</FormLabel>
                  <FormControl>
                    <CurrencySelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Contenido del Contrato</FormLabel>
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateContract}
              disabled={isGenerating}
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isGenerating ? 'Generando...' : 'Generar con IA'}
            </Button>
          </div>
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Editor
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/company')}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Creando...' : 'Crear Contrato'}
          </Button>
        </div>
      </form>
    </Form>
  );
}