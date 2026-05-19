"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { t, isZhLocale, type Locale } from "../../../../lib/i18n";
import { Breadcrumb } from "../../../../components/Breadcrumb";

// Max possible rolls per substat at max tier
const SUBSTAT_MAX: Record<string, number> = {
  "critRate": 6.4,
  "critDmg": 12.8,
  "atkPct": 8.0,
  "hpPct": 8.0,
  "defPct": 8.0,
  "atkFlat": 56,
  "hpFlat": 400,
  "energyRegen": 5.8,
  "elemMastery": 32,
  "breakEffect": 8.0,
  "effectHit": 8.0,
  "effectRes": 8.0,
  "speed": 4.0,
};

type SubStatKey = keyof typeof SUBSTAT_MAX;

const SUBSTAT_LABELS: Record<string, { zh: string; en: string }> = {
  "critRate": { zh: "暴击率%", en: "CRIT Rate%" },
  "critDmg": { zh: "暴击伤害%", en: "CRIT DMG%" },
  "atkPct": { zh: "攻击力%", en: "ATK%" },
  "hpPct": { zh: "生命值%", en: "HP%" },
  "defPct": { zh: "防御力%", en: "DEF%" },
  "atkFlat": { zh: "攻击力", en: "ATK" },
  "hpFlat": { zh: "生命值", en: "HP" },
  "energyRegen": { zh: "充能效率%", en: "Energy Regen%" },
  "elemMastery": { zh: "元素精通", en: "Elem Mastery" },
  "breakEffect": { zh: "击破效果%", en: "Break Effect%" },
  "effectHit": { zh: "效果命中%", en: "Effect Hit%" },
  "effectRes": { zh: "效果抵抗%", en: "Effect RES%" },
  "speed": { zh: "速度", en: "SPD" },
};

// Weight multipliers — how valuable each stat is relative to ATK%
const WEIGHTS: Record<string, number> = {
  "critRate": 2.0,
  "critDmg": 1.0,
  "atkPct": 1.0,
  "hpPct": 0.5,
  "defPct": 0.3,
  "atkFlat": 0.15,
  "hpFlat": 0.05,
  "energyRegen": 1.2,
  "elemMastery": 0.6,
  "breakEffect": 0.5,
  "effectHit": 0.3,
  "effectRes": 0.3,
  "speed": 1.5,
};

const PRESET_WEIGHTS: Record<string, { labelZh: string; labelEn: string; weights: Record<string, number> }> = {
  dps: {
    labelZh: "输出角色",
    labelEn: "DPS",
    weights: { critRate: 2.0, critDmg: 1.0, atkPct: 1.0, hpPct: 0.2, defPct: 0.1, atkFlat: 0.15, hpFlat: 0.05, energyRegen: 0.8, elemMastery: 0.4, breakEffect: 0.2, effectHit: 0.1, effectRes: 0.1, speed: 1.2 },
  },
  support: {
    labelZh: "支援角色",
    labelEn: "Support",
    weights: { critRate: 0.3, critDmg: 0.2, atkPct: 0.6, hpPct: 1.0, defPct: 0.5, atkFlat: 0.1, hpFlat: 0.3, energyRegen: 2.0, elemMastery: 0.5, breakEffect: 0.3, effectHit: 0.3, effectRes: 0.3, speed: 1.5 },
  },
  balanced: {
    labelZh: "均衡",
    labelEn: "Balanced",
    weights: { critRate: 1.5, critDmg: 0.8, atkPct: 0.8, hpPct: 0.5, defPct: 0.3, atkFlat: 0.1, hpFlat: 0.1, energyRegen: 1.0, elemMastery: 0.5, breakEffect: 0.3, effectHit: 0.3, effectRes: 0.3, speed: 1.0 },
  },
};

const STAT_KEYS = Object.keys(SUBSTAT_MAX) as SubStatKey[];

export default function DiskScorePage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;
  const isZh = isZhLocale(lang);

  const [subs, setSubs] = useState<Record<string, number>>({});
  const [selectedStats, setSelectedStats] = useState<string[]>([]);
  const [preset, setPreset] = useState<string>("dps");

  const toggleStat = (key: string) => {
    if (selectedStats.includes(key)) {
      setSelectedStats((prev) => prev.filter((s) => s !== key));
      setSubs((prev) => { const next = { ...prev }; delete next[key]; return next; });
    } else if (selectedStats.length < 4) {
      setSelectedStats((prev) => [...prev, key]);
      setSubs((prev) => ({ ...prev, [key]: 0 }));
    }
  };

  const activeWeights = PRESET_WEIGHTS[preset]?.weights || WEIGHTS;

  const score = useMemo(() => {
    let total = 0;
    let maxPossible = 0;
    for (const key of selectedStats) {
      const val = subs[key] || 0;
      const max = SUBSTAT_MAX[key] || 1;
      const weight = activeWeights[key] || 1;
      total += (val / max) * weight;
      maxPossible += weight;
    }
    if (maxPossible === 0) return { pct: 0, grade: "—", gradeColor: "text-gray-500" };
    const pct = Math.round((total / maxPossible) * 100);
    let grade: string;
    let gradeColor: string;
    if (pct >= 85) { grade = "S"; gradeColor = "text-yellow-400"; }
    else if (pct >= 70) { grade = "A"; gradeColor = "text-purple-400"; }
    else if (pct >= 55) { grade = "B"; gradeColor = "text-blue-400"; }
    else if (pct >= 35) { grade = "C"; gradeColor = "text-emerald-400"; }
    else { grade = "D"; gradeColor = "text-gray-400"; }
    return { pct, grade, gradeColor };
  }, [subs, selectedStats, activeWeights]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(lang, "site.nav.home"), href: `/${lang}` },
          { label: isZh ? "卡带评分器" : "Disk Score Calculator" },
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {isZh ? "卡带评分器" : "Disk Score Calculator"}
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          {isZh
            ? "输入卡带副词条数值，计算词条效率评分。选择最多 4 个副词条。"
            : "Enter disk substat values to calculate roll efficiency. Select up to 4 substats."}
        </p>

        {/* Preset weights */}
        <div className="flex gap-2 mb-4">
          {Object.entries(PRESET_WEIGHTS).map(([key, pw]) => (
            <button
              key={key}
              onClick={() => setPreset(key)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                preset === key
                  ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                  : "bg-gray-800 text-gray-400 hover:text-gray-300"
              }`}
            >
              {isZh ? pw.labelZh : pw.labelEn}
            </button>
          ))}
        </div>

        {/* Score display */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-6 text-center">
          <div className={`text-5xl font-black ${score.gradeColor}`}>
            {score.grade}
          </div>
          <div className="mt-2 h-3 bg-gray-800 rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className={`h-full rounded-full transition-all duration-500 ${score.pct >= 70 ? "bg-primary-500" : score.pct >= 40 ? "bg-blue-500" : "bg-gray-500"}`}
              style={{ width: `${Math.min(100, score.pct)}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {isZh ? "词条效率" : "Roll Efficiency"}: {score.pct}%
          </p>
        </div>

        {/* Substat selector */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 mb-4">
          <h2 className="text-sm font-semibold mb-3">{isZh ? "选择副词条" : "Select Substats"}</h2>
          <div className="flex flex-wrap gap-2">
            {STAT_KEYS.map((key) => {
              const isSelected = selectedStats.includes(key);
              const isFull = selectedStats.length >= 4 && !isSelected;
              return (
                <button
                  key={key}
                  onClick={() => !isFull && toggleStat(key)}
                  disabled={isFull}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                      : isFull
                      ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                      : "bg-gray-800 text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {isZh ? SUBSTAT_LABELS[key].zh : SUBSTAT_LABELS[key].en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Value inputs */}
        {selectedStats.length > 0 && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 space-y-3">
            {selectedStats.map((key) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-24 shrink-0">
                  {isZh ? SUBSTAT_LABELS[key].zh : SUBSTAT_LABELS[key].en}
                </span>
                <input
                  type="number"
                  min={0}
                  step={key.includes("Flat") || key === "speed" ? 1 : 0.1}
                  value={subs[key] || 0}
                  onChange={(e) => setSubs((prev) => ({ ...prev, [key]: Math.max(0, Number(e.target.value)) }))}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50"
                />
                <div className="w-24 text-right">
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500/60 rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((subs[key] || 0) / (SUBSTAT_MAX[key] || 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-600">
                    {isZh ? "最大" : "max"} {SUBSTAT_MAX[key]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedStats.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <p className="text-sm">{isZh ? "选择副词条开始评分" : "Select substats to start scoring"}</p>
          </div>
        )}

        <p className="text-xs text-gray-600 mt-6 text-center">
          {isZh
            ? "评分基于词条效率百分比，综合考虑各词条的权重和价值。仅供参考。"
            : "Score is based on roll efficiency percentage with weighted stat values. For reference only."}
        </p>
      </div>
    </>
  );
}
