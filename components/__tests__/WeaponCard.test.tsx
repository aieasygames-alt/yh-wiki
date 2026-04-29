import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { WeaponCard } from "../WeaponCard";

const baseProps = {
  id: "test-weapon",
  name: "测试武器",
  nameTw: "測試武器",
  nameEn: "Test Weapon",
  rank: "S",
  type: "plasma",
  baseAtk: 500,
  substat: "critRate",
  substatValue: "20%",
  locale: "zh" as const,
};

describe("WeaponCard", () => {
  it("renders weapon name in zh locale", () => {
    render(<WeaponCard {...baseProps} />);
    expect(screen.getByText("测试武器")).toBeInTheDocument();
  });

  it("renders weapon name in en locale", () => {
    render(<WeaponCard {...baseProps} locale="en" />);
    // en locale: displayName = nameEn, subLabel = nameEn (same value since en = en)
    const matches = screen.getAllByText("Test Weapon");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders rank badge", () => {
    render(<WeaponCard {...baseProps} />);
    expect(screen.getByText("S")).toBeInTheDocument();
  });

  it("links to correct weapon page", () => {
    render(<WeaponCard {...baseProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/zh/weapons/test-weapon");
  });

  it("renders base ATK value", () => {
    render(<WeaponCard {...baseProps} />);
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it("renders substat info", () => {
    render(<WeaponCard {...baseProps} />);
    expect(screen.getByText(/20%/)).toBeInTheDocument();
  });

  it("renders tw locale with tw name", () => {
    render(<WeaponCard {...baseProps} locale="tw" />);
    expect(screen.getByText("測試武器")).toBeInTheDocument();
  });
});
