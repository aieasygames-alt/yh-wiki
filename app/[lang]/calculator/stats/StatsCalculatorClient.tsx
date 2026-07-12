"use client";

import { useMemo, useState } from "react";
import { getAttributeColor, getAttributeLabel } from "../../../../lib/attributes";
import { t, isZhLocale, Locale } from "../../../../lib/i18n";
import { GameImage } from "../../../../components/GameImage";
import { Breadcrumb } from "../../../../components/Breadcrumb";

const BASE_ATK = 200;

type StatsCharacter = {
  id: string;
  name: string;
  nameEn: string;
  rank: string;
  attribute: string;
  role: string;
  roleEn: string;
  arcType?: string;
  signatureArc?: string;
};

type StatsWeapon = {
  id: string;
  name: string;
  nameEn: string;
  rank: string;
  type: string;
  baseAtk: number;
  effectName: string;
  effectNameEn: string;
  effectDescription: string;
  effectDescriptionEn: string;
};

interface StatsCalculatorClientProps {
  lang: Locale;
  characters: StatsCharacter[];
  weapons: StatsWeapon[];
}

function estimateStats(baseAtk: number, substats: Record<string, number>) {
  const atkPct = (substats.atkPct || 0) + ((substats.flatAtk || 0) / baseAtk) * 100;
  const totalAtk = baseAtk * (1 + atkPct / 100);
  const critRate = Math.min(100, substats.critRate || 0);
  const critDmg = 50 + (substats.critDmg || 0);
  const avgDmgMult = (critRate / 100) * (1 + critDmg / 100) + (1 - critRate / 100);
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

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-mono text-white">{value}</span>
    </div>
  );
}

export function StatsCalculatorClient({
  lang,
  characters,
  weapons,
}: StatsCalculatorClientProps) {
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);

  const [selectedChar, setSelectedChar] = useState("");
  const [selectedWeapon, setSelectedWeapon] = useState("");
  const [atkPct, setAtkPct] = useState(46.6);
  const [critRate, setCritRate] = useState(32.4);
  const [critDmg, setCritDmg] = useState(64.8);
  const [elementalDmg, setElementalDmg] = useState(38.8);
  const [skillMult, setSkillMult] = useState(200);

  const char = characters.find((entry) => entry.id === selectedChar);
  const weapon = weapons.find((entry) => entry.id === selectedWeapon);
  const baseAtk = weapon ? weapon.baseAtk : BASE_ATK;

  const handleCharChange = (charId: string) => {
    setSelectedChar(charId);
    if (!charId) return;

    const selected = characters.find((entry) => entry.id === charId);
    if (!selected?.signatureArc) return;

    const signature = weapons.find((entry) => entry.id === selected.signatureArc);
    if (signature) setSelectedWeapon(signature.id);
  };

  const presets = [
    { key: "crit", labelZh: "暴击流", labelEn: "Crit Build", atkPct: 46.6, critRate: 64.8, critDmg: 129.6, elementalDmg: 38.8 },
    { key: "balanced", labelZh: "均衡流", labelEn: "Balanced", atkPct: 46.6, critRate: 32.4, critDmg: 64.8, elementalDmg: 38.8 },
    { key: "atk", labelZh: "攻击流", labelEn: "ATK Focus", atkPct: 93.2, critRate: 16.2, critDmg: 32.4, elementalDmg: 19.4 },
    { key: "elemental", labelZh: "属性流", labelEn: "Elemental", atkPct: 23.3, critRate: 16.2, critDmg: 32.4, elementalDmg: 77.6 },
  ];

  const applyPreset = (preset: typeof presets[number]) => {
    setAtkPct(preset.atkPct);
    setCritRate(preset.critRate);
    setCritDmg(preset.critDmg);
    setElementalDmg(preset.elementalDmg);
  };

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

        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZh ? "这个面板计算器能帮你判断什么？" : "What can this stats calculator help you decide?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZh
              ? "它更适合快速判断某套词条分配会把角色推向什么方向，比如更偏暴击、更偏攻击，还是属性伤收益更明显。和完整 DPS 计算器相比，这个页面更轻量，适合在配装初期先看面板结构是否合理。"
              : "This page is best for quickly checking what direction a stat spread pushes a character toward: more crit-heavy, more ATK-focused, or better elemental scaling. Compared with the full DPS calculator, it is lighter and better suited to early build checks when you want to validate the shape of the stats first."}
          </p>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "看面板时先抓什么" : "What should you look at first?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "先确认角色更吃暴击、攻击还是属性伤，不同角色的最优平衡点并不一样。" : "Identify whether the character benefits most from crit, ATK, or elemental scaling first, because the balance point is not universal."}</li>
              <li>{isZh ? "把武器基础攻击和角色定位一起考虑，不要单独看某一个百分比数值。" : "Read the percentages together with weapon base ATK and role instead of judging one stat in isolation."}</li>
              <li>{isZh ? "如果你准备继续深入比较，再把这套面板带去 DPS 计算器看实际循环收益。" : "If the build survives this first pass, move it into the DPS calculator to compare actual rotation value."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "只追单项面板极高，却忽略整体乘区已经失衡。" : "Chasing one extremely high stat while the overall multiplier balance collapses."}</li>
              <li>{isZh ? "把不同武器下的面板直接硬比，忽略基础攻击差异。" : "Comparing stat sheets across different weapons without accounting for base ATK differences."}</li>
              <li>{isZh ? "看到平均伤害提升，就默认实战循环一定同步提升。" : "Assuming a better average hit always translates into a better real rotation."}</li>
            </ul>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">
                {t(locale, "statsCalc.selectCharacter")}
              </h2>
              <select
                value={selectedChar}
                onChange={(e) => handleCharChange(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50"
              >
                <option value="">{t(locale, "statsCalc.selectCharacter")}</option>
                {characters
                  .filter((entry) => entry.rank === "S" || entry.rank === "A")
                  .map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {isZh ? entry.name : entry.nameEn} ({entry.rank})
                    </option>
                  ))}
              </select>
              {char && (
                <div className="flex items-center gap-3 mt-3">
                  <GameImage type="character" id={char.id} name={char.name} className="w-12 h-12 rounded-lg" />
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
                {weapons
                  .filter((entry) => !char || entry.type === char.arcType || entry.rank === "S")
                  .map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {isZh ? entry.name : entry.nameEn} ({entry.rank}) - ATK {entry.baseAtk}
                    </option>
                  ))}
              </select>
              {weapon && (
                <p className="text-xs text-gray-400 mt-2">
                  {isZh ? weapon.effectName : weapon.effectNameEn}: {isZh ? weapon.effectDescription : weapon.effectDescriptionEn}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">
                {t(locale, "statsCalc.substats")}
              </h2>
              <div className="flex gap-2 mb-4">
                {presets.map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => applyPreset(preset)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-primary-400 hover:bg-gray-700 transition-colors"
                  >
                    {isZh ? preset.labelZh : preset.labelEn}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: isZh ? "攻击力%" : "ATK%", value: atkPct, set: setAtkPct, max: 200 },
                  { label: isZh ? "暴击率%" : "CRIT Rate%", value: critRate, set: setCritRate, max: 100 },
                  { label: isZh ? "暴击伤害%" : "CRIT DMG%", value: critDmg, set: setCritDmg, max: 300 },
                  { label: isZh ? "属性伤害%" : "Elem DMG%", value: elementalDmg, set: setElementalDmg, max: 200 },
                ].map((stat) => (
                  <div key={stat.label}>
                    <label className="text-xs text-gray-400 block mb-1">
                      {stat.label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={stat.max}
                        step={0.1}
                        value={stat.value}
                        onChange={(e) => stat.set(Number(e.target.value))}
                        className="flex-1 h-2.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-500"
                      />
                      <input
                        type="number"
                        value={stat.value}
                        onChange={(e) => stat.set(Math.max(0, Math.min(stat.max, Number(e.target.value))))}
                        className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-primary-500/50"
                        min={0}
                        max={stat.max}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-xs text-gray-400 block mb-1">
                  {isZh ? "技能倍率%" : "Skill Multiplier%"}
                </label>
                <input
                  type="number"
                  value={skillMult}
                  onChange={(e) => setSkillMult(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-primary-500/30 bg-gradient-to-br from-primary-900/40 to-gray-900/60 p-5">
              <h2 className="text-sm font-semibold text-primary-400 mb-2">
                {t(locale, "statsCalc.estimatedResult")}
              </h2>
              <p className="text-3xl font-bold font-mono text-white">
                {stats.totalDmgMult}x
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isZh ? "综合面板倍率估算" : "Estimated overall panel multiplier"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">
                {t(locale, "statsCalc.breakdown")}
              </h2>
              <div className="space-y-3">
                <StatRow label={t(locale, "statsCalc.totalAtk")} value={stats.totalAtk.toString()} />
                <StatRow label={t(locale, "statsCalc.critRate")} value={`${stats.critRate}%`} />
                <StatRow label={t(locale, "statsCalc.critDmg")} value={`${stats.critDmg}%`} />
                <StatRow label={t(locale, "statsCalc.avgMultiplier")} value={`${stats.avgDmgMult}x`} />
                <StatRow label={t(locale, "statsCalc.elementalDmg")} value={`${stats.elementalDmg}%`} />
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">
                {isZh ? "单次伤害估算" : "Single-Hit Estimate"}
              </h2>
              <div className="space-y-3">
                <StatRow label={isZh ? "非暴击" : "Non-Crit"} value={normalDmg.toLocaleString()} />
                <StatRow label={isZh ? "暴击" : "Critical"} value={critHitDmg.toLocaleString()} />
                <StatRow label={isZh ? "平均伤害" : "Average"} value={avgDmg.toLocaleString()} />
                <StatRow label={isZh ? "含属性伤平均" : "Avg with Elemental"} value={totalAvgDmg.toLocaleString()} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
