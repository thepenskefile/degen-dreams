import { CalculateReturnsResult } from "../../services/price-service";

const mockReturnsResult: CalculateReturnsResult = {
  currentValue: 1000,
  profitLossPercentage: 10,
  profitLoss: 100,
  maxValue: 1200,
  priceData: [],
  maxLossPercentage: -5,
  returnMultiple: 2,
  maxProfit: 100,
  minValue: 800,
  maxLoss: -100,
  highestPoint: {
    timestamp: 1712985600,
    date: "2024-04-15",
    open: 1000,
    high: 1200,
    low: 800,
    close: 1200,
  },
  lowestPoint: {
    timestamp: 1712985600,
    date: "2024-04-15",
    open: 1000,
    high: 1200,
    low: 800,
    close: 800,
  },
};

export function buildCalculateReturnsResult(
  overrides?: Partial<CalculateReturnsResult>
) {
  const returnsResult: CalculateReturnsResult = {
    ...mockReturnsResult,
    ...overrides,
  };
  return returnsResult;
}
