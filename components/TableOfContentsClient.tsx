"use client";

import { useState } from "react";

interface TocItem {
  text: string;
  id: string;
}

export function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [open, setOpen] = useState(false);
  if (headings.length < 3) return null;

  return (
    <div className="md:hidden mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 text-sm text-gray-400 hover:border-gray-600 transition-colors"
      >
        <span className="font-medium">目录</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <nav className="mt-2 px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50">
          <ul className="space-y-2">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export function TableOfContentsDesktop({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (headings.length < 3) return null;

  const handleClick = (id: string) => {
    setActiveId(id);
  };

  return (
    <nav className="hidden md:block fixed right-[max(1rem,calc((100vw-56rem)/2))] top-24 w-52 max-h-[70vh] overflow-y-auto">
      <div className="px-3 py-4 rounded-xl border border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">目录</p>
        <ul className="space-y-1.5">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={() => handleClick(h.id)}
                className={`block text-xs leading-relaxed transition-colors truncate ${
                  activeId === h.id
                    ? "text-primary-400 font-medium"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
