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
  const sRankCount = characters.filter((character) => character.rank === "S").length;
  const title = isZhLocale(locale)
    ? (locale === "tw"
      ? `異環聲優一覽 — 全${count}位角色日配/中配/英配聲優名單 | NTE Guide`
      : `异环声优一览 — 全${count}位角色日配/中配/英配声优名单 | NTE Guide`)
    : `NTE Voice Actors — Full JP/CN/EN Voice Cast for All ${count} Characters`;
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? `異環（NTE）全角色聲優名單：整理 ${count} 位角色的日配、中文與英文配音資訊，包含 ${sRankCount} 位 S 級角色與主要可玩角色的配音陣容。`
      : `异环（NTE）全角色声优名单：整理 ${count} 位角色的日配、中文与英文配音信息，包含 ${sRankCount} 位 S 级角色与主要可玩角色的配音阵容。`)
    : `Complete Neverness to Everness voice actor list for ${count} characters, including ${sRankCount} S-rank units with Japanese, Chinese, and English cast references.`;
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
        description={isZhLocale(locale)
          ? (locale === "tw"
            ? `整理全${count}位異環角色的日配、中文與英文聲優名單`
            : `整理全${count}位异环角色的日配、中文与英文声优名单`)
          : `Complete voice actor list for all ${count} NTE characters`}
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
            ? (locale === "tw"
              ? "以下整理異環（Neverness to Everness）全部角色的日文配音、中文配音與英文配音演員資訊。"
              : "以下列出异环（Neverness to Everness）全部角色的日文配音、中文配音和英文配音演员信息。")
            : "Full voice cast for all Neverness to Everness characters — Japanese (JP), Chinese (CN), and English (EN) voice actors."}
        </p>

        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale)
              ? (locale === "tw" ? "這頁聲優表最適合怎麼看？" : "这页声优表最适合怎么用？")
              : "How should you use this voice-actor list?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? (locale === "tw"
                  ? "先用這頁快速確認角色的日配、英配與稀有度，再進角色單頁查看技能、Build 與配隊。這份名單最適合查配音陣容與對照角色，不適合單靠聲優資訊判斷角色培養價值。"
                  : "先用这页快速确认角色的日配、英配与稀有度，再进角色单页查看技能、Build 与配队。这份名单最适合查配音阵容与对照角色，不适合单靠声优信息判断角色培养价值。")
              : "Use this page to quickly confirm JP and EN cast credits alongside rarity, then jump to the character guide for kits, builds, and teams. This list is best for cast lookup and comparison, not for deciding account investment based on voice actors alone."}
          </p>
        </section>

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

        <section className="my-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "查聲優前先看什麼" : "查声优前先看什么")
                : "What should you check before using this cast list?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "先確認你要找的是角色配音、語言版本，還是想反查某位聲優參與了哪些角色。" : "先确认你要找的是角色配音、语言版本，还是想反查某位声优参与了哪些角色。") : "Know whether you are looking up a specific character, a language track, or trying to reverse-search a cast member across characters."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "標記 TBA 的角色代表資訊仍待補完，最好不要把空白欄位當成正式缺失。" : "标记 TBA 的角色代表信息仍待补完，最好不要把空白栏位当成正式缺失。") : "Treat TBA entries as pending data rather than confirmed missing cast information."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "如果你是從角色喜好切入，配合角色圖鑑頁一起看會更完整。" : "如果你是从角色喜好切入，配合角色图鉴页一起看会更完整。") : "If you are exploring from character preference, combine this page with the character index for better context."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "常見誤區" : "常见误区")
                : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "把聲優表當成角色強度或抽卡建議頁。" : "把声优表当成角色强度或抽卡建议页。") : "Using the cast list as if it were a tier list or pull-priority guide."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "只看單一語言欄位，忽略角色在其他語言版本的配音資訊。" : "只看单一语言栏位，忽略角色在其他语言版本的配音信息。") : "Checking only one language column and missing the rest of the voice cast context."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "看到 TBA 就以為資料錯誤，沒有留意這類資訊本來就可能延後公開。" : "看到 TBA 就以为数据错误，没有留意这类信息本来就可能延后公开。") : "Assuming TBA means an error instead of recognizing that cast details can be announced later."}</li>
            </ul>
          </div>
        </section>

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
