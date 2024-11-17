'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface ContractPreviewProps {
  contract: any; // TODO: Add proper type
}

export function ContractPreview({ contract }: ContractPreviewProps) {
  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <div className="p-4 text-sm">
        <div className="prose prose-sm dark:prose-invert">
          <h2>{contract.title}</h2>
          <p className="text-muted-foreground">{contract.description}</p>

          <h3>Contract Details</h3>
          <ul>
            <li>Amount: {contract.currency} {contract.amount}</li>
            <li>Start Date: {format(contract.startDate, 'PPP')}</li>
            <li>End Date: {format(contract.endDate, 'PPP')}</li>
          </ul>

          <h3>Deliverables</h3>
          <ul>
            {contract.deliverables.map((deliverable: any, index: number) => (
              <li key={index}>
                <strong>{deliverable.title}</strong>
                <p>{deliverable.description}</p>
              </li>
            ))}
          </ul>

          <h3>Terms and Conditions</h3>
          <p>This is a legally binding contract between the parties specified above...</p>
          
          {/* Add more contract sections as needed */}
        </div>
      </div>
    </ScrollArea>
  );
}