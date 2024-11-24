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

interface ChartWrapperProps {
  data: Array<{ month: string; value: number }>;
}

export function ChartWrapper({ data }: ChartWrapperProps) {
  const axisConfig = {
    stroke: "currentColor",
    fontSize: 12,
    tickLine: { stroke: "currentColor" },
    axisLine: { stroke: "currentColor" },
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis 
          dataKey="month"
          {...axisConfig}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          {...axisConfig}
          width={40}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '8px 12px',
          }}
          itemStyle={{
            color: 'var(--foreground)',
          }}
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
  );
}