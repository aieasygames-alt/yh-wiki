"use client";

import { useState, useMemo, useCallback, useRef, Fragment } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { t, isZhLocale, Locale } from "../../../lib/i18n";
import { getAllCharacters, getAllWeapons } from "../../../lib/queries";
import { GameImage } from "../../../components/GameImage";
import {
  loadData,
  addPull,
  removePull,
  clearData,
  exportJSON,
  importJSON,
  type GachaAnalyzerData,
  type PullRecord,
} from "../../../lib/gacha-analyzer-storage";
import gachaConfig from "../../../data/gacha.json";

interface BannerConf {
  id: string;
  name: string;
  nameEn: string;
  pity5: number;
}

const gachaData = gachaConfig as unknown as Record<string, BannerConf | { faq: unknown[] }>;
const banners: { key: string; label: string; pity5: number }[] = [
  { key: "limited", label: "", pity5: 90 },
  { key: "beginner", label: "", pity5: 20 },
  { key: "standard", label: "", pity5: 90 },
  { key: "weapons", label: "", pity5: 60 },
];

function getBannerConf(key: string): BannerConf | null {
  const entry = gachaData[key];
  if (!entry || !("pity5" in entry)) return null;
  return entry as BannerConf;
}

type TabKey = "log" | "stats" | "history" | "data";

export default function GachaAnalyzerPage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;
  const zh = isZhLocale(lang);

  const characters = getAllCharacters();
  const weapons = getAllWeapons();
  const allItems = useMemo(
    () => [
      ...characters.map((c) => ({ id: c.id, name: c.name, nameEn: c.nameEn, rank: c.rank, type: "character" as const, image: c.image })),
      ...weapons.map((w) => ({ id: w.id, name: w.name, nameEn: w.nameEn, rank: w.rank, type: "weapon" as const, image: w.image })),
    ],
    [characters, weapons]
  );

  const bannerOptions = useMemo(
    () =>
      banners.map((b) => {
        const conf = getBannerConf(b.key);
        return {
          key: b.key,
          label: conf ? (zh ? conf.name : conf.nameEn) : b.key,
          pity5: conf?.pity5 ?? b.pity5,
        };
      }),
    [zh]
  );

  const [data, setData] = useState<GachaAnalyzerData>(loadData);
  const [activeTab, setActiveTab] = useState<TabKey>("log");
  const [selectedBanner, setSelectedBanner] = useState("limited");
  const [selectedItem, setSelectedItem] = useState("");
  const [pullNumber, setPullNumber] = useState("");
  const [quickLogText, setQuickLogText] = useState("");
  const [toast, setToast] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ga = "gachaAnalyzer";

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }, []);

  // --- Tab 1: Log Pulls ---
  const handleAddPull = useCallback(() => {
    if (!selectedItem) return;
    const item = allItems.find((i) => i.id === selectedItem);
    if (!item) return;
    const rank = (item.rank === "S" || item.rank === "5" ? "S" : item.rank === "A" || item.rank === "4" ? "A" : "B") as "S" | "A" | "B";
    const pn = parseInt(pullNumber, 10) || 0;
    const newData = addPull({
      banner: selectedBanner,
      characterId: selectedItem,
      rank,
      pullNumber: pn,
    });
    setData({ ...newData });
    setSelectedItem("");
    setPullNumber("");
    showToast(zh ? "已添加记录" : "Record added");
  }, [selectedItem, selectedBanner, pullNumber, allItems, zh, showToast]);

  const handleQuickLog = useCallback(() => {
    if (!quickLogText.trim() || !selectedBanner) return;
    const entries = quickLogText.split(/[,，\s]+/).map((s) => s.trim().toUpperCase()).filter(Boolean);
    for (const entry of entries) {
      const rank = entry === "S" || entry === "5" ? "S" : entry === "A" || entry === "4" ? "A" : "B";
      // Pick a random item of matching rank
      const matching = allItems.filter((i) => {
        if (rank === "S") return i.rank === "S" || i.rank === "5";
        if (rank === "A") return i.rank === "A" || i.rank === "4";
        return true;
      });
      const item = matching[Math.floor(Math.random() * matching.length)] || allItems[0];
      if (item) {
        const newData = addPull({
          banner: selectedBanner,
          characterId: item.id,
          rank,
          pullNumber: 0,
        });
        setData({ ...newData });
      }
    }
    setQuickLogText("");
    showToast(zh ? `已导入 ${entries.length} 条` : `${entries.length} records imported`);
  }, [quickLogText, selectedBanner, allItems, zh, showToast]);

  // --- Tab 3: Delete ---
  const handleDelete = useCallback(
    (pullId: string) => {
      if (!confirm(t(lang, `${ga}.confirmDelete`))) return;
      const newData = removePull(pullId);
      setData({ ...newData });
    },
    [lang]
  );

  // --- Tab 4: Data Management ---
  const handleExport = useCallback(() => {
    const json = exportJSON(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nte-gacha-analyzer-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t(lang, `${ga}.exportSuccess`));
  }, [data, lang, showToast]);

  const handleImport = useCallback(
    (replace: boolean) => {
      const input = fileInputRef.current;
      if (!input?.files?.length) return;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (!replace) {
          // Merge: load existing first
          const existing = loadData();
          try {
            const incoming = JSON.parse(text);
            if (!incoming.pulls) throw new Error("bad");
            const merged = {
              ...existing,
              pulls: [...existing.pulls, ...incoming.pulls],
            };
            const { data: newData, error } = importJSON(JSON.stringify(merged));
            if (error) {
              showToast(t(lang, `${ga}.importError`));
            } else {
              setData({ ...newData });
              showToast(t(lang, `${ga}.importSuccess`));
            }
          } catch {
            showToast(t(lang, `${ga}.importError`));
          }
        } else {
          const { data: newData, error } = importJSON(text);
          if (error) {
            showToast(t(lang, `${ga}.importError`));
          } else {
            setData({ ...newData });
            showToast(t(lang, `${ga}.importSuccess`));
          }
        }
        input.value = "";
      };
      reader.readAsText(file);
    },
    [lang, showToast]
  );

  const handleClear = useCallback(() => {
    if (!confirm(t(lang, `${ga}.confirmClear`))) return;
    const newData = clearData();
    setData({ ...newData });
    showToast(zh ? "已清空" : "Data cleared");
  }, [lang, zh, showToast]);

  // --- Stats calculations ---
  const stats = useMemo(() => {
    const pulls = data.pulls;
    const total = pulls.length;
    const sPulls = pulls.filter((p) => p.rank === "S");
    const sCount = sPulls.length;
    const sRate = total > 0 ? ((sCount / total) * 100) : 0;

    // Calculate pity intervals (between consecutive S-rank pulls per banner)
    const pityIntervals: number[] = [];
    const bannerPulls: Record<string, PullRecord[]> = {};
    for (const p of pulls) {
      if (!bannerPulls[p.banner]) bannerPulls[p.banner] = [];
      bannerPulls[p.banner].push(p);
    }
    for (const bp of Object.values(bannerPulls)) {
      bp.sort((a, b) => a.timestamp - b.timestamp);
      let count = 0;
      for (const p of bp) {
        count++;
        if (p.rank === "S") {
          pityIntervals.push(count);
          count = 0;
        }
      }
    }

    const avgPity = pityIntervals.length > 0
      ? Math.round(pityIntervals.reduce((a, b) => a + b, 0) / pityIntervals.length)
      : 0;

    // Luck index: compare actual S rate to expected (0.6%)
    const expectedRate = 0.6;
    const luckIndex = sRate > 0 ? Math.round((sRate / expectedRate) * 100) : 0;

    return { total, sCount, sRate, avgPity, pityIntervals, luckIndex };
  }, [data]);

  const luckLabel = useMemo(() => {
    const idx = stats.luckIndex;
    if (idx >= 200) return t(lang, `${ga}.luckGreat`);
    if (idx >= 130) return t(lang, `${ga}.luckGood`);
    if (idx >= 80) return t(lang, `${ga}.luckNormal`);
    if (idx >= 40) return t(lang, `${ga}.luckBad`);
    if (idx > 0) return t(lang, `${ga}.luckTerrible`);
    return "-";
  }, [stats.luckIndex, lang]);

  const luckColor = useMemo(() => {
    const idx = stats.luckIndex;
    if (idx >= 200) return "text-green-400";
    if (idx >= 130) return "text-blue-400";
    if (idx >= 80) return "text-gray-300";
    if (idx >= 40) return "text-orange-400";
    if (idx > 0) return "text-red-400";
    return "text-gray-500";
  }, [stats.luckIndex]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "log", label: t(lang, `${ga}.tabLog`) },
    { key: "stats", label: t(lang, `${ga}.tabStats`) },
    { key: "history", label: t(lang, `${ga}.tabHistory`) },
    { key: "data", label: t(lang, `${ga}.tabData`) },
  ];

  const bannerLabelMap: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    for (const b of bannerOptions) {
      map[b.key] = b.label;
    }
    return map;
  }, [bannerOptions]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{t(lang, `${ga}.title`)}</h1>
      <p className="text-sm text-gray-500 mb-6">{t(lang, `${ga}.subtitle`)}</p>

      {/* Pity Progress Cards (always visible) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {bannerOptions.map((b) => {
          const state = data.banners[b.key];
          const pity = state?.pityCount ?? 0;
          const pct = Math.min(100, Math.round((pity / b.pity5) * 100));
          const isDanger = pct >= 80;
          const isWarn = pct >= 60;
          return (
            <div
              key={b.key}
              className={`rounded-lg border p-3 transition-colors ${
                isDanger ? "border-red-500/50 bg-red-500/10" : isWarn ? "border-orange-500/30 bg-orange-500/5" : "border-gray-800 bg-gray-900/50"
              }`}
            >
              <p className="text-xs text-gray-400 truncate">{b.label}</p>
              <p className={`text-lg font-bold ${isDanger ? "text-red-400" : isWarn ? "text-orange-400" : "text-primary-400"}`}>
                {pity}/{b.pity5}
              </p>
              <div className="w-full h-1.5 bg-gray-800 rounded mt-1.5">
                <div
                  className={`h-full rounded transition-all ${isDanger ? "bg-red-500" : isWarn ? "bg-orange-500" : "bg-primary-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "text-primary-400 border-primary-400 font-medium"
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Log Pulls */}
      {activeTab === "log" && (
        <div className="space-y-6">
          {/* Quick add form */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-4">{t(lang, `${ga}.addPull`)}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t(lang, `${ga}.bannerLabel`)}</label>
                <select
                  value={selectedBanner}
                  onChange={(e) => setSelectedBanner(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300"
                >
                  {bannerOptions.map((b) => (
                    <option key={b.key} value={b.key}>{b.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t(lang, `${ga}.charLabel`)}</label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300"
                >
                  <option value="">--</option>
                  <optgroup label={zh ? "S 级角色" : "S-Rank"}>
                    {characters.filter((c) => c.rank === "S").map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.nameEn})</option>
                    ))}
                  </optgroup>
                  <optgroup label={zh ? "A 级角色" : "A-Rank"}>
                    {characters.filter((c) => c.rank === "A").map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.nameEn})</option>
                    ))}
                  </optgroup>
                  {weapons.length > 0 && (
                    <optgroup label={zh ? "武器" : "Weapons"}>
                      {weapons.slice(0, 20).map((w) => (
                        <option key={w.id} value={w.id}>{w.name} ({w.nameEn}) ★{w.rarity}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">{t(lang, `${ga}.pullNumberLabel`)}</label>
              <input
                type="number"
                min="0"
                max="200"
                value={pullNumber}
                onChange={(e) => setPullNumber(e.target.value)}
                placeholder={t(lang, `${ga}.pullNumberHint`)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300"
              />
            </div>
            <button
              onClick={handleAddPull}
              disabled={!selectedItem}
              className="w-full py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t(lang, `${ga}.addPull`)}
            </button>
          </div>

          {/* Quick log */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-1">{t(lang, `${ga}.quickLog`)}</h3>
            <p className="text-xs text-gray-500 mb-3">{t(lang, `${ga}.quickLogHint`)}</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={quickLogText}
                onChange={(e) => setQuickLogText(e.target.value)}
                placeholder={t(lang, `${ga}.quickLogPlaceholder`)}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300"
              />
              <button
                onClick={handleQuickLog}
                disabled={!quickLogText.trim()}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 transition-colors disabled:opacity-40"
              >
                {t(lang, `${ga}.importQuickLog`)}
              </button>
            </div>
          </div>

          {/* Link to simulator */}
          <div className="text-center">
            <Link
              href={`/${lang}/gacha`}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              {t(lang, `${ga}.goSimulator`)}
            </Link>
          </div>
        </div>
      )}

      {/* Tab: Statistics */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold">{t(lang, `${ga}.statsTitle`)}</h2>

          {/* Overview cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
              <p className="text-xs text-gray-500">{t(lang, `${ga}.totalPulls`)}</p>
              <p className="text-xl font-bold text-gray-200">{stats.total}</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
              <p className="text-xs text-gray-500">{t(lang, `${ga}.totalS`)}</p>
              <p className="text-xl font-bold text-yellow-400">{stats.sCount}</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
              <p className="text-xs text-gray-500">{t(lang, `${ga}.sRate`)}</p>
              <p className="text-xl font-bold text-primary-400">{stats.sRate.toFixed(2)}%</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
              <p className="text-xs text-gray-500">{t(lang, `${ga}.avgPity`)}</p>
              <p className="text-xl font-bold text-blue-400">{stats.avgPity || "-"}</p>
            </div>
          </div>

          {/* Luck index */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 text-center">
            <p className="text-xs text-gray-500 mb-1">{t(lang, `${ga}.luckIndex`)}</p>
            <p className={`text-3xl font-bold ${luckColor}`}>
              {stats.luckIndex > 0 ? `${stats.luckIndex}%` : "-"}
            </p>
            <p className={`text-sm mt-1 ${luckColor}`}>{luckLabel}</p>
            <p className="text-xs text-gray-600 mt-2">
              {zh ? "对比理论 S 级概率 0.6%" : "Compared to theoretical 0.6% S-rank rate"}
            </p>
          </div>

          {/* Pity timeline */}
          {stats.pityIntervals.length > 0 && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <p className="text-sm font-medium text-gray-300 mb-3">
                {zh ? "出金抽数分布" : "S-Rank Pity Distribution"}
              </p>
              <div className="flex items-end gap-1 h-32">
                {stats.pityIntervals.map((v, i) => {
                  const maxPity = Math.max(...stats.pityIntervals, 1);
                  const height = Math.max(8, (v / maxPity) * 100);
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t transition-all"
                      style={{
                        height: `${height}%`,
                        backgroundColor: v >= 74 ? "#ef4444" : v >= 60 ? "#f97316" : v >= 40 ? "#eab308" : "#3b82f6",
                      }}
                      title={`${zh ? "第" : "#"}${i + 1}: ${v} ${zh ? "抽" : "pulls"}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-gray-600">
                <span>#{1}</span>
                <span>#{stats.pityIntervals.length}</span>
              </div>
            </div>
          )}

          {stats.total === 0 && (
            <p className="text-center text-gray-500 py-8">{t(lang, `${ga}.noRecords`)}</p>
          )}
        </div>
      )}

      {/* Tab: History */}
      {activeTab === "history" && (
        <div>
          {data.pulls.length === 0 ? (
            <p className="text-center text-gray-500 py-8">{t(lang, `${ga}.historyEmpty`)}</p>
          ) : (
            <div className="space-y-2">
              {data.pulls.slice(0, 100).map((pull) => {
                const item = allItems.find((i) => i.id === pull.characterId);
                const bannerLabel = bannerLabelMap[pull.banner] || pull.banner;
                const date = new Date(pull.timestamp).toLocaleDateString(zh ? "zh-CN" : "en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={pull.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                      pull.rank === "S"
                        ? "bg-yellow-500/5 border-yellow-500/20"
                        : pull.rank === "A"
                        ? "bg-purple-500/5 border-purple-500/20"
                        : "bg-gray-900/30 border-gray-800"
                    }`}
                  >
                    {item ? (
                      <GameImage
                        type={item.type === "character" ? "character" : "weapon"}
                        id={item.id}
                        name={item.name}
                        src={item.image}
                        className="w-10 h-10 rounded shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-800 shrink-0 flex items-center justify-center text-gray-600 text-xs">
                        ?
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {item ? (zh ? item.name : item.nameEn) : pull.characterId}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            pull.rank === "S"
                              ? "text-yellow-400 bg-yellow-500/20"
                              : pull.rank === "A"
                              ? "text-purple-400 bg-purple-500/20"
                              : "text-gray-500 bg-gray-700/50"
                          }`}
                        >
                          {pull.rank}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{bannerLabel}</span>
                        {pull.pullNumber > 0 && <span>#{pull.pullNumber}</span>}
                        <span>{date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(pull.id)}
                      className="text-xs text-gray-600 hover:text-red-400 transition-colors shrink-0"
                    >
                      {t(lang, `${ga}.deleteRecord`)}
                    </button>
                  </div>
                );
              })}
              {data.pulls.length > 100 && (
                <p className="text-center text-xs text-gray-500 pt-2">
                  {zh ? `显示前 100 条（共 ${data.pulls.length} 条）` : `Showing 100 of ${data.pulls.length}`}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Data Management */}
      {activeTab === "data" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 space-y-4">
            {/* Export */}
            <div>
              <button
                onClick={handleExport}
                disabled={data.pulls.length === 0}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-40"
              >
                {t(lang, `${ga}.exportBtn`)}
              </button>
            </div>

            {/* Import */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={() => {}} // handled by buttons
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    // We need to wait for file selection
                    const checkFile = setInterval(() => {
                      if (fileInputRef.current?.files?.length) {
                        clearInterval(checkFile);
                        handleImport(true);
                      }
                    }, 200);
                    // Cleanup after 30s
                    setTimeout(() => clearInterval(checkFile), 30000);
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 font-medium transition-colors"
                >
                  {t(lang, `${ga}.importReplace`)}
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    const checkFile = setInterval(() => {
                      if (fileInputRef.current?.files?.length) {
                        clearInterval(checkFile);
                        handleImport(false);
                      }
                    }, 200);
                    setTimeout(() => clearInterval(checkFile), 30000);
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 font-medium transition-colors"
                >
                  {t(lang, `${ga}.importMerge`)}
                </button>
              </div>
            </div>

            {/* Clear */}
            <div className="pt-2 border-t border-gray-800">
              <button
                onClick={handleClear}
                disabled={data.pulls.length === 0}
                className="w-full py-2.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 border border-red-500/20 text-red-400 text-sm font-medium transition-colors disabled:opacity-40"
              >
                {t(lang, `${ga}.clearBtn`)}
              </button>
            </div>
          </div>

          {/* Data summary */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-4">
            <p className="text-xs text-gray-500 mb-2">{zh ? "数据概览" : "Data Summary"}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-400">{t(lang, `${ga}.totalPulls`)}</span>
              <span className="text-gray-200 font-medium">{data.pulls.length}</span>
              {Object.entries(data.banners).map(([key, state]) => (
                <Fragment key={key}>
                  <span className="text-gray-400">{bannerLabelMap[key] || key}</span>
                  <span className="text-gray-200 font-medium">{state.totalPulls} ({zh ? "保底" : "pity"}: {state.pityCount})</span>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm shadow-lg z-50 animate-in">
          {toast}
        </div>
      )}
    </div>
  );
}
