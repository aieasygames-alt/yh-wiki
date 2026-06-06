"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Character } from "../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../lib/attributes";
import { t, isZhLocale, type Locale } from "../lib/i18n";
import { GameImage } from "./GameImage";

const TIERS = [
  { key: "SS", labelKey: "tierList.ssTier" },
  { key: "S+", labelKey: "tierList.sPlusTier" },
  { key: "A+", labelKey: "tierList.aPlusTier" },
  { key: "A", labelKey: "tierList.aTier" },
  { key: "B", labelKey: "tierList.bTier" },
];

const TIER_COLORS: Record<string, string> = {
  SS: "border-yellow-500/40 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent shadow-lg shadow-yellow-500/5",
  "S+": "border-purple-500/40 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-transparent shadow-lg shadow-purple-500/5",
  "A+": "border-blue-500/40 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent",
  A: "border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent",
  B: "border-gray-600/30 bg-gradient-to-r from-gray-500/10 via-slate-500/5 to-transparent",
};

const TIER_BADGE: Record<string, string> = {
  SS: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  "S+": "bg-purple-500/20 text-purple-300 border-purple-500/40",
  "A+": "bg-blue-500/20 text-blue-300 border-blue-500/40",
  A: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  B: "bg-gray-600/30 text-gray-300 border-gray-500/40",
};

export function TierListView({
  characters,
  locale,
  lang,
}: {
  characters: Character[];
  locale: Locale;
  lang: string;
}) {
  const isZh = isZhLocale(locale);
  const [filterAttr, setFilterAttr] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterScene, setFilterScene] = useState<string>("overall");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return characters.filter((c) => {
      if (filterAttr !== "all" && c.attribute !== filterAttr) return false;
      if (filterRole !== "all") {
        const role = isZh ? c.role : c.roleEn;
        if (filterRole === "dps" && !(role?.includes("进攻") || role?.includes("Attack") || role?.includes("DPS"))) return false;
        if (filterRole === "support" && !(role?.includes("支援") || role?.includes("Support"))) return false;
        if (filterRole === "defense" && !(role?.includes("防护") || role?.includes("Defense") || role?.includes("Survival"))) return false;
      }
      return true;
    });
  }, [characters, filterAttr, filterRole, isZh]);

  const tierGroups = useMemo(() => {
    const groups = new Map<string, Character[]>();
    for (const tier of TIERS) groups.set(tier.key, []);
    groups.set("N", []);
    for (const c of filtered) {
      let rank: string;
      if (filterScene === "overall" || !c.tierByScene) {
        rank = c.tierRank || "N";
      } else {
        rank = (c.tierByScene as Record<string, string>)[filterScene] || c.tierRank || "N";
      }
      if (!groups.has(rank)) groups.set(rank, []);
      groups.get(rank)!.push(c);
    }
    return groups;
  }, [filtered, filterScene]);

  const roleFilters = [
    { key: "all", label: t(locale, "common.all") },
    { key: "dps", label: isZh ? "进攻" : "DPS" },
    { key: "support", label: isZh ? "支援" : "Support" },
    { key: "defense", label: isZh ? "防护" : "Defense" },
  ];

  const sceneFilters = [
    { key: "overall", label: isZh ? "综合" : "Overall" },
    { key: "abyss", label: isZh ? "深渊" : "Abyss" },
    { key: "anomaly", label: isZh ? "异象" : "Anomaly" },
    { key: "general", label: isZh ? "大世界" : "Open World" },
  ];

  const attrs = ["all", "cosmos", "anima", "incantation", "chaos", "psyche", "lakshana"];

  return (
    <>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {/* Scene filter */}
        <span className="text-xs text-gray-500 mr-1">{isZh ? "场景:" : "Scene:"}</span>
        {sceneFilters.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilterScene(s.key)}
            className={`text-xs px-3 py-2 rounded-lg transition-colors min-h-[32px] ${
              filterScene === s.key
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-gray-800 text-gray-400 hover:text-gray-300 active:bg-gray-700"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {roleFilters.map((r) => (
          <button
            key={r.key}
            onClick={() => setFilterRole(r.key)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              filterRole === r.key
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-gray-800 text-gray-400 hover:text-gray-300"
            }`}
          >
            {r.label}
          </button>
        ))}
        <span className="text-gray-700">|</span>
        {attrs.map((attr) => (
          <button
            key={attr}
            onClick={() => setFilterAttr(attr)}
            className={`text-xs px-2 py-1.5 rounded-lg transition-colors ${
              filterAttr === attr
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-gray-800 text-gray-400 hover:text-gray-300"
            }`}
          >
            {attr === "all" ? t(locale, "common.all") : getAttributeLabel(attr, locale)}
          </button>
        ))}
      </div>

      {/* Tier Rows */}
      <div className="space-y-4">
        {TIERS.map((tier) => {
          const chars = tierGroups.get(tier.key) || [];
          if (chars.length === 0 && filterAttr === "all" && filterRole === "all") return null;
          return (
            <div
              key={tier.key}
              className={`rounded-xl border p-4 ${TIER_COLORS[tier.key] || ""}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-lg font-black px-3 py-1 rounded-lg border ${TIER_BADGE[tier.key] || ""}`}>
                  {tier.key}
                </span>
                <span className="text-sm text-gray-400">
                  {t(locale, tier.labelKey)}
                </span>
                <span className="text-xs text-gray-600 ml-auto">{chars.length}</span>
              </div>
              {chars.length === 0 ? (
                <p className="text-xs text-gray-600 italic">—</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {chars.map((c) => (
                    <TierCard
                      key={c.id}
                      character={c}
                      locale={locale}
                      lang={lang}
                      isZh={isZh}
                      isExpanded={expandedId === c.id}
                      onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function TierCard({
  character: c,
  locale,
  lang,
  isZh,
  isExpanded,
  onToggle,
}: {
  character: Character;
  locale: Locale;
  lang: string;
  isZh: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <Link
        href={`/${lang}/characters/${c.id}`}
        className="block rounded-lg border border-gray-800/50 bg-gray-900/40 p-2.5 hover:border-primary-500/30 hover:-translate-y-0.5 transition-all"
      >
        <GameImage
          type="character"
          id={c.id}
          name={c.name}
          className="w-full aspect-square rounded-lg mb-2"
        />
        <p className="text-xs font-medium truncate">
          {isZh ? c.name : c.nameEn}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getAttributeColor(c.attribute)}`}>
            {getAttributeLabel(c.attribute, locale)}
          </span>
          <span className={`text-[10px] font-bold ${c.rank === "S" ? "text-yellow-400" : "text-blue-400"}`}>
            {c.rank}
          </span>
        </div>
      </Link>

      {(c.tierReason || c.tierReasonZh) && (
        <button
          onClick={(e) => { e.preventDefault(); onToggle(); }}
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-gray-800/80 text-gray-400 hover:text-white text-[10px] flex items-center justify-center"
          title={isZh ? "查看评级理由" : "View reason"}
        >
          {isExpanded ? "×" : "?"}
        </button>
      )}

      {isExpanded && (c.tierReason || c.tierReasonZh) && (
        <div className="absolute z-10 left-0 right-0 top-full mt-1 p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-300 leading-relaxed shadow-xl">
          {isZh ? (c.tierReasonZh || c.tierReason) : c.tierReason}
        </div>
      )}
    </div>
  );
}
