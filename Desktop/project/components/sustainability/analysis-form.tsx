"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { analyzeProduct } from '@/lib/ai/service';
import type { AnalysisResult } from "@/types/sustainability";

interface AnalysisFormProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export function AnalysisForm({ onAnalysisComplete }: AnalysisFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");

  const handleAnalysis = async () => {
    const trimmedDescription = description.trim();
    
    if (!trimmedDescription) {
      toast({
        variant: "destructive",
        title: "Fehlende Beschreibung",
        description: "Bitte geben Sie eine Produktbeschreibung ein.",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Starting analysis for:', trimmedDescription);
      
      const result = await analyzeProduct(trimmedDescription);
      
      console.log('Analysis completed:', result);
      
      onAnalysisComplete(result);
      
      toast({
        title: "Analyse abgeschlossen",
        description: "Die Nachhaltigkeitsanalyse wurde erfolgreich durchgeführt.",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      
      toast({
        variant: "destructive",
        title: "Analyse fehlgeschlagen",
        description: error instanceof Error 
          ? error.message 
          : "Die Analyse konnte nicht durchgeführt werden. Bitte versuchen Sie es später erneut.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        Produktbeschreibung analysieren
      </h3>
      <div className="space-y-4">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschreiben Sie Ihr Produkt möglichst detailliert..."
          className="min-h-[200px] resize-none"
        />
        <Button
          onClick={handleAnalysis}
          disabled={isLoading || !description.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Analysiere...
            </>
          ) : (
            <>
              <Icons.sparkles className="mr-2 h-4 w-4" />
              Jetzt analysieren
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}