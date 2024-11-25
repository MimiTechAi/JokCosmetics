"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { getSelfHelp } from "@/lib/ai/self-help";
import type { SelfHelpResponse } from "@/lib/ai/self-help";

export function SelfHelpAssistant() {
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<SelfHelpResponse | null>(null);

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast({
        variant: "destructive",
        title: "Fehlende Frage",
        description: "Bitte geben Sie eine Frage ein.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await getSelfHelp(question);
      setResponse(result);
    } catch (error) {
      console.error('Self-help request failed:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Die Anfrage konnte nicht verarbeitet werden.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">KI-Selbsthilfe Assistent</h3>
          <p className="text-sm text-muted-foreground">
            Stellen Sie Ihre Fragen zur Produktverwaltung und erhalten Sie sofort Hilfe
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Wie kann ich ein neues Produkt hinzufügen?"
            className="min-h-[100px]"
          />

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !question.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Verarbeite Anfrage...
              </>
            ) : (
              <>
                <Icons.sparkles className="mr-2 h-4 w-4" />
                Frage stellen
              </>
            )}
          </Button>
        </div>

        {response && (
          <div className="space-y-6 pt-6 border-t">
            <div className="space-y-4">
              <h4 className="font-medium">Antwort</h4>
              <p className="text-sm">{response.answer}</p>
            </div>

            {response.tips.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Hilfreiche Tipps</h4>
                <ul className="space-y-2">
                  {response.tips.map((tip, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {response.nextSteps.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Nächste Schritte</h4>
                <div className="flex flex-wrap gap-2">
                  {response.nextSteps.map((step, index) => (
                    <Badge key={index} variant="secondary">
                      {step}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {response.supportHint && (
              <div className="bg-emerald-50 dark:bg-emerald-950/50 p-4 rounded-lg">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  {response.supportHint}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}