"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createDispute } from "@/lib/actions/disputes";
import { toast } from "sonner";
import { AlertTriangle, Upload, X, FileText } from "lucide-react";
import { useDropzone } from "react-dropzone";

const disputeSchema = z.object({
  reason: z.string().min(1, "El motivo es requerido"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  disputeType: z.enum(["total", "partial"], {
    required_error: "Debe seleccionar el tipo de disputa",
  }),
  milestoneId: z.string().optional(),
});

type DisputeFormData = z.infer<typeof disputeSchema>;

interface DisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
  contractTitle: string;
  milestones?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

export function DisputeDialog({
  open,
  onOpenChange,
  contractId,
  contractTitle,
  milestones = [],
}: DisputeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const form = useForm<DisputeFormData>({
    resolver: zodResolver(disputeSchema),
    defaultValues: {
      reason: "",
      description: "",
      disputeType: "total",
    },
  });

  const disputeType = form.watch("disputeType");

  // Mock file upload with react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
      toast.success(`${acceptedFiles.length} archivo(s) agregado(s)`);
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(rejection => {
        const { file, errors } = rejection;
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error(`${file.name} es demasiado grande (máximo 10MB)`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`${file.name} no es un tipo de archivo válido`);
          } else {
            toast.error(`Error con ${file.name}: ${error.message}`);
          }
        });
      });
    },
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: DisputeFormData) => {
    setIsSubmitting(true);
    try {
      // Mock file URLs - in production these would be uploaded to Supabase Storage
      const mockFileUrls = uploadedFiles.map((file, index) => 
        `mock://storage/disputes/${contractId}/${Date.now()}_${index}_${file.name}`
      );

      const result = await createDispute({
        contractId,
        reason: data.reason,
        description: data.description,
        disputeType: data.disputeType,
        milestoneId: data.milestoneId,
        evidenceFiles: mockFileUrls,
      });

      if (result.success) {
        toast.success('message' in result ? result.message : 'Disputa creada exitosamente');
        onOpenChange(false);
        form.reset();
        setUploadedFiles([]);
      } else {
        toast.error('error' in result ? result.error : 'Error al crear la disputa');
      }
    } catch (error) {
      toast.error("Error al crear la disputa");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Iniciar Disputa
          </DialogTitle>
          <DialogDescription>
            Vas a iniciar una disputa para el contrato &quot;{contractTitle}&quot;. 
            Proporciona todos los detalles necesarios para que un mediador pueda revisar el caso.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dispute Type */}
            <FormField
              control={form.control}
              name="disputeType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Disputa</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="total" id="total" />
                        <Label htmlFor="total">
                          Disputa Total - Sobre todo el contrato
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="partial" id="partial" />
                        <Label htmlFor="partial">
                          Disputa Parcial - Sobre un milestone específico
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Milestone Selection (only for partial disputes) */}
            {disputeType === "partial" && milestones.length > 0 && (
              <FormField
                control={form.control}
                name="milestoneId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestone en Disputa</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el milestone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {milestones.map((milestone) => (
                          <SelectItem key={milestone.id} value={milestone.id}>
                            {milestone.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecciona el milestone específico que está en disputa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de la Disputa</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el motivo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="trabajo_incompleto">Trabajo Incompleto</SelectItem>
                      <SelectItem value="calidad_insatisfactoria">Calidad Insatisfactoria</SelectItem>
                      <SelectItem value="incumplimiento_plazos">Incumplimiento de Plazos</SelectItem>
                      <SelectItem value="falta_de_pago">Falta de Pago</SelectItem>
                      <SelectItem value="cambios_no_autorizados">Cambios No Autorizados</SelectItem>
                      <SelectItem value="falta_de_comunicacion">Falta de Comunicación</SelectItem>
                      <SelectItem value="incumplimiento_contrato">Incumplimiento de Contrato</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Detallada</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe detalladamente lo sucedido, incluyendo fechas, comunicaciones relevantes y cualquier información que pueda ayudar al mediador a entender la situación..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Proporciona todos los detalles relevantes para la disputa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload */}
            <div className="space-y-4">
              <Label>Archivos de Evidencia (Opcional)</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-primary"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                {isDragActive ? (
                  <p>Suelta los archivos aquí...</p>
                ) : (
                  <div>
                    <p>Arrastra archivos aquí o haz click para seleccionar</p>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF, DOC, DOCX, imágenes (máximo 5 archivos, 10MB cada uno)
                    </p>
                  </div>
                )}
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Archivos Seleccionados:</Label>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? "Creando Disputa..." : "Iniciar Disputa"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}