import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import gachaSystemData from "../../../../data/gacha-system.json";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { FaqSection } from "../../../../components/FaqSection";
import { FaqPageJsonLd } from "../../../../components/JsonLd";
import { localizedText } from "../../../../lib/seo-copy";

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
  const title = localizedText(
    locale,
    "异环抽卡系统详解 — 保底机制、概率分析与抽卡策略 | NTE Guide",
    "NTE Gacha System — Rates, Pity & Best Pull Strategy | NTE Guide",
    "異環抽卡系統完整解析 — 保底、機率與抽取規劃 | NTE Guide"
  );
  const description = localizedText(
    locale,
    "全面解析异环(NTE)抽卡系统：无50/50机制、90抽保底、新手20抽自选、概率分析与零氪最优抽卡策略。",
    "Complete guide to Neverness to Everness gacha system: no 50/50, 90-pull pity, beginner 20-pull selector, rates analysis and F2P strategy.",
    "繁中玩家適用的異環(NTE)抽卡指南：整理無50/50、90抽保底、新手20抽自選、卡池機率與無課抽取優先順序。"
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("guides/gacha-system", lang),
    openGraph: { title, description, type: "article" },
  };
}

interface Banner {
  id: string;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
  sRate: string;
  aRate: string;
  bRate: string;
  hardPity: number;
  softPity: number | null;
  avgPity: number;
  no5050: boolean;
  maxPulls?: number;
  oneTimeOnly?: boolean;
  selectorAt?: number;
  pityFeatured?: number;
}

export default async function GachaSystemPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const banners = gachaSystemData.banners as Banner[];
  const faqs = gachaSystemData.faqs;

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.guides"), href: `/${lang}/guides` },
          {
            label: t(locale, "guideDetails.gachaSystemGuide"),
          },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* H1 */}
        <h1 className="text-2xl font-bold mb-6">
          {t(locale, "guideDetails.gachaSystemH1")}
        </h1>
        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
          {t(locale, "guideDetails.gachaSystemIntro")}
        </p>

        {/* Banner Types */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {t(locale, "gachaSystem.bannerTypesOverview")}
          </h2>
          <div className="space-y-4">
            {banners.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-gray-800 bg-gray-900/30 p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">
                    {isZhLocale(locale) ? b.nameZh : b.nameEn}
                  </h3>
                  {b.no5050 && (
                    <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400">
                      {t(locale, "gachaSystem.no5050")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {isZhLocale(locale) ? b.descZh : b.descEn}
                </p>
                <div className="grid grid-cols-3 gap-3 text-center text-sm mb-3">
                  <div className="rounded bg-gray-800/50 p-2">
                    <div className="text-yellow-400 font-bold">{b.sRate}</div>
                    <div className="text-xs text-gray-500">
                      {t(locale, "gachaSystem.sRank")}
                    </div>
                  </div>
                  <div className="rounded bg-gray-800/50 p-2">
                    <div className="text-purple-400 font-bold">{b.aRate}</div>
                    <div className="text-xs text-gray-500">
                      {t(locale, "gachaSystem.aRank")}
                    </div>
                  </div>
                  <div className="rounded bg-gray-800/50 p-2">
                    <div className="text-blue-400 font-bold">{b.bRate}</div>
                    <div className="text-xs text-gray-500">
                      {t(locale, "gachaSystem.bRank")}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span>
                    {t(locale, "gachaSystem.hardPity")}:{" "}
                    <strong className="text-white">{b.hardPity}</strong>
                  </span>
                  {b.softPity && (
                    <span>
                      {t(locale, "gachaSystem.softPity")}:{" "}
                      <strong className="text-white">{b.softPity}</strong>
                    </span>
                  )}
                  <span>
                    {t(locale, "gachaSystem.avgPulls")}:{" "}
                    <strong className="text-white">{b.avgPity}</strong>
                  </span>
                  {b.maxPulls && (
                    <span>
                      {t(locale, "gachaSystem.maxPulls")}:{" "}
                      <strong className="text-white">{b.maxPulls}</strong>
                    </span>
                  )}
                  {b.selectorAt && (
                    <span>
                      {t(locale, "gachaSystem.selectorAt")}:{" "}
                      <strong className="text-white">{b.selectorAt}</strong>
                    </span>
                  )}
                  {b.pityFeatured && (
                    <span>
                      {t(locale, "gachaSystem.featuredPity")}:{" "}
                      <strong className="text-white">{b.pityFeatured}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pity System */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {t(locale, "gachaSystem.pitySystemExplained")}
          </h2>
          <div className="text-gray-300 text-sm space-y-4 leading-relaxed">
            <p>
              {t(locale, "gachaSystem.pityPara1")}
            </p>
            <p>
              {t(locale, "gachaSystem.pityPara2")}
            </p>
            <p>
              {t(locale, "gachaSystem.pityPara3")}
            </p>
          </div>
        </section>

        {/* Gacha Strategy */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {t(locale, "gachaSystem.bestGachaStrategy")}
          </h2>
          <div className="space-y-3">
            {(
              [
                { step: "1", title: t(locale, "gachaSystem.step1Title"), desc: t(locale, "gachaSystem.step1Desc") },
                { step: "2", title: t(locale, "gachaSystem.step2Title"), desc: t(locale, "gachaSystem.step2Desc") },
                { step: "3", title: t(locale, "gachaSystem.step3Title"), desc: t(locale, "gachaSystem.step3Desc") },
                { step: "4", title: t(locale, "gachaSystem.step4Title"), desc: t(locale, "gachaSystem.step4Desc") },
              ]
            ).map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-lg border border-gray-800 bg-gray-900/30 p-4"
              >
                <div className="w-8 h-8 rounded-full bg-primary-600/20 text-primary-400 flex items-center justify-center text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {t(locale, "guideDetails.faqTitle")}
          </h2>
          <FaqSection faqs={faqs} locale={locale} />
          <FaqPageJsonLd faqs={faqs} lang={locale} />
        </section>

        {/* Internal Links */}
        <section className="mt-10 border-t border-gray-800 pt-6">
          <h2 className="text-lg font-bold mb-4">
            {t(locale, "guideDetails.relatedContent")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              [
                { label: t(locale, "gachaSystem.linkTierList"), href: `/${lang}/tier-list` },
                { label: t(locale, "gachaSystem.linkGachaSim"), href: `/${lang}/gacha` },
                { label: t(locale, "gachaSystem.linkBeginnerGuide"), href: `/${lang}/guides/beginner-quick-start` },
              ]
            ).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
              >
                <span className="text-sm">{link.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
