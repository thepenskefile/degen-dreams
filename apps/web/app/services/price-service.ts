import { getDailyPairOhlcv } from "./cryptocompare";
import { unstable_cache } from "next/cache";

export interface PriceData {
  timestamp: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CalculateReturnsResult {
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  maxValue: number;
  maxProfit: number;
  minValue: number;
  maxLoss: number;
  maxLossPercentage: number;
  returnMultiple: number;
  priceData: PriceData[];
  highestPoint: PriceData;
  lowestPoint: PriceData;
}

// Calculate seconds until next UTC day
function getSecondsUntilNextUTCDay(): number {
  const now = new Date();
  const nextDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
  return Math.floor((nextDay.getTime() - now.getTime()) / 1000);
}

// Cache the price data until next UTC day
const getCachedPriceData = unstable_cache(
  async (fromSymbol: string, toSymbol: string) => {
    const data = await getDailyPairOhlcv({
      fromSymbol,
      toSymbol,
      allData: true,
    });

    return data.Data.Data.map((item) => ({
      timestamp: item.time,
      date: new Date(item.time * 1000).toISOString(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));
  },
  ["price-data"],
  { revalidate: getSecondsUntilNextUTCDay() }
);

export async function getPriceData(
  fromSymbol: string,
  toSymbol: string
): Promise<PriceData[]> {
  return getCachedPriceData(fromSymbol, toSymbol);
}

export async function calculateInvestmentReturns(
  fromSymbol: string,
  toSymbol: string,
  fromTs: number,
  amount: number
): Promise<CalculateReturnsResult> {
  // Get price data from cache
  const priceData = await getPriceData(fromSymbol, toSymbol);

  // Filter data based on fromTs
  const filteredData = priceData.filter((item) => item.timestamp >= fromTs);

  if (filteredData.length === 0) {
    throw new Error("No price data available for the specified time period");
  }

  // Find the first data point with non-zero price
  const firstValidDataPoint = filteredData.find(
    (item) => item.open > 0 && item.high > 0 && item.low > 0 && item.close > 0
  );

  if (!firstValidDataPoint) {
    throw new Error(
      "No valid price data available for the specified time period"
    );
  }

  const lastDataPoint = filteredData[filteredData.length - 1];

  if (!lastDataPoint) {
    throw new Error("Invalid price data");
  }

  const highestPoint = filteredData.reduce(
    (max: PriceData, point: PriceData) => (point.high > max.high ? point : max),
    firstValidDataPoint
  );

  const lowestPoint = filteredData.reduce(
    (min: PriceData, point: PriceData) => (point.low < min.low ? point : min),
    firstValidDataPoint
  );

  const initialInvestment = Number(amount);
  const firstPrice = firstValidDataPoint.open;
  const lastPrice = lastDataPoint.close;
  const highestPrice = highestPoint.high;
  const lowestPrice = lowestPoint.low;

  const currentValue = (initialInvestment / firstPrice) * lastPrice;
  const maxValue = (initialInvestment / firstPrice) * highestPrice;
  const minValue = (initialInvestment / firstPrice) * lowestPrice;

  const profitLoss = currentValue - initialInvestment;
  const profitLossPercentage = (profitLoss / initialInvestment) * 100;
  const maxProfit = maxValue - initialInvestment;
  const maxLoss = minValue - initialInvestment;
  const maxLossPercentage = (maxLoss / initialInvestment) * 100;
  const returnMultiple = currentValue / initialInvestment;

  return {
    currentValue,
    profitLoss,
    profitLossPercentage,
    maxValue,
    maxProfit,
    minValue,
    maxLoss,
    maxLossPercentage,
    returnMultiple,
    priceData: filteredData,
    highestPoint,
    lowestPoint,
  };
}
