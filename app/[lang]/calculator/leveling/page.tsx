import { isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../../lib/i18n";
import {
  getAvailableCharacters,
  calculateMaterials,
  getMaterialById,
  getAllMaterials,
  getCharacterMaterials,
} from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { WebApplicationJsonLd } from "../../../../components/JsonLd";
import { LevelingCalcClient } from "./LevelingCalcClient";
import { localizedText } from "../../../../lib/seo-copy";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = isZhLocale(locale)
    ? (locale === "tw" ? "異環角色升級計算器" : "异环角色升级计算器")
    : "NTE Leveling Calculator — Plan Character Upgrade Materials";
  const description = localizedText(
    locale,
    "计算异环角色升级所需材料数量，支持全角色查询、当前/目标等级设置、素材汇总和刷取规划，帮助你提前安排养成路线。",
    "Calculate exact materials needed to level up any NTE character. Supports current and target levels, material totals, farming route planning, and efficient upgrade preparation."
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("calculator/leveling", lang),
    openGraph: { title, description, type: "website" },
  };
}

export default async function LevelingCalcPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const availableCharacters = getAvailableCharacters();
  const calculatorCharacters = availableCharacters.map((character) => ({
    id: character.id,
    name: character.name,
    nameEn: character.nameEn,
    rank: character.rank,
    attribute: character.attribute,
    weapon: character.weapon,
    weaponEn: character.weaponEn,
    image: character.image,
  }));
  const materialsById = Object.fromEntries(
    getAllMaterials().map((material) => [
      material.id,
      {
        id: material.id,
        name: material.name,
        nameEn: material.nameEn,
        rarity: material.rarity,
      },
    ])
  );
  const characterMaterialsById = Object.fromEntries(
    availableCharacters
      .map((character) => {
        const materials = getCharacterMaterials(character.id);
        return materials ? [character.id, materials] : null;
      })
      .filter(Boolean) as Array<[string, NonNullable<ReturnType<typeof getCharacterMaterials>>]>
  );

  // Pre-compute a static example table for SEO / AI crawlers
  const sRankChars = availableCharacters.filter((c) => c.rank === "S").slice(0, 5);
  const exampleRows = sRankChars.map((c) => {
    const mats = calculateMaterials(c.id, 1, 60);
    const matNames = mats.slice(0, 4).map((m) => {
      const mat = getMaterialById(m.materialId);
      return `${mat ? (isZhLocale(locale) ? mat.name : mat.nameEn) : m.materialId} ×${m.quantity}`;
    });
    return { name: isZhLocale(locale) ? c.name : c.nameEn, mats: matNames.join(", ") };
  });

  return (
    <>
      <WebApplicationJsonLd
        name={isZhLocale(locale) ? "异环升级计算器" : "NTE Leveling Calculator"}
        description={isZhLocale(locale) ? "计算角色升级材料" : "Calculate character leveling materials"}
      />
      <Breadcrumb
        items={[
          { label: isZhLocale(locale) ? "首页" : "Home", href: `/${lang}` },
          { label: isZhLocale(locale) ? "升级计算器" : "Leveling Calculator" },
        ]}
      />

      <section className="mx-auto max-w-5xl px-4 pt-6 pb-3">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale) ? "升级计算器最适合什么时候用？" : "When is this leveling calculator most useful?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? "当你准备拉新角色、卡在突破材料，或者想提前算清楚从当前等级升到目标等级到底差多少体力时，这个页面最有用。它适合先把资源缺口看清楚，再决定今天该刷经验、突破材料，还是先停下来补金币。"
              : "This calculator is most useful when you are raising a new character, blocked by ascension items, or trying to estimate how much farming separates the current level from the target one. It helps you see the resource gap first, then decide whether today should go into experience, ascension materials, or currency."}
          </p>
        </div>
      </section>

      {/* Static example table for crawlers — hidden visually for users who see the interactive calculator */}
      <div className="sr-only">
        <h2>{isZhLocale(locale) ? "S级角色 1→60级 升级材料概览" : "S-Rank Character Leveling Materials (1→60)"}</h2>
        <table>
          <thead>
            <tr>
              <th>{isZhLocale(locale) ? "角色" : "Character"}</th>
              <th>{isZhLocale(locale) ? "主要材料" : "Key Materials"}</th>
            </tr>
          </thead>
          <tbody>
            {exampleRows.map((r) => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td>{r.mats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LevelingCalcClient
        characters={calculatorCharacters}
        materialsById={materialsById}
        characterMaterialsById={characterMaterialsById}
      />

      <section className="mx-auto max-w-5xl px-4 pb-12 pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "规划升级时先看" : "Start here when planning levels"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "先确认目标等级够不够用，不一定每个角色都要第一时间满级。" : "Confirm whether the target level is actually necessary, because not every character needs to be maxed immediately."}</li>
              <li>{isZhLocale(locale) ? "主力输出通常比功能位更值得优先吃高等级材料。" : "Main damage dealers usually deserve high-level materials before pure utility slots."}</li>
              <li>{isZhLocale(locale) ? "升级材料之外，还要留意同步需要的金币或其他消耗。" : "Look beyond materials and remember the currency cost that comes with leveling."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "容易忽略的点" : "Easy things to overlook"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "升级完成不等于角色立刻可用，技能和装备往往还差一截。" : "Finishing levels does not mean the character is truly ready if skills and gear still lag behind."}</li>
              <li>{isZhLocale(locale) ? "多角色同时升级会放大稀有材料缺口。" : "Leveling several characters together magnifies rare-material bottlenecks."}</li>
              <li>{isZhLocale(locale) ? "版本前瞻若有新角色，当前刷本计划也要预留转向空间。" : "If a future patch introduces a target character, leave room to pivot your farming plan."}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
