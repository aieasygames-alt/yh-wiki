"use client";

import { useState, useMemo } from "react";
import { getAllCharacters, getAllWeapons } from "../../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../../lib/attributes";
import { t, isZhLocale, Locale } from "../../../../lib/i18n";
import { GameImage } from "../../../../components/GameImage";
import { Breadcrumb } from "../../../../components/Breadcrumb";

// Damage formula constants (estimated, for reference only)
const BASE_HP = 1000;
const BASE_ATK = 200;
const BASE_DEF = 150;
const CRIT_MULT = 2.0;

function estimateStats(baseAtk: number, substats: Record<string, number>) {
  const atkPct = (substats.atkPct || 0) + (substats.flatAtk || 0) / baseAtk * 100;
  const totalAtk = baseAtk * (1 + atkPct / 100);
  const critRate = Math.min(100, (substats.critRate || 0));
  const critDmg = 50 + (substats.critDmg || 0);
  const avgDmgMult = critRate / 100 * (1 + critDmg / 100) + (1 - critRate / 100);
  const elementalDmg = substats.elementalDmg || 0;
  const totalDmgMult = avgDmgMult * (1 + elementalDmg / 100);

  return {
    totalAtk: Math.round(totalAtk),
    critRate,
    critDmg,
    avgDmgMult: Math.round(avgDmgMult * 100) / 100,
    totalDmgMult: Math.round(totalDmgMult * 100) / 100,
    elementalDmg,
  };
}

export default function StatsCalculatorPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);

  const allChars = useMemo(() => getAllCharacters(), []);
  const allWeapons = useMemo(() => getAllWeapons(), []);

  const [selectedChar, setSelectedChar] = useState<string>("");
  const [selectedWeapon, setSelectedWeapon] = useState<string>("");

  const [atkPct, setAtkPct] = useState(46.6);
  const [critRate, setCritRate] = useState(32.4);
  const [critDmg, setCritDmg] = useState(64.8);
  const [elementalDmg, setElementalDmg] = useState(38.8);
  const [skillMult, setSkillMult] = useState(200);

  const char = allChars.find((c) => c.id === selectedChar);
  const weapon = allWeapons.find((w) => w.id === selectedWeapon);

  const baseAtk = weapon ? weapon.baseAtk : BASE_ATK;

  const stats = useMemo(
    () =>
      estimateStats(baseAtk, {
        atkPct,
        critRate,
        critDmg,
        elementalDmg,
      }),
    [baseAtk, atkPct, critRate, critDmg, elementalDmg]
  );

  const normalDmg = Math.round(stats.totalAtk * (skillMult / 100));
  const critHitDmg = Math.round(normalDmg * (1 + stats.critDmg / 100));
  const avgDmg = Math.round(normalDmg * stats.avgDmgMult);
  const totalAvgDmg = Math.round(avgDmg * (1 + stats.elementalDmg / 100));

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "calculator.title"), href: `/${lang}/calculator/leveling` },
          { label: t(locale, "statsCalc.title") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {t(locale, "statsCalc.title")}
        </h1>
        <p className="text-gray-400 mb-2">
          {t(locale, "statsCalc.subtitle")}
        </p>
        <p className="text-xs text-gray-600 mb-8">
          {isZh
            ? "伤害公式为估算值，仅供参考。实际游戏数据可能不同。"
            : "Damage formula is estimated for reference only. Actual game data may differ."}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-4">
            {/* Character Selection */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">
                {t(locale, "statsCalc.selectCharacter")}
              </h2>
              <select
                value={selectedChar}
                onChange={(e) => setSelectedChar(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50"
              >
                <option value="">{t(locale, "statsCalc.selectCharacter")}</option>
                {allChars
                  .filter((c) => c.rank === "S" || c.rank === "A")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {isZh ? c.name : c.nameEn} ({c.rank})
                    </option>
                  ))}
              </select>
              {char && (
                <div className="flex items-center gap-3 mt-3">
                  <GameImage
                    type="character"
                    id={char.id}
                    name={char.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div>
                    <p className="text-sm font-medium">{isZh ? char.name : char.nameEn}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded border ${getAttributeColor(char.attribute)}`}>
                        {getAttributeLabel(char.attribute, locale)}
                      </span>
                      <span className="text-xs text-gray-500">{isZh ? char.role : char.roleEn}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Weapon Selection */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">
                {t(locale, "statsCalc.selectWeapon")}
              </h2>
              <select
                value={selectedWeapon}
                onChange={(e) => setSelectedWeapon(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50"
              >
                <option value="">{t(locale, "statsCalc.selectWeapon")}</option>
                {allWeapons
                  .filter((w) => !char || w.type === char.arcType || w.rank === "S")
                  .map((w) => (
                    <option key={w.id} value={w.id}>
                      {isZh ? w.name : w.nameEn} ({w.rank}) - ATK {w.baseAtk}
                    </option>
                  ))}
              </select>
              {weapon && (
                <p className="text-xs text-gray-400 mt-2">
                  {isZh ? weapon.effectName : weapon.effectNameEn}: {isZh ? weapon.effectDescription : weapon.effectDescriptionEn}
                </p>
              )}
            </div>

            {/* Stat Inputs */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">
                {t(locale, "statsCalc.substats")}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: isZh ? "攻击力%" : "ATK%", value: atkPct, set: setAtkPct, max: 200 },
                  { label: isZh ? "暴击率%" : "CRIT Rate%", value: critRate, set: setCritRate, max: 100 },
                  { label: isZh ? "暴击伤害%" : "CRIT DMG%", value: critDmg, set: setCritDmg, max: 300 },
                  { label: isZh ? "属性伤害%" : "Elem DMG%", value: elementalDmg, set: setElementalDmg, max: 200 },
                ].map((s) => (
                  <div key={s.label}>
                    <label className="text-xs text-gray-400 block mb-1">
                      {s.label}
                    </label>
                    <input
                      type="number"
                      value={s.value}
                      onChange={(e) => s.set(Math.max(0, Math.min(s.max, Number(e.target.value))))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
                      min={0}
                      max={s.max}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <label className="text-xs text-gray-400 block mb-1">
                  {t(locale, "statsCalc.skillMultiplier")} (%)
                </label>
                <input
                  type="number"
                  value={skillMult}
                  onChange={(e) => setSkillMult(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-4">
              <h2 className="text-sm font-semibold mb-4">
                {t(locale, "statsCalc.results")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400">{isZh ? "总攻击力" : "Total ATK"}</p>
                  <p className="text-2xl font-bold text-primary-400">{stats.totalAtk}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">{isZh ? "暴击率" : "CRIT Rate"}</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.critRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">{isZh ? "暴击伤害" : "CRIT DMG"}</p>
                  <p className="text-2xl font-bold text-red-400">{stats.critDmg}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">{isZh ? "属性伤害" : "Elem DMG"}</p>
                  <p className="text-2xl font-bold text-purple-400">+{stats.elementalDmg}%</p>
                </div>
              </div>
            </div>

            {/* Damage Output */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-4">
                {t(locale, "statsCalc.damageOutput")}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                  <span className="text-xs text-gray-400">{isZh ? "普通伤害" : "Normal Hit"}</span>
                  <span className="text-sm font-mono">{normalDmg.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                  <span className="text-xs text-gray-400">{isZh ? "暴击伤害" : "Critical Hit"}</span>
                  <span className="text-sm font-mono text-orange-400">{critHitDmg.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                  <span className="text-xs text-gray-400">{isZh ? "平均伤害 (含暴击)" : "Avg Damage (w/ Crit)"}</span>
                  <span className="text-sm font-mono text-primary-400">{avgDmg.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 bg-primary-500/5 rounded-lg px-3 -mx-1">
                  <span className="text-xs text-gray-300">{isZh ? "最终伤害 (含属性)" : "Final Damage (w/ Elem)"}</span>
                  <span className="text-lg font-bold font-mono text-primary-400">{totalAvgDmg.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Damage Breakdown */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">
                {t(locale, "statsCalc.breakdown")}
              </h2>
              <div className="space-y-2">
                <StatBar label={isZh ? "暴击倍率" : "Crit Multiplier"} value={stats.avgDmgMult} max={4} color="bg-orange-500" />
                <StatBar label={isZh ? "属性加成" : "Elemental Bonus"} value={(1 + stats.elementalDmg / 100)} max={3} color="bg-purple-500" />
                <StatBar label={isZh ? "总倍率" : "Total Multiplier"} value={stats.totalDmgMult} max={8} color="bg-primary-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300 font-mono">x{value.toFixed(2)}</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
