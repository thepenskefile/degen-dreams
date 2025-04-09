import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "../Card";

describe("Card", () => {
  it("renders with default props", () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText("Card content");
    expect(card).toBeInTheDocument();
  });

  it("forwards HTML attributes", () => {
    render(<Card data-testid="test-card">Card content</Card>);
    const card = screen.getByTestId("test-card");
    expect(card).toBeInTheDocument();
  });
});
