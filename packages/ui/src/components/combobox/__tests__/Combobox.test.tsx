import { describe, it, expect, vi, beforeAll } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox } from "../Combobox";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock;
});

const mockOptions = [
  { key: "1", label: "Option 1", value: "value1" },
  { key: "2", label: "Option 2", value: "value2" },
  { key: "3", label: "Option 3", value: "value3" },
];

const user = userEvent.setup();

describe("Combobox", () => {
  it("renders with default props", () => {
    render(<Combobox options={mockOptions} />);
    const input = screen.getByRole("combobox");
    expect(input).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<Combobox options={mockOptions} placeholder="Select an option" />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("placeholder", "Select an option");
  });

  it("filters options based on input", async () => {
    render(<Combobox options={mockOptions} />);
    const input = screen.getByRole("combobox");

    user.type(input, "1");
    await waitFor(() => expect(input).toHaveValue("1"));

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "Option 1" })
      ).toBeInTheDocument();
    });

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Option 1");
  });

  it("handles option selection", async () => {
    const handleChange = vi.fn();
    render(<Combobox options={mockOptions} onChange={handleChange} />);

    const input = screen.getByRole("combobox");
    user.click(input);

    const option = await screen.findByText("Option 1");
    user.click(option);

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(mockOptions[0]);
    });
  });

  it("displays validation error", () => {
    render(<Combobox options={mockOptions} validationText="Required field" />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveClass("border-red-400", "focus:ring-red-200");
  });

  it("handles blur event", () => {
    const handleBlur = vi.fn();
    render(<Combobox options={mockOptions} onBlur={handleBlur} />);

    const input = screen.getByRole("combobox");
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalled();
  });

  it("renders with dark mode styles", () => {
    render(<Combobox options={mockOptions} />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveClass("dark:bg-surface-dark", "dark:border-zinc-700");
  });

  it("displays selected value", () => {
    render(<Combobox options={mockOptions} value={mockOptions[0]} />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveValue("Option 1");
  });

  it("clears query on blur", async () => {
    render(<Combobox options={mockOptions} />);
    const input = screen.getByRole("combobox");

    user.type(input, "Option 1");
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });
});
