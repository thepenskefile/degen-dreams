import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Button, GradientButton } from "../index";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    expect(button).not.toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button");
    user.click(button);
    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  it("renders as disabled", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed"
    );
  });

  it("renders with different types", () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("applies dark mode styles", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "dark:bg-surface-dark",
      "dark:hover:bg-surface-dark/80"
    );
  });
});

describe("GradientButton", () => {
  it("renders with default gradient", () => {
    render(<GradientButton>Click me</GradientButton>);
    const wrapper = screen.getByRole("button").parentElement;
    expect(wrapper).toHaveClass(
      "bg-gradient-to-r",
      "from-purple-500",
      "via-pink-500",
      "to-red-500"
    );
  });

  it("applies custom gradient className", () => {
    render(
      <GradientButton gradientClassName="custom-gradient">
        Click me
      </GradientButton>
    );
    const wrapper = screen.getByRole("button").parentElement;
    expect(wrapper).toHaveClass("custom-gradient");
  });

  it("applies custom button className", () => {
    render(<GradientButton className="custom-button">Click me</GradientButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-button");
  });

  it("inherits Button props", async () => {
    const handleClick = vi.fn();
    render(<GradientButton onClick={handleClick}>Click me</GradientButton>);
    const button = screen.getByRole("button");
    user.click(button);
    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  it("applies focus styles", () => {
    render(<GradientButton>Click me</GradientButton>);
    const wrapper = screen.getByRole("button").parentElement;
    expect(wrapper).toHaveClass(
      "focus-within:ring-2",
      "focus-within:ring-purple-500/50"
    );
  });

  it("renders with dark mode styles", () => {
    render(<GradientButton>Click me</GradientButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "dark:bg-surface-dark",
      "dark:hover:bg-surface-dark/80"
    );
  });
});
