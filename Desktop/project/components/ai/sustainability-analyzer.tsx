"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAI } from "@/hooks/use-ai";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface SustainabilityScore {
  score: number;
  suggestions: string[];
  keywords: string[];
  impact: {
    co2: string;
    water: string;
    waste: string;
  };
}

export function SustainabilityAnalyzer() {
  const { generateResponse, isLoading } = useAI();
  const [description, setDescription] = useState("");
  const [analysis, setAnalysis] = useState<SustainabilityScore | null>(null);

  const analyzeDescription = async () => {
    try {
      const prompt = `Analyze the following product description for sustainability metrics:
        ${description}
        
        Provide a detailed analysis including:
        - Sustainability score (0-100)
        - Improvement suggestions
        - Key sustainability keywords
        - Environmental impact estimates`;

      const response = await generateResponse(prompt);
      
      // In a real implementation, we would parse the AI response
      // This is a mock response for demonstration
      setAnalysis({
        score: 85,
        suggestions: [
          "Add specific recycling instructions",
          "Include carbon footprint data",
          "Mention sustainable sourcing details"
        ],
        keywords: ["eco-friendly", "biodegradable", "sustainable"],
        impact: {
          co2: "-2.5kg CO₂",
          water: "-150L",
          waste: "-0.5kg"
        }
      });
    } catch (error) {
      console.error("AI Analysis failed:", error);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Nachhaltigkeits-Analyse</h3>
          <p className="text-sm text-muted-foreground">
            Analysieren Sie Ihre Produktbeschreibung mit KI
          </p>
        </div>

        <Textarea
          placeholder="Fügen Sie hier Ihre Produktbeschreibung ein..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[150px]"
        />

        <Button 
          onClick={analyzeDescription} 
          disabled={isLoading || !description}
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
              KI-Analyse starten
            </>
          )}
        </Button>

        {analysis && (
          <div className="space-y-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nachhaltigkeits-Score
                </p>
                <p className="text-3xl font-bold">{analysis.score}/100</p>
              </div>
              <div
                className={cn(
                  "p-2 rounded-full",
                  analysis.score >= 80
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                )}
              >
                {analysis.score >= 80 ? "Sehr nachhaltig" : "Verbesserungspotenzial"}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center">
                <p className="text-sm font-medium mb-1">CO₂ Einsparung</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {analysis.impact.co2}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center">
                <p className="text-sm font-medium mb-1">Wasser</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {analysis.impact.water}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center">
                <p className="text-sm font-medium mb-1">Abfall</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {analysis.impact.waste}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Verbesserungsvorschläge</h4>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-muted-foreground"
                  >
                    <span className="mr-2">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Nachhaltigkeits-Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}