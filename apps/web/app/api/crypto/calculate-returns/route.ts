import { NextResponse } from "next/server";

interface PriceData {
  timestamp: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CalculateReturnsResponse {
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
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromTs = searchParams.get("fromTs");
    const amount = searchParams.get("amount");
    const fromSymbol = searchParams.get("fromSymbol") || "BTC";
    const toSymbol = searchParams.get("toSymbol") || "USD";

    // Validate parameters
    if (!fromTs || !amount) {
      return NextResponse.json(
        { error: "fromTs and amount parameters are required" },
        { status: 400 }
      );
    }

    if (!fromSymbol || !toSymbol) {
      return NextResponse.json(
        { error: "fromSymbol and toSymbol are required" },
        { status: 400 }
      );
    }

    if (isNaN(Number(fromTs)) || Number(fromTs) <= 0) {
      return NextResponse.json(
        { error: "fromTs must be a positive number" },
        { status: 400 }
      );
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "amount must be a positive number" },
        { status: 400 }
      );
    }

    // Fetch the cached price data
    const response = await fetch(
      `${request.url.split("/api/")[0]}/api/crypto/prices?fromSymbol=${fromSymbol}&toSymbol=${toSymbol}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch price data");
    }

    const allPriceData: PriceData[] = await response.json();

    // Filter data based on fromTs
    const filteredData = allPriceData.filter(
      (item) => item.timestamp >= Number(fromTs)
    );

    if (filteredData.length === 0) {
      return NextResponse.json(
        { error: "No price data available for the specified time period" },
        { status: 404 }
      );
    }

    // Calculate returns
    const initialInvestment = Number(amount);
    const firstDataPoint = filteredData[0];
    const lastDataPoint = filteredData[filteredData.length - 1];

    if (!firstDataPoint || !lastDataPoint) {
      return NextResponse.json(
        { error: "Invalid price data" },
        { status: 500 }
      );
    }

    const firstPrice = firstDataPoint.open;
    const lastPrice = lastDataPoint.close;
    const highestPrice = Math.max(...filteredData.map((d) => d.high));
    const lowestPrice = Math.min(...filteredData.map((d) => d.low));

    const currentValue = (initialInvestment / firstPrice) * lastPrice;
    const maxValue = (initialInvestment / firstPrice) * highestPrice;
    const minValue = (initialInvestment / firstPrice) * lowestPrice;

    const profitLoss = currentValue - initialInvestment;
    const profitLossPercentage = (profitLoss / initialInvestment) * 100;
    const maxProfit = maxValue - initialInvestment;
    const maxLoss = minValue - initialInvestment;
    const maxLossPercentage = (maxLoss / initialInvestment) * 100;
    const returnMultiple = currentValue / initialInvestment;

    const result: CalculateReturnsResponse = {
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
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error calculating returns:", error);
    return NextResponse.json(
      { error: "Failed to calculate returns" },
      { status: 500 }
    );
  }
}
