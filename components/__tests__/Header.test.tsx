import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock next/navigation
const mockPathname = "/zh/characters";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

// Mock SearchDialog (it fetches network resources)
vi.mock("../SearchDialog", () => ({
  SearchDialog: ({ lang }: { lang: string }) => (
    <button data-testid="search-dialog" data-lang={lang}>Search</button>
  ),
}));

// Mock Logo
vi.mock("../Logo", () => ({
  default: ({ size }: { size: number }) => (
    <span data-testid="logo" data-size={size}>Logo</span>
  ),
}));

import { Header } from "../Header";

describe("Header", () => {
  it("renders the site logo", () => {
    render(<Header />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getByText("角色")).toBeInTheDocument();
  });

  it("renders language switcher", () => {
    render(<Header />);
    // zh path -> shows "繁" (switch to tw)
    expect(screen.getByText("繁")).toBeInTheDocument();
  });

  it("renders search dialog", () => {
    render(<Header />);
    expect(screen.getByTestId("search-dialog")).toBeInTheDocument();
  });

  it("renders Discord link", () => {
    render(<Header />);
    const discordLink = screen.getByTitle("加入 Discord 社区");
    expect(discordLink).toHaveAttribute("href", "https://discord.com/invite/PuWfNRcBt9");
  });

  it("renders mobile menu toggle button", () => {
    render(<Header />);
    const menuButton = screen.getByLabelText("Toggle menu");
    expect(menuButton).toBeInTheDocument();
  });

  it("opens mobile menu on button click", () => {
    render(<Header />);
    const menuButton = screen.getByLabelText("Toggle menu");
    fireEvent.click(menuButton);
    // Mobile menu should now show nav items
    expect(screen.getByText("加入 Discord 社区")).toBeInTheDocument();
  });

  it("renders dropdown items in nav", () => {
    render(<Header />);
    // "攻略与工具" is a dropdown, not directly a link
    expect(screen.getByText("攻略与工具")).toBeInTheDocument();
  });

  it("renders blog link", () => {
    render(<Header />);
    expect(screen.getByText("博客")).toBeInTheDocument();
  });
});
