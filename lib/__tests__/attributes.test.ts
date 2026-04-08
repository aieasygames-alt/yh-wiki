import { describe, it, expect } from "vitest";
import {
  ATTRIBUTE_COLORS,
  ATTRIBUTE_LABELS,
  getAttributeColor,
  getAttributeLabel,
  getRankDisplay,
} from "../attributes";

describe("ATTRIBUTE_COLORS", () => {
  const expectedAttrs = ["cosmos", "anima", "incantation", "chaos", "psyche", "lakshana"];

  it("has colors for all 6 attributes", () => {
    for (const attr of expectedAttrs) {
      expect(ATTRIBUTE_COLORS[attr]).toBeTruthy();
    }
  });

  it("colors contain tailwind classes", () => {
    for (const attr of expectedAttrs) {
      const color = ATTRIBUTE_COLORS[attr];
      expect(color).toContain("bg-");
      expect(color).toContain("text-");
      expect(color).toContain("border-");
    }
  });
});

describe("ATTRIBUTE_LABELS", () => {
  const expectedAttrs = ["cosmos", "anima", "incantation", "chaos", "psyche", "lakshana"];

  it("has Chinese labels for all attributes", () => {
    for (const attr of expectedAttrs) {
      expect(ATTRIBUTE_LABELS[attr].zh).toBeTruthy();
    }
  });

  it("has English labels for all attributes", () => {
    for (const attr of expectedAttrs) {
      expect(ATTRIBUTE_LABELS[attr].en).toBeTruthy();
    }
  });

  it("Chinese labels are correct", () => {
    expect(ATTRIBUTE_LABELS.cosmos.zh).toBe("宇宙");
    expect(ATTRIBUTE_LABELS.anima.zh).toBe("生命");
    expect(ATTRIBUTE_LABELS.incantation.zh).toBe("咒术");
    expect(ATTRIBUTE_LABELS.chaos.zh).toBe("混沌");
    expect(ATTRIBUTE_LABELS.psyche.zh).toBe("灵魂");
    expect(ATTRIBUTE_LABELS.lakshana.zh).toBe("相");
  });
});

describe("getAttributeColor", () => {
  it("returns color for valid attributes", () => {
    expect(getAttributeColor("cosmos")).toContain("purple");
    expect(getAttributeColor("anima")).toContain("emerald");
  });

  it("returns empty string for invalid attribute", () => {
    expect(getAttributeColor("")).toBe("");
    expect(getAttributeColor("fire")).toBe("");
  });
});

describe("getAttributeLabel", () => {
  it("returns Chinese label for zh locale", () => {
    expect(getAttributeLabel("cosmos", "zh")).toBe("宇宙");
    expect(getAttributeLabel("chaos", "zh")).toBe("混沌");
  });

  it("returns English label for en locale", () => {
    expect(getAttributeLabel("cosmos", "en")).toBe("Cosmos");
    expect(getAttributeLabel("chaos", "en")).toBe("Chaos");
  });

  it("returns raw attribute string for unknown locale", () => {
    expect(getAttributeLabel("cosmos", "ja" as "zh")).toBe("cosmos");
  });
});

describe("getRankDisplay", () => {
  it("returns S for S rank", () => {
    expect(getRankDisplay("S")).toBe("S");
  });

  it("returns A for A rank", () => {
    expect(getRankDisplay("A")).toBe("A");
  });

  it("defaults to A for unknown rank", () => {
    expect(getRankDisplay("B")).toBe("A");
    expect(getRankDisplay("")).toBe("A");
  });
});
