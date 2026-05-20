import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { WebApplicationJsonLd } from "../../../components/JsonLd";
import { TeamBuilderClient } from "./TeamBuilderClient";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const title = isZh
    ? (locale === "tw" ? "異環配隊模擬器 — 最佳隊伍組建工具" : "异环配队模拟器 — 最佳队伍组建工具")
    : "NTE Team Builder — Best Team Composition Tool";
  const description = isZh
    ? (locale === "tw" ? "異環配隊模擬器：選擇角色，分析共鳴效果，生成最佳隊伍搭配。支持屬性共鳴、角色協同分析。" : "异环配队模拟器：选择角色，分析共鸣效果，生成最佳队伍搭配。支持属性共鸣、角色协同分析。")
    : "Build the best Neverness to Everness teams. Analyze synergy, resonance effects, and role coverage for optimal team compositions.";

  return {
    title,
    description,
    alternates: hreflangAlternates("team-builder", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function TeamBuilderPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <>
      <WebApplicationJsonLd
        name={isZhLocale(locale) ? "异环配队模拟器" : "NTE Team Builder"}
        description="Interactive team composition builder for Neverness to Everness"
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "teamBuilder.title") },
        ]}
      />
      <TeamBuilderClient lang={lang} />
    </>
  );
}
