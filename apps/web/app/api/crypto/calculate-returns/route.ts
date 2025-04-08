import { NextResponse } from "next/server";
import { calculateInvestmentReturns } from "../../../services/price-service";

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

    const result = await calculateInvestmentReturns(
      fromSymbol,
      toSymbol,
      Number(fromTs),
      Number(amount)
    );

    // Don't cache the response as it depends on user input
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error calculating returns:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to calculate returns",
      },
      { status: 500 }
    );
  }
}
