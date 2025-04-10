import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "../test/renderComponent";
import Home from "../page";
import { useSearchParams, useRouter } from "next/navigation";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { server } from "../test/setup";
import { http, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

const user = userEvent.setup();

describe("Home Page", () => {
  const mockPush = vi.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSearchParams
    );
  });

  it("renders the main components", () => {
    render(<Home />);

    expect(screen.getByText("If you bought...")).toBeInTheDocument();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("displays error state when submission fails", () => {
    const mockMutation = {
      isPending: false,
      error: new Error("Failed to calculate returns"),
      isSuccess: false,
      mutate: vi.fn(),
    } as unknown as UseMutationResult<any, Error, any>;

    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockMutation
    );

    render(<Home />);
    expect(screen.getByText("Failed to calculate returns")).toBeInTheDocument();
  });

  it.only("displays results when submission is successful", async () => {
    server.use(
      http.post("/api/calculate-returns", () => {
        return new HttpResponse(null, { status: 200 });
      })
    );

    render(<Home />);

    const coinCombobox = screen.getByRole("combobox");
    user.click(coinCombobox);
    await screen.findByRole("option", { name: "BTC" });
    user.click(screen.getByRole("option", { name: "BTC" }));
    // await waitForElementToBeRemoved(() => screen.getByRole("option", { name: "BTC" }));
    await waitFor(() => expect(coinCombobox).toHaveTextContent("BTC"));

    const dateInput = screen.getByRole("input", { name: "Date" });
    user.type(dateInput, "01012015");
    await waitFor(() => expect(dateInput).toHaveValue("01012015"));

    const amountInput = screen.getByRole("input", { name: "Amount" });
    user.type(amountInput, "1000");
    await waitFor(() => expect(amountInput).toHaveValue("1000"));

    const submitButton = screen.getByRole("button", { name: "Calculate" });
    user.click(submitButton);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(
      "/api/calculate-returns?fromTs=1420070400&amount=1000&fromSymbol=BTC&toSymbol=USD"
    );

    await waitFor(() =>
      expect(
        screen.getByText(/you'd have \$1,000\.00 today!/i)
      ).toBeInTheDocument()
    );
  });

  it("updates URL parameters on successful form submission", async () => {
    const mockMutation = {
      isPending: false,
      error: null,
      isSuccess: true,
      data: {
        currentValue: 1000,
        profitLossPercentage: 10,
        profitLoss: 100,
        maxValue: 1200,
        priceData: [],
        maxLossPercentage: -5,
        returnMultiple: 2,
      },
      mutate: vi.fn(),
    } as unknown as UseMutationResult<any, Error, any>;

    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockMutation
    );

    render(<Home />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });

  it("handles initial form submission with URL parameters", () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set("coin", "BTC");
    mockSearchParams.set("date", "2024-01-01");
    mockSearchParams.set("amount", "1000");

    (useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSearchParams
    );

    const mockMutation = {
      isPending: false,
      error: null,
      isSuccess: true,
      data: {
        currentValue: 1000,
        profitLossPercentage: 10,
        profitLoss: 100,
        maxValue: 1200,
        priceData: [],
        maxLossPercentage: -5,
        returnMultiple: 2,
      },
      mutate: vi.fn(),
    } as unknown as UseMutationResult<any, Error, any>;

    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockMutation
    );

    render(<Home />);

    expect(mockMutation.mutate).toHaveBeenCalledWith({
      coin: expect.any(Object),
      date: "2024-01-01",
      amount: "1000",
    });
  });
});
