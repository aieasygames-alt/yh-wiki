"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { getAttributeColor, getAttributeLabel } from "../../../../lib/attributes";
import { isZhLocale, Locale } from "../../../../lib/i18n";
import { WebApplicationJsonLd } from "../../../../components/JsonLd";

interface DPSCharacter {
  id: string;
  name: string;
  nameEn: string;
  rank: string;
  attribute: string;
  role: string;
  roleEn: string;
  arcType?: string;
  signatureArc?: string;
  baseStats?: {
    baseAtk: number;
  };
}

interface DPSWeapon {
  id: string;
  name: string;
  nameEn: string;
  rank: string;
  type: string;
  baseAtk: number;
}

interface DPSCalculatorClientProps {
  characters: DPSCharacter[];
  weapons: DPSWeapon[];
}

interface DPSInput {
  baseAtk: number;
  weaponAtk: number;
  atkPct: number;
  flatAtk: number;
  critRate: number;
  critDmg: number;
  elemDmg: number;
  skillMult: number;
  resistMult: number;
  defMult: number;
  teamBonus: number;
  comboHits: number;
  comboTime: number;
}

function calculateDPS(i: DPSInput) {
  const totalAtk = (i.baseAtk + i.weaponAtk) * (1 + i.atkPct / 100) + i.flatAtk;
  const baseDmg = totalAtk * (i.skillMult / 100);
  const critAvgMult = i.critRate / 100 * (1 + i.critDmg / 100) + (1 - i.critRate / 100);
  const elemMult = 1 + i.elemDmg / 100;
  const teamMult = 1 + i.teamBonus / 100;

  const skillDmg = baseDmg * critAvgMult * elemMult * teamMult * i.defMult * i.resistMult;
  const critDmg = baseDmg * (1 + i.critDmg / 100) * elemMult * teamMult * i.defMult * i.resistMult;
  const nonCritDmg = baseDmg * elemMult * teamMult * i.defMult * i.resistMult;

  const rotationDmg = skillDmg * i.comboHits;
  const dps = i.comboTime > 0 ? rotationDmg / i.comboTime : 0;

  return {
    totalAtk: Math.round(totalAtk),
    skillDmg: Math.round(skillDmg),
    critDmg: Math.round(critDmg),
    nonCritDmg: Math.round(nonCritDmg),
    rotationDmg: Math.round(rotationDmg),
    dps: Math.round(dps),
    totalMult: Math.round(critAvgMult * elemMult * teamMult * 100) / 100,
    breakdown: {
      atkContrib: Math.round((totalAtk / (i.baseAtk + i.weaponAtk)) * 100),
      critContrib: Math.round((critAvgMult - 1) * 100),
      elemContrib: Math.round((elemMult - 1) * 100),
      teamContrib: Math.round((teamMult - 1) * 100),
    },
  };
}

const PRESETS = [
  { key: "dps-crit", labelZh: "暴击输出", labelEn: "Crit DPS", atkPct: 46.6, critRate: 75, critDmg: 150, elemDmg: 46.6, teamBonus: 20 },
  { key: "dps-balanced", labelZh: "均衡输出", labelEn: "Balanced DPS", atkPct: 46.6, critRate: 50, critDmg: 100, elemDmg: 46.6, teamBonus: 10 },
  { key: "dps-atk", labelZh: "攻击特化", labelEn: "ATK Focus", atkPct: 93.2, critRate: 32.4, critDmg: 64.8, elemDmg: 38.8, teamBonus: 0 },
  { key: "dps-elem", labelZh: "属性特化", labelEn: "Elemental", atkPct: 23.3, critRate: 32.4, critDmg: 64.8, elemDmg: 93.2, teamBonus: 15 },
];

const SKILL_PRESETS = [
  { key: "normal", labelZh: "普攻单段", labelEn: "Normal (1 hit)", mult: 80, hits: 5, time: 3 },
  { key: "skill", labelZh: "战技", labelEn: "Skill", mult: 250, hits: 1, time: 2 },
  { key: "ultimate", labelZh: "终结技", labelEn: "Ultimate", mult: 500, hits: 3, time: 4 },
  { key: "combo-short", labelZh: "短循环 (12s)", labelEn: "Short Rotation (12s)", mult: 200, hits: 8, time: 12 },
  { key: "combo-long", labelZh: "长循环 (20s)", labelEn: "Long Rotation (20s)", mult: 180, hits: 15, time: 20 },
  { key: "custom", labelZh: "自定义", labelEn: "Custom", mult: 200, hits: 5, time: 10 },
];

export function DPSCalculatorClient({
  characters,
  weapons,
}: DPSCalculatorClientProps) {
  const { lang: langParam } = useParams();
  const lang = (langParam || "en") as Locale;
  const isZh = isZhLocale(lang);

  const [selectedChar, setSelectedChar] = useState("");
  const [selectedWeapon, setSelectedWeapon] = useState("");
  const [skillPreset, setSkillPreset] = useState("combo-short");
  const [atkPct, setAtkPct] = useState(46.6);
  const [critRate, setCritRate] = useState(50);
  const [critDmg, setCritDmg] = useState(100);
  const [elemDmg, setElemDmg] = useState(46.6);
  const [teamBonus, setTeamBonus] = useState(10);
  const [skillMult, setSkillMult] = useState(200);
  const [comboHits, setComboHits] = useState(8);
  const [comboTime, setComboTime] = useState(12);
  const [enemyResist, setEnemyResist] = useState(10);
  const [enemyDef, setEnemyDef] = useState(50);

  const char = characters.find((c) => c.id === selectedChar);
  const weapon = weapons.find((w) => w.id === selectedWeapon);

  const baseAtk = char?.baseStats?.baseAtk || 200;
  const weaponAtk = weapon?.baseAtk || 0;

  const handleCharChange = (charId: string) => {
    setSelectedChar(charId);
    if (!charId) return;

    const selected = characters.find((entry) => entry.id === charId);
    if (!selected?.signatureArc) return;

    const signature = weapons.find((entry) => entry.id === selected.signatureArc);
    if (signature) setSelectedWeapon(signature.id);
  };

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setAtkPct(preset.atkPct);
    setCritRate(preset.critRate);
    setCritDmg(preset.critDmg);
    setElemDmg(preset.elemDmg);
    setTeamBonus(preset.teamBonus);
  };

  const applySkillPreset = (key: string) => {
    setSkillPreset(key);
    const preset = SKILL_PRESETS.find((entry) => entry.key === key);
    if (preset && key !== "custom") {
      setSkillMult(preset.mult);
      setComboHits(preset.hits);
      setComboTime(preset.time);
    }
  };

  const result = useMemo(
    () =>
      calculateDPS({
        baseAtk,
        weaponAtk,
        atkPct,
        flatAtk: 0,
        critRate: Math.min(100, critRate),
        critDmg,
        elemDmg,
        skillMult,
        resistMult: 1 - enemyResist / 100,
        defMult: 1 - enemyDef / 100,
        teamBonus,
        comboHits,
        comboTime,
      }),
    [baseAtk, weaponAtk, atkPct, critRate, critDmg, elemDmg, skillMult, enemyResist, enemyDef, teamBonus, comboHits, comboTime]
  );

  return (
    <>
      <WebApplicationJsonLd
        name={isZh ? "异环 DPS 伤害计算器" : "NTE DPS Damage Calculator"}
        description={isZh ? "异环角色 DPS 伤害计算工具，输入攻击/暴击/元素加成等属性估算伤害输出" : "NTE DPS damage calculator — input ATK, crit, elemental bonus and skill multipliers to estimate damage output"}
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {isZh ? "DPS 伤害计算器" : "DPS Damage Calculator"}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {isZh
              ? "计算角色技能伤害、循环DPS，对比不同配装的输出差异。"
              : "Calculate skill damage, rotation DPS, and compare different build outputs."}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {isZh
              ? "※ 公式为估算值，基于社区测试数据。实际伤害可能因游戏版本更新而变化。"
              : "※ Formula is estimated based on community testing. Actual damage may vary with game updates."}
          </p>
        </div>

        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZh ? "DPS 计算器最适合解决什么问题？" : "What problems is this DPS calculator best at solving?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZh
              ? "它最适合拿来比较两套配装、两把武器或者两种循环设定之间的输出差异。比起追求一个绝对准确的面板答案，这个工具更擅长帮你看“改暴击值更赚，还是补攻击和属性伤更赚”，以及“缩短循环后实际 DPS 会不会更高”。"
              : "This calculator is best for comparing two builds, two weapons, or two rotation assumptions. Instead of chasing one perfectly exact number, it is more useful for seeing whether extra crit, more ATK, elemental bonus, or a shorter rotation creates the bigger gain."}
          </p>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "算 DPS 前先确认什么" : "What should you confirm before calculating DPS?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "先确定你想比较的是武器差距、词条差距，还是循环手法差距，不同问题要锁定不同变量。" : "Decide whether you are comparing weapons, stat spreads, or rotation shape first, because each question needs different variables held constant."}</li>
              <li>{isZh ? "尽量用接近实战的循环段数和时间，不要只拿理想单段倍率做判断。" : "Use a rotation length and hit count that resemble real gameplay instead of judging from a perfect single-hit multiplier alone."}</li>
              <li>{isZh ? "敌人抗性、防御和队伍增益最好也按常见实战场景去设，而不是全部填满理想值。" : "Set resistance, defense, and team buffs to something close to normal combat instead of maxing every ideal assumption."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "只看理论暴击大数字，却忽略平均伤害和循环时间。" : "Focusing on one huge crit number while ignoring average damage and rotation time."}</li>
              <li>{isZh ? "为了让数字更好看，把所有敌人参数和团队增益都设成最理想状态。" : "Setting every enemy parameter and team buff to the most favorable case just to inflate the result."}</li>
              <li>{isZh ? "把估算器结果当成绝对真值，不再回头看实战手感与容错。" : "Treating the estimate like absolute truth and forgetting to test comfort, consistency, and real execution."}</li>
            </ul>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <h2 className="text-sm font-semibold mb-3">{isZh ? "选择角色" : "Character"}</h2>
                <select
                  value={selectedChar}
                  onChange={(e) => handleCharChange(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50"
                >
                  <option value="">{isZh ? "选择角色..." : "Select..."}</option>
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
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg">
                      {char.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{isZh ? char.name : char.nameEn}</p>
                      <div className="flex gap-2 mt-0.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getAttributeColor(char.attribute)}`}>
                          {getAttributeLabel(char.attribute, lang)}
                        </span>
                        <span className="text-[10px] text-gray-500">{isZh ? char.role : char.roleEn}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <h2 className="text-sm font-semibold mb-3">{isZh ? "选择武器" : "Weapon"}</h2>
                <select
                  value={selectedWeapon}
                  onChange={(e) => setSelectedWeapon(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50"
                >
                  <option value="">{isZh ? "选择武器..." : "Select..."}</option>
                  {weapons
                    .filter((entry) => !char || entry.type === char.arcType || entry.rank === "S")
                    .map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {isZh ? entry.name : entry.nameEn} ({entry.rank}) ATK {entry.baseAtk}
                      </option>
                    ))}
                </select>
                {weapon && (
                  <p className="text-[10px] text-gray-400 mt-2">
                    ATK {weapon.baseAtk} · {weapon.type}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">{isZh ? "配装预设" : "Build Presets"}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => applyPreset(preset)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-primary-400 hover:bg-gray-700 transition-colors"
                  >
                    {isZh ? preset.labelZh : preset.labelEn}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: isZh ? "攻击力%" : "ATK%", value: atkPct, set: setAtkPct, max: 200, color: "text-red-400" },
                  { label: isZh ? "暴击率%" : "CRIT Rate%", value: critRate, set: setCritRate, max: 100, color: "text-orange-400" },
                  { label: isZh ? "暴击伤害%" : "CRIT DMG%", value: critDmg, set: setCritDmg, max: 350, color: "text-yellow-400" },
                  { label: isZh ? "属性伤害%" : "Elem DMG%", value: elemDmg, set: setElemDmg, max: 200, color: "text-purple-400" },
                  { label: isZh ? "配队加成%" : "Team Bonus%", value: teamBonus, set: setTeamBonus, max: 100, color: "text-green-400" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <label className="text-xs text-gray-400 block mb-1">{stat.label}</label>
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
                        className={`w-14 bg-gray-800 border border-gray-700 rounded px-1.5 py-1 text-xs text-white text-center focus:outline-none focus:border-primary-500/50 ${stat.color}`}
                        min={0}
                        max={stat.max}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">{isZh ? "技能/循环设置" : "Skill / Rotation"}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {SKILL_PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => applySkillPreset(preset.key)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      skillPreset === preset.key
                        ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                        : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {isZh ? preset.labelZh : preset.labelEn}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">{isZh ? "技能倍率%" : "Skill Mult%"}</label>
                  <input
                    type="number"
                    value={skillMult}
                    onChange={(e) => setSkillMult(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">{isZh ? "循环段数" : "Hits"}</label>
                  <input
                    type="number"
                    value={comboHits}
                    onChange={(e) => setComboHits(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
                    min={1}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">{isZh ? "循环时间(秒)" : "Time (s)"}</label>
                  <input
                    type="number"
                    value={comboTime}
                    onChange={(e) => setComboTime(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
                    min={1}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">{isZh ? "敌人设定" : "Enemy Settings"}</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">{isZh ? "抗性减免%" : "Resistance%"}</label>
                  <input
                    type="number"
                    value={enemyResist}
                    onChange={(e) => setEnemyResist(Math.max(-50, Math.min(80, Number(e.target.value))))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
                    min={-50}
                    max={80}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">{isZh ? "防御减免%" : "DEF Reduction%"}</label>
                  <input
                    type="number"
                    value={enemyDef}
                    onChange={(e) => setEnemyDef(Math.max(0, Math.min(80, Number(e.target.value))))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
                    min={0}
                    max={80}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-primary-500/30 bg-gradient-to-br from-primary-900/40 to-gray-900/60 p-5">
              <h2 className="text-sm font-semibold text-primary-400 mb-1">
                {isZh ? "每秒伤害 (DPS)" : "Damage Per Second"}
              </h2>
              <p className="text-4xl font-bold font-mono text-white">
                {result.dps.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isZh ? `循环总伤害: ${result.rotationDmg.toLocaleString()} / ${comboTime}s` : `Rotation: ${result.rotationDmg.toLocaleString()} / ${comboTime}s`}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">{isZh ? "伤害明细" : "Damage Breakdown"}</h2>
              <div className="space-y-2.5">
                <DmgRow label={isZh ? "总攻击力" : "Total ATK"} value={result.totalAtk.toLocaleString()} color="text-red-400" />
                <DmgRow label={isZh ? "单段平均伤害" : "Avg Hit Damage"} value={result.skillDmg.toLocaleString()} color="text-primary-400" />
                <DmgRow label={isZh ? "暴击伤害" : "Critical Hit"} value={result.critDmg.toLocaleString()} color="text-orange-400" />
                <DmgRow label={isZh ? "非暴击伤害" : "Non-Crit Hit"} value={result.nonCritDmg.toLocaleString()} color="text-gray-400" />
                <div className="border-t border-gray-800 pt-2">
                  <DmgRow label={isZh ? "循环总伤害" : "Rotation Total"} value={result.rotationDmg.toLocaleString()} color="text-yellow-400" bold />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">{isZh ? "倍率拆解" : "Multiplier Breakdown"}</h2>
              <div className="space-y-2">
                <MultBar label={isZh ? "攻击加成" : "ATK Bonus"} pct={result.breakdown.atkContrib} color="bg-red-500" />
                <MultBar label={isZh ? "暴击收益" : "Crit Gain"} pct={result.breakdown.critContrib} color="bg-orange-500" />
                <MultBar label={isZh ? "属性加成" : "Elem Bonus"} pct={result.breakdown.elemContrib} color="bg-purple-500" />
                <MultBar label={isZh ? "配队加成" : "Team Bonus"} pct={result.breakdown.teamContrib} color="bg-green-500" />
              </div>
              <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center">
                <span className="text-xs text-gray-300">{isZh ? "总倍率" : "Total Mult"}</span>
                <span className="text-sm font-mono font-bold text-primary-400">x{result.totalMult}</span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800/50 bg-gray-900/30 p-3">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                {isZh
                  ? "公式: DPS = (总ATK × 技能倍率 × 暴击期望 × 属性加成 × 配队加成 × 防御系数 × 抗性系数) × 段数 / 循环时间"
                  : "Formula: DPS = (Total ATK × Skill Mult × Crit Avg × Elem × Team × DEF × Resist) × Hits / Time"}
              </p>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "比较输出时先看什么" : "How to compare outputs well"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "先固定技能倍率和循环时间，不然两次结果没有可比性。" : "Keep skill multipliers and rotation time consistent or the comparison loses meaning."}</li>
              <li>{isZh ? "再看暴击、属性伤和队伍增益是谁在拉高总乘区。" : "Then see whether crit, elemental bonus, or team buffs are driving the gain."}</li>
              <li>{isZh ? "如果提升只体现在理想站桩环境，实战价值可能没那么高。" : "If the gain only exists in an ideal stationary setup, real value may be much lower."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "这类结果的边界" : "Limits of this result"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "它不能完整覆盖实战中的位移、停手、怪物机制和失误。" : "It does not fully capture movement, downtime, enemy mechanics, or execution errors."}</li>
              <li>{isZh ? "版本更新、倍率调整或隐藏机制变化都会影响结论。" : "Patch changes to multipliers or hidden mechanics can change the conclusion."}</li>
              <li>{isZh ? "高 DPS 不一定等于更好通关体验，生存和循环顺手度也很关键。" : "Higher DPS does not always mean smoother clears if survivability or rotation comfort suffers."}</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}

function DmgRow({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-sm font-mono ${color} ${bold ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

function MultBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300 font-mono">+{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-300`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}
