"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

const trendData = [
  { month: "Jan", value: 2400 },
  { month: "Feb", value: 1398 },
  { month: "Mar", value: 9800 },
  { month: "Apr", value: 3908 },
  { month: "Mai", value: 4800 },
  { month: "Jun", value: 3800 },
];

const trends = [
  {
    keyword: "Nachhaltiges Verpackungsmaterial",
    growth: "+124%",
    trend: "up",
  },
  {
    keyword: "Bio-Baumwolle",
    growth: "+82%",
    trend: "up",
  },
  {
    keyword: "Zero Waste",
    growth: "+65%",
    trend: "up",
  },
  {
    keyword: "Plastikfrei",
    growth: "+45%",
    trend: "up",
  },
  {
    keyword: "Recyceltes Plastik",
    growth: "-12%",
    trend: "down",
  },
];

export function MarketAnalysis() {
  const [timeframe, setTimeframe] = useState("6m");

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Markttrends</h3>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Zeitraum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Monat</SelectItem>
                <SelectItem value="3m">3 Monate</SelectItem>
                <SelectItem value="6m">6 Monate</SelectItem>
                <SelectItem value="1y">1 Jahr</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  padding={{ left: 0, right: 0 }}
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis
                  padding={{ top: 20, bottom: 20 }}
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

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
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Empfehlungen</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="font-medium">Produktkategorien im Trend</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
                <span>Nachhaltige Mode</span>
                <Badge variant="secondary">Hohe Nachfrage</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
                <span>Zero Waste Produkte</span>
                <Badge variant="secondary">Wachsend</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
                <span>Bio-Kosmetik</span>
                <Badge variant="secondary">Stabil</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Preisempfehlungen</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
                <span>Bio-Textilien</span>
                <span className="font-medium">+5% Potenzial</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
                <span>Bambusprodukte</span>
                <span className="font-medium">+8% Potenzial</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
                <span>Recycelte Materialien</span>
                <span className="font-medium">+3% Potenzial</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}