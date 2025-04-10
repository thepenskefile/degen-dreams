import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "../Input";

describe("Input", () => {
  it("renders with default props", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-class");
  });

  it("displays validation error", () => {
    render(<Input validationText="Required field" />);
    const input = screen.getByRole("textbox");
    const errorMessage = screen.getByText("Required field");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-400");
  });

  it("renders with dark mode styles", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("dark:bg-surface-dark", "dark:border-zinc-700");
  });

  it("forwards HTML attributes", () => {
    render(
      <Input
        type="email"
        placeholder="Enter email"
        disabled
        required
        data-testid="test-input"
      />
    );
    const input = screen.getByTestId("test-input");

    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "Enter email");
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
  });

  it("applies focus styles", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "focus:ring-2",
      "focus:ring-gray-200",
      "focus:ring-offset-2"
    );
  });

  it("applies hover styles", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("hover:bg-gray-100");
  });

  it("applies disabled styles", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed"
    );
  });
});
