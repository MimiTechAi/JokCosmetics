"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { analyzeSustainability } from "@/lib/ai/sustainability/analyzer";
import type { ProductData, SustainabilityScore } from "@/lib/ai/sustainability/types";

interface AssessmentFormProps {
  onAnalysisComplete: (result: SustainabilityScore) => void;
}

export function AssessmentForm({ onAnalysisComplete }: AssessmentFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    description: "",
    materials: [],
    origin: "",
    productionDetails: "",
    packaging: "",
    certifications: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.name || !formData.description || !formData.materials.length || !formData.origin) {
      toast({
        variant: "destructive",
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
      });
      return;
    }

    if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
      setError('API-Schlüssel nicht konfiguriert. Bitte kontaktieren Sie den Support.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await analyzeSustainability(formData);
      onAnalysisComplete(result);
      
      toast({
        title: "Analyse abgeschlossen",
        description: "Die Nachhaltigkeitsbewertung wurde erfolgreich durchgeführt.",
      });
    } catch (error) {
      console.error('Assessment failed:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Die Analyse konnte nicht durchgeführt werden.";
      
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Analyse fehlgeschlagen",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Produktname</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="z.B. Bio-Baumwoll T-Shirt"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Produktbeschreibung</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Beschreiben Sie Ihr Produkt möglichst detailliert..."
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="materials">Materialien</Label>
          <Input
            id="materials"
            value={formData.materials.join(", ")}
            onChange={(e) => setFormData({ 
              ...formData, 
              materials: e.target.value.split(",").map(m => m.trim()).filter(Boolean)
            })}
            placeholder="z.B. Bio-Baumwolle, recyceltes Polyester"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="origin">Herkunft</Label>
          <Input
            id="origin"
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            placeholder="z.B. Deutschland, Fair Trade zertifizierte Produktion in Indien"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="production">Produktionsdetails</Label>
          <Textarea
            id="production"
            value={formData.productionDetails}
            onChange={(e) => setFormData({ ...formData, productionDetails: e.target.value })}
            placeholder="Beschreiben Sie den Produktionsprozess..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="packaging">Verpackung</Label>
          <Input
            id="packaging"
            value={formData.packaging}
            onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
            placeholder="z.B. Recycelbare Kartonverpackung, plastikfrei"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="certifications">Vorhandene Zertifikate</Label>
          <Input
            id="certifications"
            value={formData.certifications?.join(", ")}
            onChange={(e) => setFormData({
              ...formData,
              certifications: e.target.value.split(",").map(c => c.trim()).filter(Boolean)
            })}
            placeholder="z.B. GOTS, Fair Trade"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Analysiere...
            </>
          ) : (
            <>
              <Icons.sparkles className="mr-2 h-4 w-4" />
              Nachhaltigkeitsanalyse starten
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}