import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CharacterCard } from "../CharacterCard";

const baseProps = {
  id: "test-char",
  name: "测试角色",
  nameEn: "Test Character",
  attribute: "cosmos",
  rank: "S",
  locale: "zh" as const,
};

describe("CharacterCard", () => {
  it("renders character name in zh locale", () => {
    render(<CharacterCard {...baseProps} />);
    expect(screen.getByText("测试角色")).toBeInTheDocument();
  });

  it("renders character name in en locale", () => {
    render(<CharacterCard {...baseProps} locale="en" />);
    expect(screen.getByText("Test Character")).toBeInTheDocument();
    // subName in en locale should show the zh name
    expect(screen.getByText("测试角色")).toBeInTheDocument();
  });

  it("renders rank badge", () => {
    render(<CharacterCard {...baseProps} />);
    expect(screen.getByText("S")).toBeInTheDocument();
  });

  it("renders attribute label", () => {
    render(<CharacterCard {...baseProps} />);
    // getAttributeLabel("cosmos", "zh") should return "宇宙"
    const attrLabel = screen.getByText("宇宙");
    expect(attrLabel).toBeInTheDocument();
  });

  it("links to correct character page", () => {
    render(<CharacterCard {...baseProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/zh/characters/test-char");
  });

  it("renders en link with en locale", () => {
    render(<CharacterCard {...baseProps} locale="en" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/en/characters/test-char");
  });

  it("shows upcoming status badge", () => {
    render(<CharacterCard {...baseProps} status="upcoming" />);
    expect(screen.getByText("即将登场")).toBeInTheDocument();
  });

  it("shows rumored status badge", () => {
    render(<CharacterCard {...baseProps} status="rumored" />);
    expect(screen.getByText("数据待确认")).toBeInTheDocument();
  });

  it("shows no status badge when status is undefined", () => {
    render(<CharacterCard {...baseProps} />);
    expect(screen.queryByText("即将登场")).not.toBeInTheDocument();
    expect(screen.queryByText("数据待确认")).not.toBeInTheDocument();
  });

  it("renders A rank with blue color class", () => {
    const { container } = render(<CharacterCard {...baseProps} rank="A" />);
    const rankEl = screen.getByText("A");
    expect(rankEl.className).toContain("text-blue-400");
  });

  it("renders S rank with yellow color class", () => {
    render(<CharacterCard {...baseProps} rank="S" />);
    const rankEl = screen.getByText("S");
    expect(rankEl.className).toContain("text-yellow-400");
  });
});
