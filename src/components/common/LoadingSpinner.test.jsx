import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default props", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders with custom text and size", () => {
    render(<LoadingSpinner text="Please wait" size="lg" />);
    expect(screen.getByText("Please wait")).toBeInTheDocument();
  });

  it("renders in fullScreen mode", () => {
    const { container } = render(<LoadingSpinner fullScreen />);
    expect(container.firstChild).toHaveClass("fixed");
  });
});
