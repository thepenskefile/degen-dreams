import React from "react";
import { Card } from "@repo/ui/card";

interface StatsCardsProps {
  maxValue: number;
  maxLossPercentage: number;
  returnMultiple: number;
}

export function StatsCards({
  maxValue,
  maxLossPercentage,
  returnMultiple,
}: StatsCardsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-8">
      <Card className="flex flex-col gap-4 w-full justify-between transition-all duration-200 hover:scale-105 hover:shadow-lg">
        <span className="text-zinc-500">If you sold at the top: </span>
        <span className="text-2xl md:text-3xl font-semibold">
          ${maxValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </Card>
      <Card className="flex flex-col gap-4 w-full justify-between transition-all duration-200 hover:scale-105 hover:shadow-lg">
        <span className="text-zinc-500">At the worst moment: </span>
        <span className="text-2xl md:text-3xl font-semibold">
          {maxLossPercentage.toFixed(2)}%
        </span>
      </Card>
      <Card className="flex flex-col gap-4 w-full justify-between transition-all duration-200 hover:scale-105 hover:shadow-lg">
        <span className="text-zinc-500">Return multiple: </span>
        <span className="text-2xl md:text-3xl font-semibold">
          {returnMultiple.toFixed(2)}x
        </span>
      </Card>
    </div>
  );
}
