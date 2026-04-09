"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { t, type Locale } from "../../../lib/i18n";
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
  softPityStart: number;
  guaranteedFeatured: boolean;
  featured: string[];
  featured4: string[];
}

interface PullResult {
  characterId: string;
  rank: string;
  isNew: boolean;
}

const gachaData = gachaConfig as { banner: BannerConfig; standard: BannerConfig; weapons: BannerConfig };

export default function GachaPage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;

  const characters = getAllCharacters();
  const sRank = characters.filter((c) => c.rank === "S");
  const aRank = characters.filter((c) => c.rank === "A");

  const [activeBanner, setActiveBanner] = useState<string>("banner");
  const [results, setResults] = useState<PullResult[]>([]);
  const [pityCount, setPityCount] = useState(0);
  const [history, setHistory] = useState<PullResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stats, setStats] = useState({ total: 0, s5Count: 0, s4Count: 0, lastS5: 0 });

  const bannerConfig = useMemo(() => {
    return gachaData[activeBanner as keyof typeof gachaData] || gachaData.banner;
  }, [activeBanner]);

  const pull = useCallback(
    (count: number): PullResult[] => {
      const pulls: PullResult[] = [];
      let currentPity = pityCount;

      for (let i = 0; i < count; i++) {
        currentPity++;
        let rate5 = bannerConfig.rate5;

        // Soft pity
        if (currentPity >= bannerConfig.softPityStart) {
          const softPityBonus = (currentPity - bannerConfig.softPityStart + 1) * 6;
          rate5 = Math.min(100, bannerConfig.rate5 + softPityBonus);
        }

        // Hard pity
        if (currentPity >= bannerConfig.pity5) {
          rate5 = 100;
        }

        const roll = Math.random() * 100;

        if (roll < rate5) {
          // 5-star (S-rank)
          const isFeatured =
            bannerConfig.featured.length > 0 && Math.random() < 0.5;
          const selected = isFeatured
            ? bannerConfig.featured[Math.floor(Math.random() * bannerConfig.featured.length)]
            : sRank[Math.floor(Math.random() * sRank.length)];

          pulls.push({ characterId: selected, rank: "S", isNew: true });
          currentPity = 0;

          setStats((prev) => ({
            total: prev.total + i + 1 - prev.s5Count - prev.s4Count,
            s5Count: prev.s5Count + 1,
            s4Count: prev.s4Count,
            lastS5: currentPity === 0 ? i + 1 : prev.lastS5,
          }));
        } else if (roll < rate5 + bannerConfig.rate4) {
          // 4-star (A-rank)
          const isFeatured4 =
            bannerConfig.featured4.length > 0 && Math.random() < 0.5;
          const selected = isFeatured4
            ? bannerConfig.featured4[Math.floor(Math.random() * bannerConfig.featured4.length)]
            : aRank[Math.floor(Math.random() * aRank.length)];

          pulls.push({ characterId: selected, rank: "A", isNew: false });
          setStats((prev) => ({ ...prev, s4Count: prev.s4Count + 1 }));
        } else {
          // 3-star (A-rank filler)
          const selected = aRank[Math.floor(Math.random() * aRank.length)];
          pulls.push({ characterId: selected, rank: "A", isNew: false });
        }
      }

      setPityCount(currentPity);
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
        setHistory((prev) => [...newResults, ...prev].slice(0, 100));
        setStats((prev) => ({ ...prev, total: prev.total + count }));
        setIsAnimating(false);
      }, 600);
    },
    [pull]
  );

  const banners = [
    { key: "banner", name: lang === "zh" ? gachaData.banner.name : gachaData.banner.nameEn },
    { key: "standard", name: lang === "zh" ? gachaData.standard.name : gachaData.standard.nameEn },
    { key: "weapons", name: lang === "zh" ? gachaData.weapons.name : gachaData.weapons.nameEn },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t(lang, "gacha.title")}</h1>

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
          {lang === "zh" ? bannerConfig.description : bannerConfig.descriptionEn}
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
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-center">
          <p className="text-xs text-gray-500">{t(lang, "gacha.pity")}</p>
          <p className="text-lg font-bold text-primary-400">{pityCount}/{bannerConfig.pity5}</p>
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

      {/* Results */}
      {isAnimating && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 mt-3">{t(lang, "gacha.pulling")}</p>
        </div>
      )}

      {!isAnimating && results.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">{t(lang, "gacha.results")}</h2>
          <div className={`grid gap-3 ${results.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-2 sm:grid-cols-5"}`}>
            {results.map((result, i) => {
              const char = characters.find((c) => c.id === result.characterId);
              if (!char) return null;
              return (
                <div
                  key={`${result.characterId}-${i}`}
                  className={`rounded-xl border p-3 text-center transition-all ${
                    result.rank === "S"
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : "bg-gray-900/50 border-gray-800"
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden">
                    <GameImage type="character" id={char.id} name={char.name} />
                  </div>
                  <p className="text-xs font-medium truncate">{char.name}</p>
                  <p className="text-xs text-gray-500">{char.nameEn}</p>
                  <span
                    className={`inline-block text-xs mt-1 px-1.5 py-0.5 rounded ${
                      result.rank === "S"
                        ? "text-yellow-400 bg-yellow-500/20"
                        : "text-purple-400 bg-purple-500/20"
                    }`}
                  >
                    {result.rank === "S" ? "S" : "A"}
                  </span>
                  <div className="mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${getAttributeColor(char.attribute)}`}>
                      {getAttributeLabel(char.attribute, lang)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">{t(lang, "gacha.history")}</h2>
            <button
              onClick={() => {
                setHistory([]);
                setStats({ total: 0, s5Count: 0, s4Count: 0, lastS5: 0 });
                setPityCount(0);
              }}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              {t(lang, "gacha.clearHistory")}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.slice(0, 50).map((result, i) => {
              const char = characters.find((c) => c.id === result.characterId);
              if (!char) return null;
              return (
                <div
                  key={`history-${i}`}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center text-xs font-bold ${
                    result.rank === "S"
                      ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
                      : "bg-gray-800 border-gray-700 text-gray-500"
                  }`}
                  title={`${char.name} (${result.rank})`}
                >
                  {char.name[0]}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isAnimating && results.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p>{t(lang, "gacha.hint")}</p>
        </div>
      )}
    </div>
  );
}
