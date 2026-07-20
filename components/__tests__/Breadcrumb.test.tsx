import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Breadcrumb } from "../Breadcrumb";

// Mock JsonLd component
vi.mock("../JsonLd", () => ({
  BreadcrumbJsonLd: ({ items }: { items: { name: string; url?: string }[] }) => (
    <script data-testid="breadcrumb-jsonld" type="application/ld+json">
      {JSON.stringify(items)}
    </script>
  ),
}));

describe("Breadcrumb", () => {
  it("renders breadcrumb items with links", () => {
    render(
      <Breadcrumb
        items={[
          { label: "首页", href: "/zh" },
          { label: "角色", href: "/zh/characters" },
          { label: "测试角色" },
        ]}
      />
    );
    expect(screen.getByText("首页")).toBeInTheDocument();
    expect(screen.getByText("角色")).toBeInTheDocument();
    expect(screen.getByText("测试角色")).toBeInTheDocument();
  });

  it("renders separator between items", () => {
    render(
      <Breadcrumb
        items={[
          { label: "首页", href: "/zh" },
          { label: "角色" },
        ]}
      />
    );
    const separators = screen.getAllByText("/");
    expect(separators.length).toBe(1);
  });

  it("renders clickable links for items with href", () => {
    render(
      <Breadcrumb
        items={[
          { label: "首页", href: "/zh" },
          { label: "当前页" },
        ]}
      />
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/zh");
  });

  it("renders last item as plain text (no link)", () => {
    render(
      <Breadcrumb
        items={[
          { label: "首页", href: "/zh" },
          { label: "当前页" },
        ]}
      />
    );
    const lastItem = screen.getByText("当前页");
    expect(lastItem.tagName).not.toBe("A");
  });

  it("renders BreadcrumbJsonLd with correct data", () => {
    render(
      <Breadcrumb
        items={[
          { label: "首页", href: "/zh" },
          { label: "当前页" },
        ]}
      />
    );
    const script = screen.getByTestId("breadcrumb-jsonld");
    const data = JSON.parse(script.textContent || "[]");
    expect(data).toEqual([
      { name: "首页", url: "https://nteguide.com/zh/" },
      { name: "当前页" },
    ]);
  });
});
