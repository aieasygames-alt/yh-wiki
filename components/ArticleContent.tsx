interface ArticleContentProps {
  content: string;
}

/**
 * Parse markdown-like content and render with modern blog style.
 * Supports: ## h2, ### h3, numbered lists, bullet lists, bold text, tip boxes.
 */
export function ArticleContent({ content }: ArticleContentProps) {
  const blocks = parseContent(content);

  return (
    <div className="article-content">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <div key={i} className="mt-10 mb-5 first:mt-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-primary-500/60 to-transparent" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white whitespace-nowrap">
                    {block.text}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-l from-primary-500/60 to-transparent" />
                </div>
              </div>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="text-lg font-semibold text-primary-300 mt-7 mb-3 flex items-center gap-2"
              >
                <span className="inline-block w-1.5 h-5 rounded-full bg-primary-500" />
                {block.text}
              </h3>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-2.5 my-4 ml-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-gray-300 leading-relaxed">
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary-600/20 text-primary-400 text-xs font-bold flex items-center justify-center mt-0.5">
                      {j + 1}
                    </span>
                    <span className="flex-1">{renderInlineFormatting(item)}</span>
                  </li>
                ))}
              </ol>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-2 my-4 ml-1">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2.5 text-gray-300 leading-relaxed"
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-400 mt-2.5" />
                    <span className="flex-1">{renderInlineFormatting(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "tip":
            return (
              <div
                key={i}
                className="my-5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-amber-400 text-lg leading-none mt-0.5">&#9733;</span>
                  <p className="text-amber-200/90 text-sm leading-relaxed flex-1">
                    {block.text}
                  </p>
                </div>
              </div>
            );
          case "warning":
            return (
              <div
                key={i}
                className="my-5 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg leading-none mt-0.5">&#9888;</span>
                  <p className="text-red-200/90 text-sm leading-relaxed flex-1">
                    {block.text}
                  </p>
                </div>
              </div>
            );
          case "empty":
            return <div key={i} className="h-2" />;
          case "paragraph":
          default:
            return (
              <p
                key={i}
                className="text-gray-300 leading-relaxed mb-4 text-[15px]"
              >
                {renderInlineFormatting(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}

/** Render inline bold (**text**) as styled spans */
function renderInlineFormatting(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
}

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ol"; items: string[] }
  | { type: "ul"; items: string[] }
  | { type: "tip"; text: string }
  | { type: "warning"; text: string }
  | { type: "empty" };

function parseContent(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      blocks.push({ type: "empty" });
      i++;
      continue;
    }

    // ## H2 heading
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
      i++;
      continue;
    }

    // ### H3 heading
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() });
      i++;
      continue;
    }

    // Numbered list (1. 2. etc.)
    if (/^\d+[.、．]\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.、．]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.、．]\s/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Bullet list (- or •)
    if (/^[-•]\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-•]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Tip box (lines starting with 💡 or ※ or > tip:)
    if (
      trimmed.startsWith("💡") ||
      trimmed.startsWith("※") ||
      /^>\s*(tip|提示|小贴士|注意)[：:]/i.test(trimmed)
    ) {
      const tipText = trimmed
        .replace(/^[💡※]\s*/, "")
        .replace(/^>\s*(tip|提示|小贴士|注意)[：:]\s*/i, "");
      blocks.push({ type: "tip", text: tipText });
      i++;
      continue;
    }

    // Warning box (lines starting with ⚠ or > warning:)
    if (
      trimmed.startsWith("⚠") ||
      /^>\s*(warning|警告|注意|危险)[：:]/i.test(trimmed)
    ) {
      const warnText = trimmed
        .replace(/^⚠\s*/, "")
        .replace(/^>\s*(warning|警告|注意|危险)[：:]\s*/i, "");
      blocks.push({ type: "warning", text: warnText });
      i++;
      continue;
    }

    // Regular paragraph
    blocks.push({ type: "paragraph", text: trimmed });
    i++;
  }

  return blocks;
}
