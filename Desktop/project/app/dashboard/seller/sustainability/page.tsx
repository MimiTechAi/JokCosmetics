"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnalysisForm } from "@/components/sustainability/analysis-form";
import { ProgressDashboard } from "@/components/sustainability/progress-dashboard";
import type { AnalysisResult } from "@/types/sustainability";

export default function SustainabilityPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Nachhaltigkeits-Analyse
        </h2>
        <p className="text-muted-foreground">
          Optimieren Sie Ihre Produktbeschreibungen für mehr Nachhaltigkeit
        </p>
      </div>

      <ProgressDashboard />

      <div className="grid gap-6 md:grid-cols-2">
        <AnalysisForm onAnalysisComplete={setAnalysis} />

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Analyse-Ergebnis</h3>
          {analysis ? (
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
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>Noch keine Analyse durchgeführt</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}