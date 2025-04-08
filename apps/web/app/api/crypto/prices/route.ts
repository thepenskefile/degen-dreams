import { NextResponse } from "next/server";
import { getDailyPairOhlcv } from "../../services/cryptocompare";

export const revalidate = 86400; // 24 hours in seconds

// Simple in-memory cache for development
const priceCache: {
  [key: string]: {
    data: any;
    timestamp: number;
  };
} = {};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromSymbol = searchParams.get("fromSymbol") || "BTC";
    const toSymbol = searchParams.get("toSymbol") || "USD";

    // Validate symbols
    if (!fromSymbol || !toSymbol) {
      return NextResponse.json(
        { error: "fromSymbol and toSymbol are required" },
        { status: 400 }
      );
    }

    const cacheKey = `${fromSymbol}-${toSymbol}`;
    const now = Date.now();

    // Check in-memory cache first
    if (
      process.env.NODE_ENV === "development" &&
      priceCache[cacheKey] &&
      now - priceCache[cacheKey].timestamp < CACHE_DURATION
    ) {
      console.log(`[DEV] Serving cached price data for ${cacheKey}`);
      return NextResponse.json(priceCache[cacheKey].data);
    }

    const data = await getDailyPairOhlcv({
      fromSymbol,
      toSymbol,
      allData: true,
    });

    // Transform the data to a more usable format
    const transformedData = data.Data.Data.map((item) => ({
      timestamp: item.time,
      date: new Date(item.time * 1000).toISOString(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    // Store in development cache
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Caching price data for ${cacheKey}`);
      priceCache[cacheKey] = {
        data: transformedData,
        timestamp: now,
      };
    }

    // Calculate when today ends in UTC
    const nowDate = new Date(now);
    const endOfDay = new Date(
      Date.UTC(
        nowDate.getUTCFullYear(),
        nowDate.getUTCMonth(),
        nowDate.getUTCDate() + 1
      )
    );
    const secondsUntilEndOfDay = Math.floor((endOfDay.getTime() - now) / 1000);

    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control": `public, s-maxage=${secondsUntilEndOfDay}, stale-while-revalidate=86400`,
      },
    });
  } catch (error) {
    console.error("Error fetching price data:", error);
    return NextResponse.json(
      { error: "Failed to fetch price data" },
      { status: 500 }
    );
  }
}
