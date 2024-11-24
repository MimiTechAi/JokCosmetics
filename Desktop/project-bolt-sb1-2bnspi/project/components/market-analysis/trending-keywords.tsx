"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

interface Trend {
  keyword: string;
  growth: string;
  trend: "up" | "down";
}

interface TrendingKeywordsProps {
  trends: Trend[];
}

export function TrendingKeywords({ trends }: TrendingKeywordsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Trending Keywords</h3>
      <div className="space-y-4">
        {trends.map((trend) => (
          <div
            key={trend.keyword}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Badge
                variant={trend.trend === "up" ? "default" : "destructive"}
                className="w-8 h-8 rounded-full p-0 flex items-center justify-center"
              >
                {trend.trend === "up" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
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
      <Button className="w-full mt-6">
        <TrendingUp className="mr-2 h-4 w-4" />
        Detaillierte Analyse
      </Button>
    </Card>
  );
}