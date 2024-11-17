'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  Save
} from 'lucide-react';
import { format } from 'date-fns';

interface ContractEditorProps {
  initialData: any;
  onBack: () => void;
  onSubmit: (contract: string) => void;
}

const generateInitialContent = (data: any) => {
  return `
    <h1>${data.title}</h1>
    <p>${data.description}</p>

    <h2>Contract Details</h2>
    <ul>
      <li>Amount: ${data.currency} ${data.amount}</li>
      <li>Start Date: ${format(data.startDate, 'PPP')}</li>
      <li>End Date: ${format(data.endDate, 'PPP')}</li>
    </ul>

    <h2>Deliverables</h2>
    <ul>
      ${data.deliverables.map((d: any) => `
        <li>
          <strong>${d.title}</strong>
          <p>${d.description}</p>
        </li>
      `).join('')}
    </ul>

    <h2>Terms and Conditions</h2>
    <p>This Agreement is made between the following parties:</p>
    <p>Companies: ${data.companies.join(', ')}</p>
    <p>Contractors: ${data.contractors.join(', ')}</p>

    <h3>1. Scope of Work</h3>
    <p>The Contractor agrees to provide the services as described in the Deliverables section above.</p>

    <h3>2. Payment Terms</h3>
    <p>The total payment for the services will be ${data.currency} ${data.amount}.</p>

    <h3>3. Timeline</h3>
    <p>The work will commence on ${format(data.startDate, 'PPP')} and should be completed by ${format(data.endDate, 'PPP')}.</p>

    <h3>4. Intellectual Property</h3>
    <p>All intellectual property rights in the deliverables shall be transferred to the Company upon full payment.</p>

    <h3>5. Confidentiality</h3>
    <p>Both parties agree to maintain the confidentiality of any proprietary information shared during the course of this agreement.</p>
  `;
};

export function ContractEditor({ initialData, onBack, onSubmit }: ContractEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: generateInitialContent(initialData),
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
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
              className={editor.isActive('bold') ? 'bg-muted' : ''}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'bg-muted' : ''}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'bg-muted' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'bg-muted' : ''}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
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
        <Button
          variant="outline"
          className="gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Details
        </Button>
        <Button
          className="gap-2"
          onClick={() => onSubmit(editor.getHTML())}
        >
          <Save className="h-4 w-4" />
          Save Contract
        </Button>
      </div>
    </div>
  );
}