interface TocItem {
  text: string;
  id: string;
}

export function extractHeadings(content: string): TocItem[] {
  const headings: TocItem[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^## (.+)/);
    if (match) {
      const text = match[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, "-").replace(/^-|-$/g, "");
      headings.push({ text, id });
    }
  }
  return headings;
}

export { TableOfContents, TableOfContentsDesktop } from "./TableOfContentsClient";
