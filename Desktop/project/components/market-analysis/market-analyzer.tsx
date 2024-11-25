"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { analyzeMarketTrends } from "@/lib/ai/market-analysis";
import { DetailedAnalysis } from "./detailed-analysis";
import type { MarketTrendAnalysis } from "@/types/ai";

interface MarketAnalyzerProps {
  productName: string;
  category: string;
  description: string;
}

export function MarketAnalyzer({ productName, category, description }: MarketAnalyzerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MarketTrendAnalysis | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  const handleAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = await analyzeMarketTrends(category, description);
      setAnalysis(result);
      
      toast({
        title: "Marktanalyse abgeschlossen",
        description: "Die KI hat die Markttrends analysiert.",
      });
    } catch (error) {
      console.error("Market analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analyse fehlgeschlagen",
        description: error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{productName}</h3>
              <p className="text-sm text-muted-foreground">{category}</p>
            </div>
            <Button onClick={handleAnalysis} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere...
                </>
              ) : (
                <>
                  <Icons.sparkles className="mr-2 h-4 w-4" />
                  Markt analysieren
                </>
              )}
            </Button>
          </div>

          {analysis && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Marktpotenzial</p>
                  <p className="text-2xl font-bold">{analysis.market_potential}%</p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Wachstumsrate</p>
                  <p className="text-2xl font-bold">{analysis.growth_rate}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Trending Keywords</h4>
                <div className="space-y-2">
                  {analysis.keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <span>{keyword.keyword}</span>
                      <Badge
                        variant={keyword.trend === "up" ? "default" : "destructive"}
                      >
                        {keyword.growth}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setShowDetailedAnalysis(true)}
              >
                <Icons.trendingUp className="mr-2 h-4 w-4" />
                Detaillierte Analyse
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={showDetailedAnalysis} onOpenChange={setShowDetailedAnalysis}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detaillierte Marktanalyse</DialogTitle>
          </DialogHeader>
          {analysis && (
            <DetailedAnalysis 
              analysis={analysis} 
              productName={productName}
              category={category}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}