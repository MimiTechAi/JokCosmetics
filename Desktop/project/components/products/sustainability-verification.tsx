"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { analyzeSustainability } from "@/lib/ai/sustainability/analyzer";
import type { ProductData, SustainabilityScore } from "@/lib/ai/sustainability/types";

interface SustainabilityVerificationProps {
  productData: ProductData;
  onVerificationComplete: (isVerified: boolean, score: SustainabilityScore) => void;
  onClose: () => void;
}

export function SustainabilityVerification({
  productData,
  onVerificationComplete,
  onClose
}: SustainabilityVerificationProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<SustainabilityScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerification = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeSustainability(productData);
      setVerificationResult(result);
      
      const isVerified = result.score >= 70; // Minimum score for verification
      
      if (isVerified) {
        toast({
          title: "Verifizierung erfolgreich",
          description: "Das Produkt erfüllt unsere Nachhaltigkeitsstandards.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Verifizierung fehlgeschlagen",
          description: "Das Produkt erfüllt nicht alle Nachhaltigkeitskriterien.",
        });
      }
      
      onVerificationComplete(isVerified, result);
    } catch (error) {
      console.error('Verification failed:', error);
      setError(error instanceof Error ? error.message : 'Verifizierung fehlgeschlagen');
      
      toast({
        variant: "destructive",
        title: "Fehler bei der Verifizierung",
        description: "Die Nachhaltigkeitsprüfung konnte nicht durchgeführt werden.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Nachhaltigkeitsprüfung</h3>
            <p className="text-sm text-muted-foreground">
              KI-gestützte Verifizierung der Nachhaltigkeitsstandards
            </p>
          </div>
          {verificationResult && (
            <Badge
              variant={verificationResult.score >= 70 ? "default" : "destructive"}
              className="text-lg px-3 py-1"
            >
              {verificationResult.score}/100
            </Badge>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {verificationResult ? (
          <div className="space-y-6">
            <div className="space-y-4">
              {Object.entries(verificationResult.ratings).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key}</span>
                    <span className={getScoreColor(value)}>{value}%</span>
                  </div>
                  <Progress value={value} />
                </div>
              ))}
            </div>

            {verificationResult.score < 70 && (
              <div className="space-y-2">
                <h4 className="font-medium">Erforderliche Verbesserungen</h4>
                <ul className="space-y-2">
                  {verificationResult.improvements.high.map((improvement, index) => (
                    <li key={index} className="text-sm text-red-600 flex items-start">
                      <span className="mr-2">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Zurück
              </Button>
              {verificationResult.score < 70 && (
                <Button onClick={() => handleVerification()}>
                  Erneut prüfen
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Button
            onClick={handleVerification}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Prüfung läuft...
              </>
            ) : (
              <>
                <Icons.sparkles className="mr-2 h-4 w-4" />
                Nachhaltigkeitsprüfung starten
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}