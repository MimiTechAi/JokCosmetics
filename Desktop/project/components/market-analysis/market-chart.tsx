"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartWrapper } from "./chart-wrapper";

interface MarketChartProps {
  data: Array<{ month: string; value: number }>;
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

export function MarketChart({ data, timeframe, onTimeframeChange }: MarketChartProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Markttrends</h3>
        <Select value={timeframe} onValueChange={onTimeframeChange}>
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
        <ChartWrapper data={data} />
      </div>
    </Card>
  );
}