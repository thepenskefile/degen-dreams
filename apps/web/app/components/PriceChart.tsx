import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "next-themes";

interface PriceData {
  timestamp: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface PriceChartProps {
  data: PriceData[];
  isProfit: boolean;
}

export function PriceChart({ data, isProfit }: PriceChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartColor = isProfit
    ? { light: "#14b8a6", dark: "#5eead4" } // Teal
    : { light: "#ef4444", dark: "#f87171" }; // Red

  return (
    <div className="w-full h-[300px] mt-4 p-4 rounded-lg border dark:border-[#2E2E2D] border-gray-300">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={isDark ? chartColor.dark : chartColor.light}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={isDark ? chartColor.dark : chartColor.light}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke={isDark ? "#2E2E2D" : "#e4e4e7"}
            strokeDasharray="0"
          />
          <XAxis dataKey="date" hide={true} />
          <YAxis hide={true} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#18181b" : "#ffffff",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            formatter={(value: number) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              }).format(value)
            }
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={isDark ? chartColor.dark : chartColor.light}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
            dot={false}
            activeDot={{
              r: 4,
              fill: isDark ? chartColor.dark : chartColor.light,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
