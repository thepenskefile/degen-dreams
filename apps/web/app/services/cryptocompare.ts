const BASE_URL = "https://min-api.cryptocompare.com/data";

interface HistoricalPriceData {
  Aggregated: boolean;
  TimeFrom: number;
  TimeTo: number;
  Data: Array<{
    time: number;
    close: number;
    high: number;
    low: number;
    open: number;
    volumefrom: number;
    volumeto: number;
  }>;
}

interface HistoricalDataResponse {
  Data: HistoricalPriceData;
  Response: string;
  Message: string;
  HasWarning: boolean;
  Type: number;
  RateLimit: Record<string, unknown>;
}

interface GetDailyPairOHLCVParams {
  fromSymbol: string;
  toSymbol: string;
  limit?: number;
  allData?: boolean;
}

export async function getDailyPairOhlcv({
  fromSymbol,
  toSymbol,
  limit,
  allData,
}: GetDailyPairOHLCVParams): Promise<HistoricalDataResponse> {
  try {
    const params = new URLSearchParams({
      fsym: fromSymbol.toUpperCase(),
      tsym: toSymbol.toUpperCase(),
    });

    if (allData) {
      params.append("allData", "true");
    }

    if (limit) {
      params.append("limit", limit.toString());
    }

    const response = await fetch(
      `${BASE_URL}/v2/histoday?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = (await response.json()) as unknown as HistoricalDataResponse;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
