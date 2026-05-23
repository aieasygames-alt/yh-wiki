"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { getAllCharacters, getAllWeapons } from "../../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../../lib/attributes";
import { isZhLocale, Locale } from "../../../../lib/i18n";

/* ── Damage calculation engine ── */
interface DPSInput {
  baseAtk: number;
  weaponAtk: number;
  atkPct: number;
  flatAtk: number;
  critRate: number;
  critDmg: number;
  elemDmg: number;
  skillMult: number;      // skill multiplier %
  resistMult: number;      // enemy resistance modifier (0.9 = 10% resist)
  defMult: number;         // defense multiplier (typically 0.5-0.6)
  teamBonus: number;       // team buff bonus %
  comboHits: number;       // number of hits in rotation
  comboTime: number;       // seconds for full rotation
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
    critAvgMult: Math.round(critAvgMult * 100) / 100,
    totalMult: Math.round(critAvgMult * elemMult * teamMult * 100) / 100,
    breakdown: {
      atkContrib: Math.round(totalAtk / (i.baseAtk + i.weaponAtk) * 100),
      critContrib: Math.round((critAvgMult - 1) * 100),
      elemContrib: Math.round((elemMult - 1) * 100),
      teamContrib: Math.round((teamMult - 1) * 100),
    },
  };
}

/* ── Preset builds ── */
const PRESETS = [
  { key: "dps-crit", labelZh: "暴击输出", labelEn: "Crit DPS", atkPct: 46.6, critRate: 75, critDmg: 150, elemDmg: 46.6, teamBonus: 20 },
  { key: "dps-balanced", labelZh: "均衡输出", labelEn: "Balanced DPS", atkPct: 46.6, critRate: 50, critDmg: 100, elemDmg: 46.6, teamBonus: 10 },
  { key: "dps-atk", labelZh: "攻击特化", labelEn: "ATK Focus", atkPct: 93.2, critRate: 32.4, critDmg: 64.8, elemDmg: 38.8, teamBonus: 0 },
  { key: "dps-elem", labelZh: "属性特化", labelEn: "Elemental", atkPct: 23.3, critRate: 32.4, critDmg: 64.8, elemDmg: 93.2, teamBonus: 15 },
];

/* ── Skill presets (typical multipliers per skill type) ── */
const SKILL_PRESETS = [
  { key: "normal", labelZh: "普攻单段", labelEn: "Normal (1 hit)", mult: 80, hits: 5, time: 3 },
  { key: "skill", labelZh: "战技", labelEn: "Skill", mult: 250, hits: 1, time: 2 },
  { key: "ultimate", labelZh: "终结技", labelEn: "Ultimate", mult: 500, hits: 3, time: 4 },
  { key: "combo-short", labelZh: "短循环 (12s)", labelEn: "Short Rotation (12s)", mult: 200, hits: 8, time: 12 },
  { key: "combo-long", labelZh: "长循环 (20s)", labelEn: "Long Rotation (20s)", mult: 180, hits: 15, time: 20 },
  { key: "custom", labelZh: "自定义", labelEn: "Custom", mult: 200, hits: 5, time: 10 },
];

export default function DPSCalculatorPage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "en") as Locale;
  const isZh = isZhLocale(lang);

  const allChars = useMemo(() => getAllCharacters(), []);
  const allWeapons = useMemo(() => getAllWeapons(), []);

  // Selections
  const [selectedChar, setSelectedChar] = useState("");
  const [selectedWeapon, setSelectedWeapon] = useState("");
  const [skillPreset, setSkillPreset] = useState("combo-short");

  // Stat inputs
  const [atkPct, setAtkPct] = useState(46.6);
  const [critRate, setCritRate] = useState(50);
  const [critDmg, setCritDmg] = useState(100);
  const [elemDmg, setElemDmg] = useState(46.6);
  const [teamBonus, setTeamBonus] = useState(10);

  // Skill inputs
  const [skillMult, setSkillMult] = useState(200);
  const [comboHits, setComboHits] = useState(8);
  const [comboTime, setComboTime] = useState(12);

  // Enemy
  const [enemyResist, setEnemyResist] = useState(10);
  const [enemyDef, setEnemyDef] = useState(50);

  const char = allChars.find((c) => c.id === selectedChar);
  const weapon = allWeapons.find((w) => w.id === selectedWeapon);

  const baseAtk = 200; // default character base
  const weaponAtk = weapon?.baseAtk || 0;

  // Auto-select signature weapon
  const handleCharChange = (charId: string) => {
    setSelectedChar(charId);
    if (charId) {
      const c = allChars.find((ch) => ch.id === charId);
      if (c?.signatureArc) {
        const sig = allWeapons.find((w) => w.id === c.signatureArc);
        if (sig) setSelectedWeapon(sig.id);
      }
    }
  };

  // Apply build preset
  const applyPreset = (p: typeof PRESETS[number]) => {
    setAtkPct(p.atkPct);
    setCritRate(p.critRate);
    setCritDmg(p.critDmg);
    setElemDmg(p.elemDmg);
    setTeamBonus(p.teamBonus);
  };

  // Apply skill preset
  const applySkillPreset = (key: string) => {
    setSkillPreset(key);
    const p = SKILL_PRESETS.find((s) => s.key === key);
    if (p && key !== "custom") {
      setSkillMult(p.mult);
      setComboHits(p.hits);
      setComboTime(p.time);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column: Inputs ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Character + Weapon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">{isZh ? "选择角色" : "Character"}</h2>
              <select
                value={selectedChar}
                onChange={(e) => handleCharChange(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50"
              >
                <option value="">{isZh ? "选择角色..." : "Select..."}</option>
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
                {allWeapons
                  .filter((w) => !char || w.type === char.arcType || w.rank === "S")
                  .map((w) => (
                    <option key={w.id} value={w.id}>
                      {isZh ? w.name : w.nameEn} ({w.rank}) ATK {w.baseAtk}
                    </option>
                  ))}
              </select>
              {weapon && (
                <p className="text-[10px] text-gray-400 mt-2">
                  ATK {weapon.baseAtk} · {isZh ? weapon.type : weapon.type}
                </p>
              )}
            </div>
          </div>

          {/* Build Presets */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
            <h2 className="text-sm font-semibold mb-3">{isZh ? "配装预设" : "Build Presets"}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => applyPreset(p)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-primary-400 hover:bg-gray-700 transition-colors"
                >
                  {isZh ? p.labelZh : p.labelEn}
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
              ].map((s) => (
                <div key={s.label}>
                  <label className="text-xs text-gray-400 block mb-1">{s.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={s.max}
                      step={0.1}
                      value={s.value}
                      onChange={(e) => s.set(Number(e.target.value))}
                      className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-500"
                    />
                    <input
                      type="number"
                      value={s.value}
                      onChange={(e) => s.set(Math.max(0, Math.min(s.max, Number(e.target.value))))}
                      className={`w-14 bg-gray-800 border border-gray-700 rounded px-1.5 py-1 text-xs text-white text-center focus:outline-none focus:border-primary-500/50 ${s.color}`}
                      min={0}
                      max={s.max}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill / Rotation */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
            <h2 className="text-sm font-semibold mb-3">{isZh ? "技能/循环设置" : "Skill / Rotation"}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {SKILL_PRESETS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => applySkillPreset(s.key)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    skillPreset === s.key
                      ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                      : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
                  }`}
                >
                  {isZh ? s.labelZh : s.labelEn}
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

          {/* Enemy Settings */}
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

        {/* ── Right Column: Results ── */}
        <div className="space-y-4">
          {/* DPS Result */}
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

          {/* Damage Breakdown */}
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

          {/* Multiplier Breakdown */}
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

          {/* Formula hint */}
          <div className="rounded-xl border border-gray-800/50 bg-gray-900/30 p-3">
            <p className="text-[10px] text-gray-500 leading-relaxed">
              {isZh
                ? "公式: DPS = (总ATK × 技能倍率 × 暴击期望 × 属性加成 × 配队加成 × 防御系数 × 抗性系数) × 段数 / 循环时间"
                : "Formula: DPS = (Total ATK × Skill Mult × Crit Avg × Elem × Team × DEF × Resist) × Hits / Time"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
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
