import React from "react";
import { PriceChart } from "../charts/PriceChart";
import { CalculateReturnsResult } from "../../services/price-service";

interface ResultsDisplayProps {
  data: Pick<
    CalculateReturnsResult,
    | "currentValue"
    | "profitLossPercentage"
    | "profitLoss"
    | "maxValue"
    | "priceData"
    | "highestPoint"
    | "lowestPoint"
  >;
}

export function ResultsDisplay({ data }: ResultsDisplayProps) {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col gap-1">
        <div>
          <span className="text-3xl md:text-4xl font-bold">
            {data?.profitLoss >= 0 ? "🎉" : "💸"} You&apos;d have $
            {data?.currentValue?.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{" "}
            today!
          </span>
        </div>
        <div>
          <span className="text-zinc-500">
            That&apos;s a{" "}
            <span
              className={
                data.profitLossPercentage >= 0
                  ? "text-teal-400"
                  : "text-red-400"
              }
            >
              {data?.profitLossPercentage >= 0 ? "+" : ""}
              {data?.profitLossPercentage?.toFixed(2)}%
            </span>{" "}
            {data.profitLoss >= 0 ? "gain" : "loss"}!
          </span>
        </div>
      </div>

      <div>
        <span className="uppercase text-3xl md:text-4xl font-bold text-amber-300">
          But you missed out on a max of $
          {data?.maxValue?.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
          ... <span className="italic">Ouch!</span>
        </span>
      </div>

      <PriceChart
        data={data.priceData}
        isProfit={data.profitLoss >= 0}
        highestPoint={data.highestPoint}
        lowestPoint={data.lowestPoint}
      />
    </div>
  );
}
