"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllWeapons, getAllDiskSets } from "../../../lib/queries";
import { t, isZhLocale, Locale } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { getAttributeColor } from "../../../lib/attributes";

type EffectEntry = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  source: string;
  sourceEn: string;
  sourceType: "weapon" | "diskSet";
  sourceUrl: string;
  element?: string | null;
  extra?: string;
  extraEn?: string;
};

export default function EffectsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);

  const [filterSource, setFilterSource] = useState<"all" | "weapon" | "diskSet">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allEffects = useMemo(() => {
    const effects: EffectEntry[] = [];

    // Weapon effects
    const weapons = getAllWeapons();
    for (const w of weapons) {
      effects.push({
        id: w.id,
        name: isZh ? w.name : w.nameEn,
        nameEn: w.nameEn,
        description: w.effectDescription || "",
        descriptionEn: w.effectDescriptionEn || "",
        source: isZh ? w.name : w.nameEn,
        sourceEn: w.nameEn,
        sourceType: "weapon",
        sourceUrl: `/${lang}/weapons#${w.id}`,
        extra: `${w.rank}-Rank · ${w.type}`,
        extraEn: `${w.rank}-Rank · ${w.type}`,
      });
    }

    // Disk set effects
    const diskSets = getAllDiskSets();
    for (const ds of diskSets) {
      effects.push({
        id: `${ds.id}-2pc`,
        name: `${isZh ? ds.name : ds.nameEn} (2pc)`,
        nameEn: `${ds.nameEn} (2pc)`,
        description: ds.setDescription2pc || "",
        descriptionEn: ds.setDescription2pcEn || "",
        source: isZh ? ds.name : ds.nameEn,
        sourceEn: ds.nameEn,
        sourceType: "diskSet",
        sourceUrl: `/${lang}/disk-sets/${ds.id}`,
        element: ds.element,
        extra: ds.category === "elemental" ? (isZh ? "元素套" : "Elemental") : (isZh ? "通用套" : "General"),
        extraEn: ds.category,
      });
      effects.push({
        id: `${ds.id}-4pc`,
        name: `${isZh ? ds.name : ds.nameEn} (4pc)`,
        nameEn: `${ds.nameEn} (4pc)`,
        description: ds.setDescription4pc || "",
        descriptionEn: ds.setDescription4pcEn || "",
        source: isZh ? ds.name : ds.nameEn,
        sourceEn: ds.nameEn,
        sourceType: "diskSet",
        sourceUrl: `/${lang}/disk-sets/${ds.id}`,
        element: ds.element,
        extra: ds.category === "elemental" ? (isZh ? "元素套" : "Elemental") : (isZh ? "通用套" : "General"),
        extraEn: ds.category,
      });
    }

    return effects;
  }, [isZh, lang]);

  const filteredEffects = useMemo(() => {
    return allEffects.filter((e) => {
      if (filterSource !== "all" && e.sourceType !== filterSource) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          e.name.toLowerCase().includes(q) ||
          e.nameEn.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.descriptionEn.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allEffects, filterSource, searchQuery]);

  const weaponCount = allEffects.filter((e) => e.sourceType === "weapon").length;
  const diskSetCount = allEffects.filter((e) => e.sourceType === "diskSet").length;

  // Group by source
  const groupedEffects = useMemo(() => {
    const groups = new Map<string, { source: string; sourceEn: string; sourceUrl: string; sourceType: "weapon" | "diskSet"; element?: string | null; effects: EffectEntry[] }>();
    for (const e of filteredEffects) {
      const key = e.sourceEn;
      if (!groups.has(key)) {
        groups.set(key, { source: e.source, sourceEn: e.sourceEn, sourceUrl: e.sourceUrl, sourceType: e.sourceType, element: e.element, effects: [] });
      }
      groups.get(key)!.effects.push(e);
    }
    return Array.from(groups.values());
  }, [filteredEffects]);

  // Highlight matching text
  function HighlightText({ text, query }: { text: string; query: string }) {
    if (!query) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-primary-500/20 text-primary-300 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  }

  const elementDotColors: Record<string, string> = {
    cosmos: "bg-cosmos-500",
    anima: "bg-emerald-500",
    incantation: "bg-yellow-500",
    chaos: "bg-purple-500",
    psyche: "bg-blue-500",
    lakshana: "bg-pink-500",
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "effects.title") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {t(locale, "effects.title")}
        </h1>
        <p className="text-gray-400 mb-6">
          {t(locale, "effects.subtitle")}
        </p>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex gap-1">
            {[
              { key: "all", label: t(locale, "common.all"), count: allEffects.length },
              { key: "weapon", label: isZh ? "武器效果" : "Weapon Effects", count: weaponCount },
              { key: "diskSet", label: isZh ? "卡带套装" : "Disk Sets", count: diskSetCount },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterSource(f.key as "all" | "weapon" | "diskSet")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  filterSource === f.key
                    ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                    : "bg-gray-800 text-gray-400 hover:text-gray-300"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(locale, "effects.searchPlaceholder")}
            className="flex-1 min-w-[180px] bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500/50"
          />
        </div>

        {/* Effects List - Grouped by Source */}
        <div className="space-y-4">
          {groupedEffects.map((group) => (
            <details
              key={group.sourceEn}
              open={!searchQuery || group.effects.some((e) =>
                e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.description.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden"
            >
              <summary className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-800/30 transition-colors list-none">
                <svg className="w-4 h-4 text-gray-500 shrink-0 transition-transform details-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                <span
                  className={`shrink-0 text-[10px] px-2 py-1 rounded font-medium ${
                    group.sourceType === "weapon"
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  }`}
                >
                  {group.sourceType === "weapon"
                    ? (isZh ? "武器" : "Weapon")
                    : (isZh ? "卡带" : "Disk")}
                </span>
                {group.element && (
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${elementDotColors[group.element] || "bg-gray-500"}`} />
                )}
                <span className="text-sm font-semibold">
                  <HighlightText text={isZh ? group.source : group.sourceEn} query={searchQuery} />
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {group.effects.length} {isZh ? "个效果" : "effects"}
                </span>
              </summary>
              <div className="border-t border-gray-800/50">
                {group.effects.map((effect) => (
                  <div
                    key={effect.id}
                    className="px-4 py-3 border-b border-gray-800/30 last:border-b-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xs font-semibold">
                        <HighlightText text={isZh ? effect.name : effect.nameEn} query={searchQuery} />
                      </h4>
                      {effect.extra && (
                        <span className="text-[10px] text-gray-500 shrink-0">
                          {isZh ? effect.extra : effect.extraEn}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <HighlightText text={isZh ? effect.description : effect.descriptionEn} query={searchQuery} />
                    </p>
                    <Link
                      href={effect.sourceUrl}
                      className="text-[10px] text-primary-400 hover:text-primary-300 mt-1 inline-block"
                    >
                      {isZh ? `来源: ${effect.source}` : `Source: ${effect.sourceEn}`} →
                    </Link>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>

        {filteredEffects.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            {t(locale, "common.noResults")}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 text-center text-xs text-gray-600">
          {isZh
            ? `共 ${allEffects.length} 个效果（${weaponCount} 武器 + ${diskSetCount} 卡带套装）`
            : `${allEffects.length} effects total (${weaponCount} weapons + ${diskSetCount} disk set bonuses)`}
        </div>
      </div>
    </>
  );
}
