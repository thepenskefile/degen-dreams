import { NextResponse } from "next/server";
import { getDailyPairOhlcv } from "../../services/cryptocompare";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromSymbol = searchParams.get("fromSymbol");
    const toSymbol = searchParams.get("toSymbol");
    const fromTs = searchParams.get("fromTs");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const allData = searchParams.get("allData") === "true";

    // Validate required parameters
    if (!fromSymbol) {
      return NextResponse.json(
        { error: "fromSymbol parameter is required" },
        { status: 400 }
      );
    }

    if (!toSymbol) {
      return NextResponse.json(
        { error: "toSymbol parameter is required" },
        { status: 400 }
      );
    }

    // Validate fromTs if provided
    if (fromTs && (isNaN(Number(fromTs)) || Number(fromTs) <= 0)) {
      return NextResponse.json(
        { error: "fromTs must be a positive number" },
        { status: 400 }
      );
    }

    // Validate limit if provided
    if (limit && (isNaN(limit) || limit <= 0)) {
      return NextResponse.json(
        { error: "limit must be a positive number" },
        { status: 400 }
      );
    }

    const data = await getDailyPairOhlcv({
      fromSymbol,
      toSymbol,
      limit,
      allData,
    });

    // Transform the data to a more usable format
    const transformedData = data.Data.Data.map((item) => ({
      timestamp: item.time,
      date: new Date(item.time * 1000).toISOString(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    })).filter((item) => !fromTs || item.timestamp >= Number(fromTs));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching price data:", error);
    return NextResponse.json(
      { error: "Failed to fetch price data" },
      { status: 500 }
    );
  }
}
