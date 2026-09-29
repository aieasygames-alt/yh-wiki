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
    "用站内固定材料表估算异环角色的等级区间需求；当前等级上限、材料数量与获取状态请以客户端为准。",
    "Estimate NTE level-range needs from fixed site-held material tables; verify current level caps, quantities, and availability in the client."
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
        description={isZhLocale(locale) ? "基于固定本地材料表的角色升级估算工具；不验证当前客户端材料" : "Character level estimate from fixed local material tables; it does not verify current client materials"}
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
              ? "它适合把你输入的等级区间映射到站内固定材料表，先看出本地估算缺口。它不读取当前客户端，不能确认等级上限、材料数量、掉落、活动或体力效率；实际操作前请逐项核对游戏内信息。"
              : "It maps your entered level range to fixed site-held material tables so you can inspect a local estimate. It does not read the current client and cannot confirm level caps, quantities, drops, events, or stamina efficiency; verify every item in-game before acting."}
          </p>
        </div>
      </section>

      {/* Static example table for crawlers — hidden visually for users who see the interactive calculator */}
      <div className="sr-only">
        <h2>{isZhLocale(locale) ? "历史本地材料表：S级角色 1→60级示例" : "Historical Local Material Table: S-Rank 1→60 Examples"}</h2>
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
              <li>{isZhLocale(locale) ? "先按你的当前副本目标和账号缺口确定投入顺序，不使用角色评级替代实际需求。" : "Set investment order from your current content goal and roster gap instead of using rank labels as a substitute for actual needs."}</li>
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
              <li>{isZhLocale(locale) ? "当前版本的等级上限、材料数量和可获取状态应以客户端显示为准。" : "Use the client display as the source of truth for current level caps, material quantities, and availability."}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
