import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageContent } from "../PageContent";

describe("PageContent", () => {
  it("renders with default props", () => {
    render(<PageContent>Content</PageContent>);
    const content = screen.getByText("Content");
    expect(content).toBeInTheDocument();
  });

  it("renders with multiple children", () => {
    render(
      <PageContent>
        <div>Child 1</div>
        <div>Child 2</div>
      </PageContent>
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });
});
