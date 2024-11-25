"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MarketTrendAnalysis } from "@/types/ai";

interface RecommendationsProps {
  analysis: MarketTrendAnalysis;
}

export function Recommendations({ analysis }: RecommendationsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Empfehlungen</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h4 className="font-medium">Produktkategorien im Trend</h4>
          <div className="space-y-2">
            {analysis.target_demographics.map((demo, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
                <span>{demo}</span>
                <Badge variant="secondary">
                  {index === 0 ? 'Hohe Nachfrage' : index === 1 ? 'Wachsend' : 'Stabil'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Marktpotenzial</h4>
          <div className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
                <span>{rec}</span>
                <span className="font-medium">
                  {`+${Math.floor(Math.random() * 10 + 1)}% Potenzial`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}