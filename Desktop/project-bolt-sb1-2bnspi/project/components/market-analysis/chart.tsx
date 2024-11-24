"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataPoint {
  month: string;
  value: number;
}

interface ChartProps {
  data: DataPoint[];
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

export function Chart({ data, timeframe, onTimeframeChange }: ChartProps) {
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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="var(--border)"
            />
            <XAxis 
              dataKey="month"
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'currentColor' }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'currentColor' }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'var(--foreground)' }}
              itemStyle={{ color: 'var(--foreground)' }}
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
  );
}