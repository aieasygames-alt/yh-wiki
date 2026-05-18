"use client";

import { useState, useEffect } from "react";
import { isZhLocale, type Locale } from "../lib/i18n";

const STORAGE_KEY = "nte-city-tycoon-progress";

const TYCOON_LEVELS = [
  { level: 1, rewardZh: "解锁都市大亨模式", rewardEn: "Unlock City Tycoon mode", type: "unlock" },
  { level: 5, rewardZh: "异环币 x5000", rewardEn: "Hethereau Coin x5000", type: "currency" },
  { level: 10, rewardZh: "B级弧盘自选箱 x1", rewardEn: "B-Rank Arc Disc Selector x1", type: "weapon" },
  { level: 15, rewardZh: "异环币 x10000", rewardEn: "Hethereau Coin x10000", type: "currency" },
  { level: 21, rewardZh: "专属弧盘「沉思之猫」", rewardEn: 'Exclusive Arc "Contemplative Cat"', type: "weapon" },
  { level: 25, rewardZh: "角色觉醒材料箱 x5", rewardEn: "Character Awakening Material Box x5", type: "material" },
  { level: 30, rewardZh: "满配赤子（小智）6+5", rewardEn: "Max Chiz (Xiaozhi) 6+5", type: "character" },
  { level: 35, rewardZh: "异环币 x20000", rewardEn: "Hethereau Coin x20000", type: "currency" },
  { level: 40, rewardZh: "S级弧盘自选箱 x1", rewardEn: "S-Rank Arc Disc Selector x1", type: "weapon" },
];

const TYPE_ICONS: Record<string, string> = {
  unlock: "🔓",
  currency: "💰",
  weapon: "⚔️",
  material: "📦",
  character: "👤",
};

export function CityTycoonTracker({ locale }: { locale: Locale }) {
  const isZh = isZhLocale(locale);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as number[];
        setCompleted(new Set(parsed));
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const toggleLevel = (level: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  if (!mounted) return null;

  const progress = completed.size;
  const total = TYCOON_LEVELS.length;
  const pct = Math.round((progress / total) * 100);

  // Estimate days to Lv.30 based on progress
  const lv30Idx = TYCOON_LEVELS.findIndex((l) => l.level === 30);
  const completedBefore30 = TYCOON_LEVELS.filter((l, i) => i <= lv30Idx && completed.has(l.level)).length;
  const daysEstimate = Math.max(0, Math.round((lv30Idx + 1 - completedBefore30) * 5));

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">
            {isZh ? "进度追踪" : "Progress Tracker"}
          </span>
          <span className="text-xs text-gray-400">
            {progress}/{total} {isZh ? "里程碑" : "milestones"} ({pct}%)
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {!completed.has(30) && (
          <p className="text-xs text-gray-500 mt-2">
            {isZh
              ? `预计还需约 ${daysEstimate} 天达到 Lv.30（赤子满配）`
              : `~${daysEstimate} days to Lv.30 (Maxed Chiz)`}
          </p>
        )}
        {completed.has(30) && (
          <p className="text-xs text-emerald-400 mt-2">
            {isZh ? "已获得满配赤子！" : "Maxed Chiz obtained!"}
          </p>
        )}
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Connecting line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-800" />

        {TYCOON_LEVELS.map((lvl, i) => {
          const isDone = completed.has(lvl.level);
          const isLv30 = lvl.level === 30;
          return (
            <div key={lvl.level} className="relative flex items-start gap-4 pb-4">
              {/* Circle */}
              <button
                onClick={() => toggleLevel(lvl.level)}
                className={`absolute left-[-25px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isDone
                    ? isLv30
                      ? "bg-yellow-500 border-yellow-400"
                      : "bg-primary-500 border-primary-400"
                    : "bg-gray-900 border-gray-600 hover:border-gray-400"
                }`}
                title={isZh ? "点击切换完成状态" : "Click to toggle completion"}
              >
                {isDone && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>

              {/* Content */}
              <div
                className={`flex items-center gap-3 flex-1 rounded-lg border p-3 transition-colors cursor-pointer ${
                  isLv30
                    ? isDone
                      ? "border-yellow-500/30 bg-yellow-500/5"
                      : "border-yellow-500/20 bg-yellow-500/5"
                    : isDone
                    ? "border-gray-700 bg-gray-800/30"
                    : "border-gray-800 bg-gray-900/30"
                }`}
                onClick={() => toggleLevel(lvl.level)}
              >
                <span className="text-lg w-8 text-center shrink-0">{TYPE_ICONS[lvl.type]}</span>
                <span className="text-sm font-mono text-gray-500 w-12 shrink-0">Lv.{lvl.level}</span>
                <span className={`text-sm flex-1 ${isDone ? "text-gray-400 line-through" : "text-gray-300"}`}>
                  {isZh ? lvl.rewardZh : lvl.rewardEn}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
