import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { getAvailableCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { FaqPageJsonLd, ArticleJsonLd } from "../../../components/JsonLd";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";
import { FaqSection } from "../../../components/FaqSection";
import { getAllFaqs } from "../../../lib/queries";

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
  const characters = getAvailableCharacters();
  const count = characters.length;
  const title = isZhLocale(locale)
    ? (locale === "tw"
      ? `異環聲優一覽 — 全${count}位角色日配/中配/英配聲優名單 | NTE Guide`
      : `异环声优一览 — 全${count}位角色日配/中配/英配声优名单 | NTE Guide`)
    : `NTE Voice Actors — Full JP/CN/EN Voice Cast for All ${count} Characters`;
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? `異環（NTE）全角色聲優名單：包含日文配音、中文配音、英文配音演員資訊。涵蓋安魂曲、娜娜莉、九原、哈索爾等全部角色。`
      : `异环（NTE）全角色声优名单：包含日文配音、中文配音、英文配音演员信息。涵盖安魂曲、娜娜莉、九原、哈索尔等全部角色。`)
    : `Complete Neverness to Everness voice actor list for all ${count} characters. Japanese, Chinese, and English voice cast including Lacrimosa, Nanally, Jiuyuan, Hathor and more.`;
  return {
    title,
    description,
    alternates: hreflangAlternates("voice-actors", lang),
    openGraph: { title, description, type: "article" },
  };
}

export default async function VoiceActorsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const characters = getAvailableCharacters();
  const count = characters.length;
  const allFaqs = getAllFaqs();
  const vaFaq = allFaqs.find((f) => f.id === "nte-voice-actors-guide");

  return (
    <>
      <ArticleJsonLd
        title={isZhLocale(locale) ? "异环声优一览" : "NTE Voice Actors — Full Voice Cast"}
        description={isZhLocale(locale) ? `全${count}位角色的日配/中配/英配声优名单` : `Complete voice actor list for all ${count} NTE characters`}
        url={`https://nteguide.com/${lang}/voice-actors`}
      />
      {vaFaq && (
        <FaqPageJsonLd
          faqs={[{ question: vaFaq.question, questionZh: vaFaq.question, answer: vaFaq.answer, answerZh: vaFaq.answer }]}
          lang={locale}
        />
      )}
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZhLocale(locale) ? (locale === "tw" ? "聲優一覽" : "声优一览") : "Voice Actors" },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">
          {isZhLocale(locale)
            ? (locale === "tw" ? "異環聲優一覽 — 全角色配音員名單" : "异环声优一览 — 全角色配音员名单")
            : "NTE Voice Actors — Complete Voice Cast for All Characters"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isZhLocale(locale)
            ? "以下列出异环（Neverness to Everness）全部角色的日文配音、中文配音和英文配音演员信息。"
            : "Full voice cast for all Neverness to Everness characters — Japanese (JP), Chinese (CN), and English (EN) voice actors."}
        </p>

        {/* Quick Answer for Featured Snippet */}
        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZhLocale(locale) ? "配音语言：" : "Languages:",
              value: isZhLocale(locale) ? "日文、中文、英文全配音" : "Full voiceover in Japanese, Chinese & English",
            },
            {
              label: isZhLocale(locale) ? "角色总数：" : "Characters:",
              value: `${characters.length}`,
            },
          ]}
        />

        {/* Voice Actor Table */}
        <section className="mb-10">
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">
                    {isZhLocale(locale) ? "角色" : "Character"}
                  </th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">
                    {isZhLocale(locale) ? "等级" : "Rank"}
                  </th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">JP VA</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">EN VA</th>
                </tr>
              </thead>
              <tbody>
                {characters
                  .sort((a, b) => {
                    const rankOrder: Record<string, number> = { S: 0, A: 1, B: 2 };
                    return (rankOrder[a.rank] ?? 9) - (rankOrder[b.rank] ?? 9);
                  })
                  .map((c) => (
                  <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                    <td className="py-3 px-4">
                      <Link
                        href={`/${lang}/characters/${c.id}`}
                        className="text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        {isZhLocale(locale) ? c.name : c.nameEn}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        c.rank === "S" ? "bg-yellow-900/30 text-yellow-400" : "bg-purple-900/30 text-purple-400"
                      }`}>
                        {c.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{c.cvJpEn || "TBA"}</td>
                    <td className="py-3 px-4 text-gray-400">{c.cvEn || "TBA"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            {isZhLocale(locale)
              ? "注：标注 TBA 的声优信息待官方确认，将随版本更新补充。"
              : "Note: Voice actors marked TBA are pending official confirmation and will be updated."}
          </p>
        </section>

        {/* FAQ */}
        {vaFaq && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              {isZhLocale(locale) ? "常见问题" : "FAQ"}
            </h2>
            <FaqSection
              faqs={[{
                question: vaFaq.question,
                questionZh: vaFaq.question,
                answer: vaFaq.answer,
                answerZh: vaFaq.answer,
              }]}
              locale={locale}
            />
          </section>
        )}

        {/* Related Links */}
        <section className="mt-10 border-t border-gray-800 pt-6">
          <h2 className="text-lg font-bold mb-4">
            {isZhLocale(locale) ? "相关内容" : "Related Content"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: isZhLocale(locale) ? "角色一览" : "All Characters", href: `/${lang}/characters` },
              { label: isZhLocale(locale) ? "强度排行" : "Tier List", href: `/${lang}/tier-list` },
              { label: isZhLocale(locale) ? "新手指南" : "Beginner Guide", href: `/${lang}/guides/beginner-quick-start` },
            ].map((link) => (
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
