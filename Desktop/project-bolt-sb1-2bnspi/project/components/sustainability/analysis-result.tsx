"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AnalysisResult } from "@/types/sustainability";

interface AnalysisResultProps {
  analysis: AnalysisResult | null;
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  if (!analysis) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Analyse-Ergebnis</h3>
        <div className="text-center text-muted-foreground py-8">
          <p>Noch keine Analyse durchgeführt</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Analyse-Ergebnis</h3>
      <div className="space-y-6">
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
                : analysis.score >= 60
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            )}
          >
            {analysis.score >= 80 ? "Sehr gut" : analysis.score >= 60 ? "Gut" : "Verbesserungswürdig"}
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
    </Card>
  );
}