import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { KardzPromoCard } from "../KardzPromoCard";

describe("KardzPromoCard", () => {
  describe("ad disclosure (FTC/EU compliance)", () => {
    it("renders Chinese disclosure on zh locale", () => {
      render(<KardzPromoCard locale="zh" variant="card" />);
      expect(screen.getByText(/广告/)).toBeInTheDocument();
      expect(screen.getByText(/佣金/)).toBeInTheDocument();
    });

    it("renders Traditional Chinese disclosure on tw locale", () => {
      render(<KardzPromoCard locale="tw" variant="card" />);
      expect(screen.getByText(/廣告/)).toBeInTheDocument();
      expect(screen.getByText(/分潤/)).toBeInTheDocument();
    });

    it("renders English disclosure on en locale", () => {
      render(<KardzPromoCard locale="en" variant="card" />);
      expect(screen.getByText(/Sponsored/)).toBeInTheDocument();
      expect(screen.getByText(/commission/i)).toBeInTheDocument();
    });

    it("includes disclosure in every variant", () => {
      for (const variant of ["banner", "card", "compact"] as const) {
        const { unmount } = render(<KardzPromoCard locale="en" variant={variant} />);
        expect(screen.getAllByText(/Sponsored/i).length).toBeGreaterThan(0);
        unmount();
      }
    });
  });

  describe("rel=sponsored attribute", () => {
    it("uses rel=sponsored on the anchor for Google SEO", () => {
      const { container } = render(<KardzPromoCard locale="en" variant="card" />);
      const anchor = container.querySelector("a");
      expect(anchor).toBeTruthy();
      expect(anchor?.getAttribute("rel")).toContain("sponsored");
      expect(anchor?.getAttribute("rel")).toContain("noopener");
      expect(anchor?.getAttribute("rel")).toContain("noreferrer");
    });
  });

  describe("aria-label combines title + disclosure", () => {
    it("has aria-label mentioning both the title and the ad disclosure", () => {
      const { container } = render(<KardzPromoCard locale="en" variant="card" />);
      const anchor = container.querySelector("a");
      const label = anchor?.getAttribute("aria-label") || "";
      expect(label).toMatch(/Recharge|Top-?up/i);
      expect(label).toMatch(/Sponsored/i);
    });
  });

  describe("link target", () => {
    it("points to the kardz.com domain with the correct partner id", () => {
      const { container } = render(<KardzPromoCard locale="en" variant="card" />);
      const href = container.querySelector("a")?.getAttribute("href") || "";
      expect(href).toContain("kardzntewiki.kardz.com");
      expect(href).toContain("id=1578299964");
    });

    it("uses the zh-tw URL for both zh and tw locales", () => {
      for (const loc of ["zh", "tw"] as const) {
        const { container } = render(<KardzPromoCard locale={loc} variant="card" />);
        const href = container.querySelector("a")?.getAttribute("href") || "";
        expect(href).toContain("/zh-tw/");
      }
    });

    it("uses the English URL for en locale", () => {
      const { container } = render(<KardzPromoCard locale="en" variant="card" />);
      const href = container.querySelector("a")?.getAttribute("href") || "";
      expect(href).toContain("/game/");
      expect(href).not.toContain("/zh-tw/");
    });
  });
});
