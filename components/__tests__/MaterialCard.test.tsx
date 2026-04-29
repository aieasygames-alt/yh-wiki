import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MaterialCard } from "../MaterialCard";

const baseProps = {
  id: "test-material",
  name: "测试材料",
  nameEn: "Test Material",
  rarity: 3,
  type: "resonance",
  locale: "zh" as const,
};

describe("MaterialCard", () => {
  it("renders material name in zh locale", () => {
    render(<MaterialCard {...baseProps} />);
    expect(screen.getByText("测试材料")).toBeInTheDocument();
  });

  it("renders material name in en locale", () => {
    render(<MaterialCard {...baseProps} locale="en" />);
    expect(screen.getByText("Test Material")).toBeInTheDocument();
  });

  it("links to correct material page", () => {
    render(<MaterialCard {...baseProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/zh/materials/test-material");
  });

  it("renders rarity stars", () => {
    render(<MaterialCard {...baseProps} />);
    expect(screen.getByText("★★★")).toBeInTheDocument();
  });

  it("renders type label when showType is true", () => {
    render(<MaterialCard {...baseProps} showType={true} />);
    expect(screen.getByText("共鸣材料")).toBeInTheDocument();
  });

  it("does not render type label when showType is false", () => {
    render(<MaterialCard {...baseProps} showType={false} />);
    expect(screen.queryByText("共鸣材料")).not.toBeInTheDocument();
  });

  it("renders type label in en locale", () => {
    render(<MaterialCard {...baseProps} locale="en" showType={true} />);
    expect(screen.getByText("Resonance")).toBeInTheDocument();
  });
});
