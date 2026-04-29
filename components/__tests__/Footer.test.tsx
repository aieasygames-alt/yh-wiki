import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/zh/characters",
}));

// Mock Logo
vi.mock("../Logo", () => ({
  default: ({ size }: { size: number }) => (
    <span data-testid="logo" data-size={size}>Logo</span>
  ),
}));

import { Footer } from "../Footer";

describe("Footer", () => {
  it("renders 4 footer columns", () => {
    render(<Footer />);
    // Check for column titles using translation keys
    expect(screen.getByText("角色")).toBeInTheDocument();
    expect(screen.getByText("武器")).toBeInTheDocument();
    expect(screen.getByText("材料")).toBeInTheDocument();
    expect(screen.getByText("地点")).toBeInTheDocument();
  });

  it("renders copyright with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it("renders Discord link", () => {
    render(<Footer />);
    const discordLinks = screen.getAllByText("Discord");
    expect(discordLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders Reddit link", () => {
    render(<Footer />);
    const redditLinks = screen.getAllByText("Reddit");
    expect(redditLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders community disclaimer in zh", () => {
    render(<Footer />);
    expect(screen.getByText("本站为玩家社区工具站，与官方无关")).toBeInTheDocument();
  });

  it("renders navigation links with correct paths", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/zh/characters");
    expect(hrefs).toContain("/zh/weapons");
    expect(hrefs).toContain("/zh/materials");
    expect(hrefs).toContain("/zh/guides");
  });
});
