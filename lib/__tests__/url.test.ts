import { describe, expect, it } from "vitest";
import { canonicalPath, localizedPath } from "../url";

describe("canonicalPath", () => {
  it("adds trailing slash to internal page paths", () => {
    expect(canonicalPath("/en/faq/skill-upgrade-materials")).toBe("/en/faq/skill-upgrade-materials/");
  });

  it("keeps query strings and hashes after adding the slash", () => {
    expect(canonicalPath("/zh/team-builder?team=xiaozhi,jiuyuan,hathor")).toBe(
      "/zh/team-builder/?team=xiaozhi,jiuyuan,hathor"
    );
    expect(canonicalPath("/en/characters#tier")).toBe("/en/characters/#tier");
  });

  it("leaves file-like, api, asset, external, and root URLs unchanged", () => {
    expect(canonicalPath("/sitemap.xml")).toBe("/sitemap.xml");
    expect(canonicalPath("/api/characters.json")).toBe("/api/characters.json");
    expect(canonicalPath("/_next/static/app.js")).toBe("/_next/static/app.js");
    expect(canonicalPath("https://nteguide.com/en/characters")).toBe("https://nteguide.com/en/characters");
    expect(canonicalPath("/")).toBe("/");
  });
});

describe("localizedPath", () => {
  it("builds canonical localized paths", () => {
    expect(localizedPath("zh")).toBe("/zh/");
    expect(localizedPath("en", "characters/zero")).toBe("/en/characters/zero/");
    expect(localizedPath("tw", "/calculator/leveling/")).toBe("/tw/calculator/leveling/");
  });
});
