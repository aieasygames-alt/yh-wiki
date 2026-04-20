"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { t, isZhLocale, Locale } from "../../../lib/i18n";
import { trackEvent } from "../../../lib/analytics";
import { getAllCharacters } from "../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../lib/attributes";
import gachaConfig from "../../../data/gacha.json";
import { GameImage } from "../../../components/GameImage";

interface BannerConfig {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  rate5: number;
  rate4: number;
  rate3: number;
  pity5: number;
  softPityStart?: number;
  guaranteedFeatured?: boolean;
  featured: string[];
  featured4: string[];
  hasSelector?: boolean;
  selectorPool?: string[];
  maxPulls?: number;
  oneTimeOnly?: boolean;
  has5050?: boolean;
  avgPity?: number;
  pityCarryOver?: boolean;
  selectorAt?: number;
  pityFeatured?: number;
}

interface PullResult {
  characterId: string;
  rank: string;
  isNew: boolean;
  pullNumber: number;
}

interface PullStats {
  total: number;
  s5Count: number;
  s4Count: number;
  pityHistory: number[];
}

const gachaData = gachaConfig as Record<string, BannerConfig>;

export default function GachaPage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;

  const characters = getAllCharacters();
  const sRank = characters.filter((c) => c.rank === "S");
  const aRank = characters.filter((c) => c.rank === "A");

  const [activeBanner, setActiveBanner] = useState<string>("limited");
  const [results, setResults] = useState<PullResult[]>([]);
  const [pityCount, setPityCount] = useState(0);
  const [history, setHistory] = useState<PullResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const pullCountRef = useRef(0);

  const [stats, setStats] = useState<PullStats>({ total: 0, s5Count: 0, s4Count: 0, pityHistory: [] });

  const bannerConfig = useMemo(() => {
    return gachaData[activeBanner] || gachaData.limited;
  }, [activeBanner]);

  const pityRemaining = bannerConfig.pity5 - pityCount;
  const isPityWarning = pityRemaining <= 10;
  const isPityDanger = pityRemaining <= 5;

  const avgPity = useMemo(() => {
    if (stats.pityHistory.length === 0) return 0;
    return Math.round(stats.pityHistory.reduce((a, b) => a + b, 0) / stats.pityHistory.length);
  }, [stats.pityHistory]);

  const luckiestPity = useMemo(() => {
    if (stats.pityHistory.length === 0) return 0;
    return Math.min(...stats.pityHistory);
  }, [stats.pityHistory]);

  const unluckiestPity = useMemo(() => {
    if (stats.pityHistory.length === 0) return 0;
    return Math.max(...stats.pityHistory);
  }, [stats.pityHistory]);

  const s5Rate = useMemo(() => {
    if (stats.total === 0) return 0;
    return ((stats.s5Count / stats.total) * 100).toFixed(2);
  }, [stats.s5Count, stats.total]);

  const collectionProgress = useMemo(() => {
    const collected = new Set(history.filter((r) => r.rank === "S").map((r) => r.characterId));
    return { collected: collected.size, total: sRank.length, ids: collected };
  }, [history, sRank]);

  const pull = useCallback(
    (count: number): PullResult[] => {
      const pulls: PullResult[] = [];
      let currentPity = pityCount;

      for (let i = 0; i < count; i++) {
        currentPity++;
        pullCountRef.current++;
        let rate5 = bannerConfig.rate5;

        if (bannerConfig.softPityStart && currentPity >= bannerConfig.softPityStart) {
          const softPityBonus = (currentPity - bannerConfig.softPityStart + 1) * 6;
          rate5 = Math.min(100, bannerConfig.rate5 + softPityBonus);
        }

        if (currentPity >= bannerConfig.pity5) {
          rate5 = 100;
        }

        const roll = Math.random() * 100;

        if (roll < rate5) {
          const isFeatured = bannerConfig.featured.length > 0 && Math.random() < 0.5;
          const selected = isFeatured
            ? bannerConfig.featured[Math.floor(Math.random() * bannerConfig.featured.length)]
            : sRank[Math.floor(Math.random() * sRank.length)];

          pulls.push({ characterId: selected, rank: "S", isNew: true, pullNumber: pullCountRef.current });
          setStats((prev) => ({
            ...prev,
            s5Count: prev.s5Count + 1,
            pityHistory: [...prev.pityHistory, currentPity],
          }));
          currentPity = 0;
        } else if (roll < rate5 + bannerConfig.rate4) {
          const isFeatured4 = bannerConfig.featured4.length > 0 && Math.random() < 0.5;
          const selected = isFeatured4
            ? bannerConfig.featured4[Math.floor(Math.random() * bannerConfig.featured4.length)]
            : aRank[Math.floor(Math.random() * aRank.length)];

          pulls.push({ characterId: selected, rank: "A", isNew: false, pullNumber: pullCountRef.current });
          setStats((prev) => ({ ...prev, s4Count: prev.s4Count + 1 }));
        } else {
          const selected = aRank[Math.floor(Math.random() * aRank.length)];
          pulls.push({ characterId: selected, rank: "B", isNew: false, pullNumber: pullCountRef.current });
        }
      }

      setPityCount(currentPity);
      setStats((prev) => ({ ...prev, total: prev.total + count }));
      return pulls;
    },
    [pityCount, bannerConfig, sRank, aRank]
  );

  const handlePull = useCallback(
    (count: number) => {
      setIsAnimating(true);
      setTimeout(() => {
        const newResults = pull(count);
        setResults(newResults);
        setHistory((prev) => [...newResults, ...prev].slice(0, 300));
        setIsAnimating(false);
        trackEvent({ event: "simulate_gacha", label: count === 1 ? "single_pull" : "ten_pull" });
      }, 800);
    },
    [pull]
  );

  const handleReset = useCallback(() => {
    if (stats.total === 0) return;
    if (!confirm(isZhLocale(lang) ? "确定要清除所有抽卡记录吗？" : "Are you sure you want to clear all pull history?")) return;
    setHistory([]);
    setResults([]);
    setStats({ total: 0, s5Count: 0, s4Count: 0, pityHistory: [] });
    setPityCount(0);
    pullCountRef.current = 0;
  }, [stats.total, lang]);

  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(code);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const banners = [
    { key: "limited", name: isZhLocale(lang) ? gachaData.limited.name : gachaData.limited.nameEn },
    { key: "beginner", name: isZhLocale(lang) ? gachaData.beginner.name : gachaData.beginner.nameEn },
    { key: "standard", name: isZhLocale(lang) ? gachaData.standard.name : gachaData.standard.nameEn },
    { key: "weapons", name: isZhLocale(lang) ? gachaData.weapons.name : gachaData.weapons.nameEn },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{t(lang, "gacha.title")}</h1>
      <p className="text-sm text-gray-500 mb-8">{t(lang, "gacha.disclaimer")}</p>

      {/* Banner Select */}
      <div className="flex gap-2 mb-6">
        {banners.map((b) => (
          <button
            key={b.key}
            onClick={() => {
              setActiveBanner(b.key);
              setPityCount(0);
              setResults([]);
            }}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              activeBanner === b.key
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Banner Info */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 mb-6">
        <p className="text-sm text-gray-400">
          {isZhLocale(lang) ? bannerConfig.description : bannerConfig.descriptionEn}
        </p>
        {bannerConfig.featured.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-yellow-400">UP:</span>
            {bannerConfig.featured.map((cId) => {
              const char = characters.find((c) => c.id === cId);
              return char ? (
                <span key={cId} className="text-xs text-yellow-300">
                  {char.name} ({char.nameEn})
                </span>
              ) : null;
            })}
          </div>
        )}
        <p className="text-xs text-gray-600 mt-2">
          {isZhLocale(lang)
            ? `五星基础概率 ${bannerConfig.rate5}%${bannerConfig.softPityStart ? ` | ${bannerConfig.softPityStart} 抽开始软保底` : ""} | ${bannerConfig.pity5} 抽硬保底`
            : `Base 5★ rate ${bannerConfig.rate5}%${bannerConfig.softPityStart ? ` | Soft pity at ${bannerConfig.softPityStart}` : ""} | Hard pity at ${bannerConfig.pity5}`}
        </p>
      </div>

      {/* Pull Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handlePull(1)}
          disabled={isAnimating}
          className="flex-1 py-3 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-400 font-medium hover:bg-primary-500/30 transition-colors disabled:opacity-50"
        >
          {t(lang, "gacha.pull1")}
        </button>
        <button
          onClick={() => handlePull(10)}
          disabled={isAnimating}
          className="flex-1 py-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-medium hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
        >
          {t(lang, "gacha.pull10")}
        </button>
      </div>

      {/* Pity Counter */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={`rounded-lg border p-3 text-center transition-colors ${
          isPityDanger ? "border-red-500/50 bg-red-500/10" : isPityWarning ? "border-orange-500/50 bg-orange-500/10" : "border-gray-800 bg-gray-900/50"
        }`}>
          <p className="text-xs text-gray-500">{t(lang, "gacha.pity")}</p>
          <p className={`text-lg font-bold ${isPityDanger ? "text-red-400" : isPityWarning ? "text-orange-400" : "text-primary-400"}`}>
            {pityCount}/{bannerConfig.pity5}
          </p>
          {isPityWarning && (
            <p className={`text-[10px] ${isPityDanger ? "text-red-400" : "text-orange-400"}`}>
              {t(lang, "gacha.pityWarning", String(pityRemaining))}
            </p>
          )}
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-center">
          <p className="text-xs text-gray-500">{t(lang, "gacha.totalPulls")}</p>
          <p className="text-lg font-bold text-gray-300">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-center">
          <p className="text-xs text-gray-500">{t(lang, "gacha.sRankCount")}</p>
          <p className="text-lg font-bold text-yellow-400">{stats.s5Count}</p>
        </div>
      </div>

      {/* Animation */}
      {isAnimating && (
        <div className="text-center py-16">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
            <div className="absolute inset-2 border-2 border-yellow-400/30 border-b-yellow-400 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
          </div>
          <p className="text-gray-400 mt-4">{t(lang, "gacha.pulling")}</p>
        </div>
      )}

      {/* Results with Animation */}
      {!isAnimating && results.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">{t(lang, "gacha.results")}</h2>
          <div className={`grid gap-3 ${results.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-2 sm:grid-cols-5"}`}>
            {results.map((result, i) => {
              const char = characters.find((c) => c.id === result.characterId);
              if (!char) return null;
              const isS = result.rank === "S";
              return (
                <div
                  key={`${result.characterId}-${i}`}
                  className={`rounded-xl border p-3 text-center ${
                    isS
                      ? "bg-yellow-500/10 border-yellow-500/30 shadow-lg shadow-yellow-500/10"
                      : result.rank === "A"
                      ? "bg-purple-500/5 border-purple-500/20"
                      : "bg-gray-900/50 border-gray-800"
                  }`}
                  style={{ animation: "fadeInUp 0.3s ease-out", animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}
                >
                  <div className={`w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden ${isS ? "ring-2 ring-yellow-400/50" : ""}`}>
                    <GameImage type="character" id={char.id} name={char.name} />
                  </div>
                  <p className="text-xs font-medium truncate">{char.name}</p>
                  <p className="text-xs text-gray-500">{char.nameEn}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        isS
                          ? "text-yellow-400 bg-yellow-500/20"
                          : result.rank === "A"
                          ? "text-purple-400 bg-purple-500/20"
                          : "text-gray-500 bg-gray-700/50"
                      }`}
                    >
                      {result.rank}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${getAttributeColor(char.attribute)}`}>
                      {getAttributeLabel(char.attribute, lang)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <style jsx>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      {/* Stats Toggle + Collection + History */}
      {stats.total > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  showStats ? "bg-primary-500/20 text-primary-400 border border-primary-500/30" : "bg-gray-800 text-gray-400 border border-gray-700"
                }`}
              >
                {t(lang, "gacha.stats")} {showStats ? "▲" : "▼"}
              </button>
            </div>
            <button onClick={handleReset} className="text-xs text-gray-500 hover:text-red-400 transition-colors">
              {t(lang, "gacha.clearHistory")}
            </button>
          </div>

          {/* Stats Panel */}
          {showStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-in">
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <p className="text-xs text-gray-500">{t(lang, "gacha.avgPity")}</p>
                <p className="text-lg font-bold text-primary-400">{avgPity || "-"}</p>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <p className="text-xs text-gray-500">{t(lang, "gacha.luckiest")}</p>
                <p className="text-lg font-bold text-green-400">{luckiestPity || "-"}</p>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <p className="text-xs text-gray-500">{t(lang, "gacha.unluckiest")}</p>
                <p className="text-lg font-bold text-red-400">{unluckiestPity || "-"}</p>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <p className="text-xs text-gray-500">{t(lang, "gacha.s5Rate")}</p>
                <p className="text-lg font-bold text-yellow-400">{s5Rate}%</p>
              </div>

              {/* Collection Progress */}
              <div className="col-span-2 sm:col-span-4 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <p className="text-xs text-gray-500 mb-2">
                  {t(lang, "gacha.collection")} ({collectionProgress.collected}/{collectionProgress.total})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sRank.map((c) => {
                    const owned = collectionProgress.ids.has(c.id);
                    return (
                      <div
                        key={c.id}
                        className={`w-8 h-8 rounded border flex items-center justify-center text-[10px] font-bold ${
                          owned ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" : "bg-gray-800 border-gray-700 text-gray-600"
                        }`}
                        title={`${c.name} (${owned ? "✓" : "✗"})`}
                      >
                        {c.name[0]}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* History */}
          <div>
            <h2 className="text-lg font-bold mb-3">{t(lang, "gacha.history")}</h2>
            <div className="flex flex-wrap gap-1.5">
              {history.slice(0, 100).map((result, i) => {
                const char = characters.find((c) => c.id === result.characterId);
                if (!char) return null;
                return (
                  <div
                    key={`history-${i}`}
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center text-xs font-bold transition-all ${
                      result.rank === "S"
                        ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
                        : result.rank === "A"
                        ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                        : "bg-gray-800 border-gray-700 text-gray-600"
                    }`}
                    title={`${char.name} (${result.rank}) #${result.pullNumber}`}
                  >
                    {char.name[0]}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isAnimating && results.length === 0 && stats.total === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p>{t(lang, "gacha.hint")}</p>
        </div>
      )}

      {/* Hidden: copyCode function for potential future use */}
      {copiedId && <span className="hidden" />}
    </div>
  );
}
