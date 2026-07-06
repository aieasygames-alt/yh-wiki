import { describe, expect, it } from "vitest";

import { localizedSeoKeywords, pickLocalizedText, toTraditionalChinese } from "../traditional";

describe("toTraditionalChinese", () => {
  it("converts simplified Chinese to traditional Chinese", () => {
    expect(toTraditionalChinese("异环预下载开启，角色与攻略")).toBe("異環預下載開啟，角色與攻略");
  });
});

describe("pickLocalizedText", () => {
  it("uses English for en", () => {
    expect(pickLocalizedText("en", "异环攻略", "NTE Guide")).toBe("NTE Guide");
  });

  it("uses Simplified Chinese for zh", () => {
    expect(pickLocalizedText("zh", "异环攻略", "NTE Guide")).toBe("异环攻略");
  });

  it("converts zh fallback for tw", () => {
    expect(pickLocalizedText("tw", "异环攻略", "NTE Guide")).toBe("異環攻略");
  });

  it("normalizes provided tw text to traditional Chinese", () => {
    expect(pickLocalizedText("tw", "异环攻略", "NTE Guide", "異環攻略开启")).toBe("異環攻略開啟");
  });
});

describe("localizedSeoKeywords", () => {
  it("does not mix Simplified Chinese keywords into tw metadata", () => {
    const keywords = localizedSeoKeywords("tw");

    expect(keywords).toContain("異環攻略");
    expect(keywords).not.toContain("异环攻略");
  });
});
