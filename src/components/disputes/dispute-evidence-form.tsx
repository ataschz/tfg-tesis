'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, FileText, Image, Video, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface DisputeEvidenceFormProps {
  disputeId: string;
  onSubmit: (evidenceData: {
    evidenceType: 'document' | 'image' | 'video' | 'text';
    description: string;
    fileUrl?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export function DisputeEvidenceForm({ 
  disputeId, 
  onSubmit, 
  isSubmitting 
}: DisputeEvidenceFormProps) {
  const [open, setOpen] = useState(false);
  const [evidenceType, setEvidenceType] = useState<'document' | 'image' | 'video' | 'text'>('text');
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'video/*': ['.mp4', '.avi', '.mov'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        
        // Auto-detect evidence type based on file
        if (file.type.startsWith('image/')) {
          setEvidenceType('image');
        } else if (file.type.startsWith('video/')) {
          setEvidenceType('video');
        } else {
          setEvidenceType('document');
        }
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        toast.error('El archivo es muy grande. Máximo 10MB.');
      } else {
        toast.error('Tipo de archivo no soportado.');
      }
    },
  });

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Por favor proporciona una descripción.');
      return;
    }

    if (evidenceType !== 'text' && !uploadedFile) {
      toast.error('Por favor sube un archivo para este tipo de evidencia.');
      return;
    }

    try {
      // For now, we'll mock the file upload. In a real app, you'd upload to Supabase Storage
      let fileUrl = undefined;
      if (uploadedFile) {
        // Mock file URL - in production, upload to Supabase Storage
        fileUrl = `https://mock-storage.example.com/${disputeId}/${uploadedFile.name}`;
        toast.info('Archivo subido correctamente (simulado)');
      }

      await onSubmit({
        evidenceType,
        description,
        fileUrl,
      });

      // Reset form
      setDescription('');
      setUploadedFile(null);
      setEvidenceType('text');
      setOpen(false);
      
      toast.success('Evidencia agregada exitosamente');
    } catch (error) {
      toast.error('Error al agregar evidencia');
    }
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Agregar Evidencia
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Evidencia</DialogTitle>
          <DialogDescription>
            Proporciona información adicional para respaldar tu posición en esta disputa.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="evidenceType">Tipo de Evidencia</Label>
            <Select value={evidenceType} onValueChange={(value: any) => setEvidenceType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de evidencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Texto/Descripción
                  </div>
                </SelectItem>
                <SelectItem value="document">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documento
                  </div>
                </SelectItem>
                <SelectItem value="image">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Imagen
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {evidenceType !== 'text' && (
            <div className="space-y-2">
              <Label>Archivo</Label>
              <div
                {...getRootProps()}
                className={`
                  rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                  ${uploadedFile ? 'bg-green-50 border-green-200' : ''}
                `}
              >
                <input {...getInputProps()} />
                {uploadedFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      {getEvidenceIcon(evidenceType)}
                      <span className="font-medium">{uploadedFile.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                      }}
                    >
                      Cambiar archivo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra tu archivo aquí'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        O haz clic para seleccionar (máx. 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe la evidencia y cómo respalda tu posición..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !description.trim()}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Agregar Evidencia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}