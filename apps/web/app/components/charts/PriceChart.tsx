import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
  Label,
  ReferenceLine,
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
  highestPoint: PriceData;
  lowestPoint: PriceData;
}

export function PriceChart({
  data,
  isProfit,
  highestPoint,
  lowestPoint,
}: PriceChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartColor = isProfit
    ? { light: "#14b8a6", dark: "#5eead4" } // Teal
    : { light: "#ef4444", dark: "#f87171" }; // Red

  const firstPoint = React.useMemo(() => data[0], [data]);
  const lastPoint = React.useMemo(() => data[data.length - 1], [data]);

  return (
    <div className="w-full h-80 mt-4 p-4 rounded-lg border dark:border-zinc-700 border-gray-300">
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

          <ReferenceLine
            x={firstPoint?.date}
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeDasharray="6 3"
            strokeOpacity={0.5}
            label={{
              value: "Where you aped in",
              position: "insideBottomLeft",
              style: { fontSize: 10 },
            }}
          />

          <ReferenceLine
            x={lastPoint?.date}
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeDasharray="6 3"
            strokeOpacity={0.5}
            label={{
              value: "Where we are now",
              position: "insideBottomRight",
              style: { fontSize: 10 },
            }}
          />

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

          <ReferenceDot
            x={highestPoint.date}
            y={highestPoint.close}
            r={20}
            fill="transparent"
            stroke="none"
            label={{
              value: "🤑",
              position: "center",
              style: { fontSize: 28 },
            }}
          />

          <ReferenceDot
            x={lowestPoint.date}
            y={lowestPoint.close}
            r={20}
            fill="transparent"
            stroke="none"
            label={{
              value: "😱",
              position: "center",
              style: { fontSize: 28 },
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
