"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  month: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
}

export function LineChart({ data }: LineChartProps) {
  // Common styles for axes
  const axisStyle = {
    fontSize: 12,
    stroke: "currentColor",
    strokeWidth: 1,
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis 
          dataKey="month"
          {...axisStyle}
          axisLine={{ stroke: 'currentColor' }}
          tickLine={false}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          {...axisStyle}
          axisLine={{ stroke: 'currentColor' }}
          tickLine={false}
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
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}