"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { analyzeMarketTrends } from '@/lib/ai/market-analysis';
import type { MarketTrendAnalysis } from "@/types/ai";
import { TrendingKeywords } from "./trending-keywords";
import { Recommendations } from "./recommendations";
import { MarketChart } from "./market-chart";

const trendData = [
  { month: "Jan", value: 2400 },
  { month: "Feb", value: 1398 },
  { month: "Mar", value: 9800 },
  { month: "Apr", value: 3908 },
  { month: "Mai", value: 4800 },
  { month: "Jun", value: 3800 },
];

export function MarketAnalysis() {
  const [timeframe, setTimeframe] = useState("6m");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MarketTrendAnalysis | null>(null);
  const { toast } = useToast();

  const handleDetailedAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = await analyzeMarketTrends("all", "market overview");
      setAnalysis(result);
      
      toast({
        title: "Marktanalyse abgeschlossen",
        description: "Die detaillierte Analyse wurde erfolgreich durchgeführt.",
      });
    } catch (error) {
      console.error("Market analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analyse fehlgeschlagen",
        description: "Die Marktanalyse konnte nicht durchgeführt werden.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <MarketChart
          data={trendData}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Trending Keywords</h3>
          <div className="space-y-4">
            {analysis?.keywords.map((trend, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={trend.trend === "up" ? "default" : "destructive"}
                    className="w-8 h-8 rounded-full p-0 flex items-center justify-center"
                  >
                    {trend.trend === "up" ? (
                      <Icons.arrowUp className="h-4 w-4" />
                    ) : (
                      <Icons.arrowDown className="h-4 w-4" />
                    )}
                  </Badge>
                  <span className="font-medium">{trend.keyword}</span>
                </div>
                <span
                  className={
                    trend.trend === "up"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }
                >
                  {trend.growth}
                </span>
              </div>
            ))}
          </div>
          <Button 
            className="w-full mt-6"
            onClick={handleDetailedAnalysis}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Analysiere...
              </>
            ) : (
              <>
                <Icons.trendingUp className="mr-2 h-4 w-4" />
                Detaillierte Analyse
              </>
            )}
          </Button>
        </Card>
      </div>

      {analysis && <Recommendations analysis={analysis} />}
    </div>
  );
}