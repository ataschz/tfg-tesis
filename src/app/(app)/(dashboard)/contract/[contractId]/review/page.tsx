"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "@/components/reviews/review-form";
import { ArrowLeft, Star, SkipForward, Check } from "lucide-react";
import { toast } from "sonner";

// Contract type - should match your existing type
interface ContractData {
  id: string;
  title: string;
  contractor: {
    id: string;
    firstName: string;
    lastName: string;
  };
  status: string;
}

export default function ContractReviewPage() {
  const router = useRouter();
  const params = useParams();
  const contractId = params.contractId as string;
  
  const [contract, setContract] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch contract data
  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetch(`/api/contracts/${contractId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setContract(data.contract);
          } else {
            toast.error(data.error || "Error al cargar el contrato");
            router.push("/dashboard");
          }
        } else {
          toast.error("Error al cargar el contrato");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching contract:", error);
        toast.error("Error al cargar el contrato");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      fetchContract();
    }
  }, [contractId, router]);

  const handleSkipReview = () => {
    toast.success("Has omitido dejar una reseña");
    router.push("/dashboard");
  };

  const handleReviewSuccess = () => {
    toast.success("¡Gracias por tu reseña!");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Cargando contrato...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Contrato no encontrado</p>
          <Button onClick={() => router.push("/dashboard")}>
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">¡Contrato Completado!</h1>
            <p className="text-muted-foreground">
              Los fondos han sido liberados exitosamente
            </p>
          </div>
        </div>

        {/* Success Card */}
        <Card className="p-6 mb-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Contrato Completado</h3>
              <p className="text-sm text-green-700">
                El contrato &ldquo;{contract.title}&rdquo; ha sido completado exitosamente
              </p>
            </div>
          </div>
        </Card>

        {/* Review Options */}
        {!showReviewForm ? (
          <Card className="p-6">
            <div className="text-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
                <Star className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">¿Te gustaría dejar una reseña?</h2>
                <p className="text-muted-foreground">
                  Comparte tu experiencia trabajando con{" "}
                  <strong>
                    {contract.contractor.firstName} {contract.contractor.lastName}
                  </strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Tu reseña ayudará a otros usuarios a tomar mejores decisiones
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={handleSkipReview}
                  className="gap-2"
                >
                  <SkipForward className="h-4 w-4" />
                  Omitir por ahora
                </Button>
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="gap-2"
                >
                  <Star className="h-4 w-4" />
                  Dejar reseña
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <ReviewForm
            contractId={contract.id}
            contractTitle={contract.title}
            reviewedUserId={contract.contractor.id}
            reviewedUserName={`${contract.contractor.firstName} ${contract.contractor.lastName}`}
            reviewedUserType="contractor"
            onSuccess={handleReviewSuccess}
            onCancel={() => setShowReviewForm(false)}
          />
        )}

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Siempre puedes dejar una reseña más tarde desde tu dashboard
          </p>
        </div>
      </div>
    </div>
  );
}