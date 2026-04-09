"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

interface SearchItem {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  url: string;
  tags: string[];
}

const TYPE_LABELS: Record<string, Record<string, string>> = {
  zh: {
    character: "角色",
    weapon: "武器",
    material: "材料",
    faq: "FAQ",
    guide: "攻略",
    lore: "世界观",
    location: "地点",
  },
  en: {
    character: "Character",
    weapon: "Weapon",
    material: "Material",
    faq: "FAQ",
    guide: "Guide",
    lore: "Lore",
    location: "Location",
  },
};

const TYPE_COLORS: Record<string, string> = {
  character: "text-yellow-400 bg-yellow-500/10",
  weapon: "text-blue-400 bg-blue-500/10",
  material: "text-green-400 bg-green-500/10",
  faq: "text-gray-400 bg-gray-500/10",
  guide: "text-purple-400 bg-purple-500/10",
  lore: "text-pink-400 bg-pink-500/10",
  location: "text-cyan-400 bg-cyan-500/10",
};

export function SearchDialog({ lang }: { lang: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [index, setIndex] = useState<Fuse<SearchItem> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data: SearchItem[]) => {
        const fuse = new Fuse(data, {
          keys: ["name", "nameEn", "tags"],
          threshold: 0.4,
          includeScore: true,
        });
        setIndex(fuse);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const doSearch = useCallback(
    (q: string) => {
      if (!index || !q.trim()) {
        setResults([]);
        return;
      }
      const fuseResults = index.search(q, { limit: 20 });
      setResults(fuseResults.map((r) => r.item));
      setSelectedIndex(0);
    },
    [index]
  );

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 150);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      const url = item.url.replace("{lang}", lang);
      router.push(url);
      setOpen(false);
      setQuery("");
    },
    [lang, router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    },
    [results, selectedIndex, handleSelect]
  );

  const grouped = results.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const typeOrder = ["character", "weapon", "guide", "lore", "location", "material", "faq"];
  const locale = lang === "zh" ? "zh" : "en";

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-gray-600 hover:text-gray-400 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">{locale === "zh" ? "搜索..." : "Search..."}</span>
        <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-500 border border-gray-600">
          {mounted && typeof navigator !== "undefined" && navigator.platform?.includes("Mac") ? "⌘" : "Ctrl+"}K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg mx-4 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-gray-800">
          <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={locale === "zh" ? "搜索角色、武器、攻略..." : "Search characters, weapons, guides..."}
            className="flex-1 bg-transparent py-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 border border-gray-700">
            ESC
          </kbd>
        </div>

        {results.length > 0 && (
          <div className="max-h-[50vh] overflow-y-auto py-2">
            {typeOrder.map((type) => {
              const items = grouped[type];
              if (!items) return null;
              return (
                <div key={type}>
                  <div className="px-4 py-1.5 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    {TYPE_LABELS[locale][type] || type}
                  </div>
                  {items.map((item) => {
                    const globalIdx = results.indexOf(item);
                    return (
                      <button
                        key={`${item.type}-${item.id}`}
                        onClick={() => handleSelect(item)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                          globalIdx === selectedIndex ? "bg-primary-500/10" : "hover:bg-gray-800/50"
                        }`}
                      >
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${TYPE_COLORS[item.type] || ""}`}>
                          {TYPE_LABELS[locale][item.type] || item.type}
                        </span>
                        <span className="text-sm text-gray-300 truncate flex-1">
                          {locale === "zh" ? item.name : item.nameEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            {locale === "zh" ? "没有找到结果" : "No results found"}
          </div>
        )}

        {!query && (
          <div className="py-6 text-center text-sm text-gray-600">
            {locale === "zh" ? "输入关键词开始搜索" : "Type to start searching"}
          </div>
        )}
      </div>
    </div>
  );
}
