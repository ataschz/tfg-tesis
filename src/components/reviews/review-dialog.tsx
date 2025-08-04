"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { ReviewForm } from "./review-form";

interface ReviewDialogProps {
  contractId: string;
  contractTitle: string;
  reviewedUserId: string;
  reviewedUserName: string;
  reviewedUserType: "contractor" | "client";
  triggerText?: string;
  onReviewSuccess?: () => void;
}

export function ReviewDialog({
  contractId,
  contractTitle,
  reviewedUserId,
  reviewedUserName,
  reviewedUserType,
  triggerText,
  onReviewSuccess,
}: ReviewDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onReviewSuccess?.();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const defaultTriggerText = `Calificar ${
    reviewedUserType === "contractor" ? "contratista" : "cliente"
  }`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-yellow-200 text-yellow-700 hover:bg-yellow-50"
        >
          <Star className="h-4 w-4" />
          {triggerText || defaultTriggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Escribir Reseña</DialogTitle>
        </DialogHeader>
        <ReviewForm
          contractId={contractId}
          contractTitle={contractTitle}
          reviewedUserId={reviewedUserId}
          reviewedUserName={reviewedUserName}
          reviewedUserType={reviewedUserType}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
