import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor, RenderResult } from "../test/renderComponent";
import Home from "../page";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { server } from "../test/setup";
import { http, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";
import { CalculateReturnsResult } from "../services/price-service";
import { buildCalculateReturnsResult } from "../test/fixtures";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

const user = userEvent.setup();

function mockSuccessfulResponse({
  overrides,
}: {
  overrides?: Partial<CalculateReturnsResult>;
} = {}) {
  server.use(
    http.get("/api/crypto/calculate-returns", () => {
      return HttpResponse.json(buildCalculateReturnsResult(overrides));
    })
  );
}

function mockFailedResponse() {
  server.use(
    http.get("/api/crypto/calculate-returns", () => {
      return HttpResponse.json(
        { error: "Failed to calculate returns" },
        { status: 500 }
      );
    })
  );
}

async function submitForm({ renderResult }: { renderResult: RenderResult }) {
  const coinCombobox = renderResult.getByRole("combobox");
  user.click(coinCombobox);

  const bitcoinOption = await renderResult.findByRole("option", {
    name: "Bitcoin",
  });

  user.click(bitcoinOption);

  await waitFor(() => expect(bitcoinOption).not.toBeVisible());

  const dateInput = renderResult.getByLabelText("Date");
  user.type(dateInput, "2015-01-01");
  await waitFor(() => expect(dateInput).toHaveValue("2015-01-01"));

  const amountInput = renderResult.getByLabelText("Amount");
  user.type(amountInput, "1000");
  await waitFor(() => expect(amountInput).toHaveValue(1000));

  const submitButton = renderResult.getByRole("button", {
    name: "Simulate",
  });
  user.click(submitButton);
}

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

  it("displays results when submission is successful", async () => {
    const mockFetch = vi.spyOn(global, "fetch");

    mockSuccessfulResponse();

    const renderResult = render(<Home />);

    await submitForm({ renderResult });

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/crypto/calculate-returns?fromTs=1420070400&amount=1000&fromSymbol=BTC&toSymbol=USD"
    );

    await waitFor(() =>
      expect(
        renderResult?.getByText(/you'd have \$1,000 today!/i)
      ).toBeInTheDocument()
    );

    expect(renderResult?.getByText("+10.00%")).toBeInTheDocument();
    expect(
      renderResult?.getByText(/but you missed out on a max of \$1,200/i)
    ).toBeInTheDocument();
  });

  it("displays error state when submission fails", async () => {
    const mockFetch = vi.spyOn(global, "fetch");

    mockFailedResponse();

    const renderResult = render(<Home />);
    await submitForm({ renderResult });

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/crypto/calculate-returns?fromTs=1420070400&amount=1000&fromSymbol=BTC&toSymbol=USD"
    );

    expect(
      renderResult?.getByText("Failed to calculate returns")
    ).toBeInTheDocument();
  });

  it("updates URL parameters on successful form submission", async () => {
    const mockFetch = vi.spyOn(global, "fetch");

    mockSuccessfulResponse();

    const renderResult = render(<Home />);

    await submitForm({ renderResult });

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/crypto/calculate-returns?fromTs=1420070400&amount=1000&fromSymbol=BTC&toSymbol=USD"
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });

    expect(mockPush).toHaveBeenCalledWith(
      "?coin=BTC&date=2015-01-01&amount=1000"
    );
  });

  it("handles initial form submission with URL parameters", async () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set("coin", "BTC");
    mockSearchParams.set("date", "2015-01-01");
    mockSearchParams.set("amount", "1000");
    (useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSearchParams
    );

    const mockFetch = vi.spyOn(global, "fetch");

    mockSuccessfulResponse();

    const renderResult = render(<Home />);

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/crypto/calculate-returns?fromTs=1420070400&amount=1000&fromSymbol=BTC&toSymbol=USD"
    );

    await waitFor(() =>
      expect(
        renderResult?.getByText(/you'd have \$1,000 today!/i)
      ).toBeInTheDocument()
    );
  });

  it("copies the link to the clipboard when the share button is clicked", async () => {
    const mockFetch = vi.spyOn(global, "fetch");
    const mockClipboardWriteText = vi.spyOn(navigator.clipboard, "writeText");

    (usePathname as unknown as ReturnType<typeof vi.fn>).mockReturnValue("/");

    mockSuccessfulResponse();

    const renderResult = render(<Home />);

    await submitForm({ renderResult });

    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set("coin", "BTC");
    mockSearchParams.set("date", "2015-01-01");
    mockSearchParams.set("amount", "1000");
    (useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSearchParams
    );

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/crypto/calculate-returns?fromTs=1420070400&amount=1000&fromSymbol=BTC&toSymbol=USD"
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });

    expect(mockPush).toHaveBeenCalledWith(
      "?coin=BTC&date=2015-01-01&amount=1000"
    );

    const shareLink = await renderResult.findByText(/share/i);
    user.click(shareLink);

    await waitFor(() =>
      expect(mockClipboardWriteText).toHaveBeenCalledTimes(1)
    );

    expect(mockClipboardWriteText).toHaveBeenCalledWith(
      "http://localhost:3000/?coin=BTC&date=2015-01-01&amount=1000"
    );
  });
});
