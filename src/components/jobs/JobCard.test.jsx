import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import JobCard from "./JobCard";

// Mock the auth context
vi.mock("../../context/auth", () => ({
  useUser: () => ({ user: { id: "1", name: "Test User" } }),
}));

// Mock the analytics service
vi.mock("../../services/analytics", () => ({
  default: { track: vi.fn() },
}));

describe("JobCard", () => {
  const job = {
    id: "job1",
    title: "Frontend Developer",
    company: "Tech Corp",
    companyLogo: "",
    location: "Remote",
    salary: 120000,
    type: "Full-time",
    postedAt: new Date().toISOString(),
    description: "Exciting job!",
    skills: ["React", "JS"],
  };
  const onSave = vi.fn();
  const onApply = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders job info and skills", () => {
    render(
      <MemoryRouter>
        <JobCard job={job} onSave={onSave} onApply={onApply} isSaved={false} />
      </MemoryRouter>
    );
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.getByText("Exciting job!")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  it("calls onSave when save button is clicked", () => {
    render(
      <MemoryRouter>
        <JobCard job={job} onSave={onSave} onApply={onApply} isSaved={false} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByLabelText("Save job"));
    expect(onSave).toHaveBeenCalledWith("job1");
  });

  it("calls onApply when apply button is clicked", () => {
    render(
      <MemoryRouter>
        <JobCard job={job} onSave={onSave} onApply={onApply} isSaved={false} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Apply Now"));
    expect(onApply).toHaveBeenCalledWith("job1");
  });
});
