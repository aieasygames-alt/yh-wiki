import { isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../../lib/i18n";
import { getAvailableCharacters, calculateMaterials } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { WebApplicationJsonLd } from "../../../../components/JsonLd";
import { LevelingCalcClient } from "./LevelingCalcClient";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = isZhLocale(locale)
    ? (locale === "tw" ? "異環角色升級計算器" : "异环角色升级计算器")
    : "NTE Leveling Calculator — Plan Character Upgrade Materials";
  const description = isZhLocale(locale)
    ? "计算异环角色升级所需材料数量，支持全角色查询。"
    : "Calculate exact materials needed to level up any NTE character. Plan your farming route efficiently.";
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

  // Pre-compute a static example table for SEO / AI crawlers
  const sRankChars = getAvailableCharacters().filter((c) => c.rank === "S").slice(0, 5);
  const exampleRows = sRankChars.map((c) => {
    const mats = calculateMaterials(c.id, 1, 60);
    const matNames = mats.slice(0, 4).map((m) => `${m.name} ×${m.total}`);
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

      <LevelingCalcClient />
    </>
  );
}
