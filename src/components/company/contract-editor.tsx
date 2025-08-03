"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  ArrowLeft,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { createContract } from "@/lib/actions/contracts";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ContractEditorProps {
  initialData: any;
  onBack: () => void;
}

const generateInitialContent = (data: any) => {
  return `
    <h1 style="text-align: center">${data.title}</h1>
    <p style="text-align: center"><strong>CONTRATO DE PRESTACIÓN DE SERVICIOS</strong></p>
    
    <p>${data.description}</p>

    <h2>Detalles del Contrato</h2>
    <ul>
      <li>Monto Total: ${data.currency} ${data.amount}</li>
      <li>Fecha de Inicio: ${format(data.startDate, "PPP")}</li>
      <li>Fecha de Finalización: ${format(data.endDate, "PPP")}</li>
    </ul>

    <h2>Entregables</h2>
    <ul>
      ${data.deliverables
        .map(
          (d: any) => `
        <li>
          <strong>${d.title}</strong>
          <p>${d.description}</p>
        </li>
      `
        )
        .join("")}
    </ul>

    <h2>Términos y Condiciones</h2>
    <p>En la ciudad de [Ciudad], a los [día] días del mes de [mes] del año [año], se celebra el presente contrato entre las siguientes partes:</p>
    
    <p><strong>PARTES CONTRATANTES:</strong></p>
    <p>Por una parte, ${data.companies.join(
      ", "
    )}, en adelante denominado "EL CONTRATANTE"</p>
    <p>Por otra parte, ${data.contractors.join(
      ", "
    )}, en adelante denominado "EL CONTRATISTA"</p>

    <p>Quienes acuerdan celebrar el presente contrato de prestación de servicios profesionales, que se regirá por las siguientes cláusulas:</p>

    <h3>CLÁUSULA PRIMERA: OBJETO DEL CONTRATO</h3>
    <p>EL CONTRATISTA se compromete a prestar los servicios descritos en la sección de Entregables del presente contrato, conforme a las especificaciones detalladas y los más altos estándares de calidad profesional.</p>

    <br/>

    <h3>CLÁUSULA SEGUNDA: HONORARIOS Y FORMA DE PAGO</h3>
    <p>El monto total por los servicios prestados será de ${data.currency} ${
    data.amount
  } (escribir cantidad en letras), que será pagado según los términos acordados entre las partes. Este monto incluye todos los gastos necesarios para la ejecución de los servicios contratados.</p>

    <br/>

    <h3>CLÁUSULA TERCERA: PLAZO DE EJECUCIÓN</h3>
    <p>Los servicios objeto del presente contrato iniciarán el ${format(
      data.startDate,
      "PPP"
    )} y deberán ser completados en su totalidad el ${format(
    data.endDate,
    "PPP"
  )}. Cualquier modificación a este plazo deberá ser acordada por escrito entre las partes.</p>

    <br/>

    <h3>CLÁUSULA CUARTA: PROPIEDAD INTELECTUAL</h3>
    <p>Todos los derechos de propiedad intelectual sobre los entregables, incluyendo pero no limitado a derechos de autor, patentes, diseños y secretos comerciales, serán transferidos a EL CONTRATANTE una vez efectuado el pago total de los servicios acordados.</p>

    <br/>

    <h3>CLÁUSULA QUINTA: CONFIDENCIALIDAD</h3>
    <p>Ambas partes se comprometen a mantener estricta confidencialidad sobre toda la información técnica, comercial, estratégica o de cualquier otra naturaleza compartida durante la ejecución del presente contrato. Esta obligación de confidencialidad permanecerá vigente incluso después de la terminación del contrato.</p>

    <br/>

    <p style="text-align: center; margin-top: 60px;">En conformidad con lo establecido, firman las partes:</p>
    
    <p style="text-align: center; margin-top: 60px;">____________________                    ____________________</p>
    <p style="text-align: center;">EL CONTRATANTE                         EL CONTRATISTA</p>
    <p style="text-align: center;">[Nombre y DNI]                         [Nombre y DNI]</p>
  `;
};

export function ContractEditor({
  initialData,
  onBack,
}: ContractEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: generateInitialContent(initialData),
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-8">
      <Card className="p-4">
        <div className="border-b border-border/50 bg-muted/50 p-2">
          <div className="flex flex-wrap gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-muted" : ""}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-muted" : ""}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-muted" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-muted" : ""}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""
              }
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""
              }
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""
              }
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""
              }
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
              }
            >
              <Heading2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="min-h-[600px] p-4">
          <EditorContent editor={editor} />
        </div>
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Button variant="outline" className="gap-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Volver a
        </Button>
        <Button 
          className="gap-2" 
          onClick={async () => {
            setIsSaving(true);
            try {
              const termsAndConditions = editor.getHTML();
              const result = await createContract({
                ...initialData,
                termsAndConditions,
              });
              
              if (result.success) {
                toast.success(result.message);
                router.push("/dashboard");
              } else {
                toast.error(result.error);
              }
            } catch (error) {
              toast.error("Error al crear el contrato");
            } finally {
              setIsSaving(false);
            }
          }}
          disabled={isSaving}
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Creando..." : "Crear Contrato"}
        </Button>
      </div>
    </div>
  );
}
