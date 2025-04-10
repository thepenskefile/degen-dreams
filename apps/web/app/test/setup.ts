import "@testing-library/jest-dom";
import { afterEach, vi, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { CalculateReturnsResult } from "../services/price-service";
// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "",
  useSearchParams: () => new URLSearchParams(),
}));

// Setup MSW server
export const server = setupServer(
  http.post("/api/calculate-returns", () => {
    const calculateReturnsResult: CalculateReturnsResult = {
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
    };

    return HttpResponse.json(calculateReturnsResult);
  })
);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());
