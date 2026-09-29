import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import gachaSystemData from "../../../../data/gacha-system.json";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { FaqSection } from "../../../../components/FaqSection";
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
    "异环抽卡规则核验指南 — 保底、概率与预算前检查",
    "NTE Gacha Rule Check Guide — Pity, Rates & Budget Checks",
    "異環抽卡規則核驗指南 — 保底、機率與預算前檢查"
  );
  const description = localizedText(
    locale,
    "异环(NTE)抽卡前核对指南：查看目标区服当前卡池详情、概率、保底、继承、定轨与付费规则；历史数字仅供理解。",
    "NTE pre-pull check guide: verify the target server's current banner details, rates, pity, carry-over, path, and payment rules; historical figures are for context only.",
    "異環(NTE)抽卡前核對指南：查看目標伺服器目前卡池詳情、機率、保底、繼承、定軌與付費規則；歷史數字僅供理解。"
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
        <section className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
          <h2 className="text-lg font-semibold text-amber-100">
            {isZhLocale(locale)
              ? (locale === "tw" ? "抽卡或儲值前先核對目前規則" : "抽卡或充值前先核对当前规则")
              : "Verify current rules before pulling or spending"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? (locale === "tw"
                ? "本頁的卡池類型與數字屬於歷史理解參考，不保證適用於你的伺服器或目前版本。請在目標區服的遊戲內卡池詳情與官方公告中確認機率、保底、繼承、定軌、角色範圍與付費條款，再決定是否投入資源。"
                : "本页的卡池类型与数字属于历史理解参考，不保证适用于你的服务器或当前版本。请在目标区服的游戏内卡池详情与官方公告中确认概率、保底、继承、定轨、角色范围与付费条款，再决定是否投入资源。")
              : "Banner types and figures on this page are historical learning references and may not apply to your server or current version. Before committing resources, confirm rates, pity, carry-over, path rules, character pool, and payment terms in the target server's in-game banner details and official notices."}
          </p>
        </section>

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
                      {isZhLocale(locale) ? (locale === "tw" ? `歷史參考：${t(locale, "gachaSystem.no5050")}` : `历史参考：${t(locale, "gachaSystem.no5050")}`) : `Historical reference: ${t(locale, "gachaSystem.no5050")}`}
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
                    {isZhLocale(locale) ? "历史" : "Historical"} {t(locale, "gachaSystem.hardPity")}:{" "}
                    <strong className="text-white">{b.hardPity}</strong>
                  </span>
                  {b.softPity && (
                    <span>
                      {isZhLocale(locale) ? "历史" : "Historical"} {t(locale, "gachaSystem.softPity")}:{" "}
                      <strong className="text-white">{b.softPity}</strong>
                    </span>
                  )}
                  <span>
                    {isZhLocale(locale) ? "历史" : "Historical"} {t(locale, "gachaSystem.avgPulls")}:{" "}
                    <strong className="text-white">{b.avgPity}</strong>
                  </span>
                  {b.maxPulls && (
                    <span>
                      {isZhLocale(locale) ? "历史" : "Historical"} {t(locale, "gachaSystem.maxPulls")}:{" "}
                      <strong className="text-white">{b.maxPulls}</strong>
                    </span>
                  )}
                  {b.selectorAt && (
                    <span>
                      {isZhLocale(locale) ? "历史" : "Historical"} {t(locale, "gachaSystem.selectorAt")}:{" "}
                      <strong className="text-white">{b.selectorAt}</strong>
                    </span>
                  )}
                  {b.pityFeatured && (
                    <span>
                      {isZhLocale(locale) ? "历史" : "Historical"} {t(locale, "gachaSystem.featuredPity")}:{" "}
                      <strong className="text-white">{b.pityFeatured}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Historical rule boundary */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "如何阅读历史规则字段" : "How to read historical rule fields"}
          </h2>
          <div className="text-gray-300 text-sm space-y-4 leading-relaxed">
            <p>
              {isZhLocale(locale)
                ? "上方概率、保底、继承、定轨和兑换字段只记录了本站曾收录的规则版本。它们可以帮助识别旧公告或讨论对应的是哪类卡池，但不能证明当前卡池仍使用相同数值或机制。"
                : "The rate, pity, carry-over, path, and exchange fields above record a ruleset previously stored by this wiki. They can help identify which banner an old notice or discussion referred to, but do not prove that the current banner uses the same values or mechanics."}
            </p>
            <p>
              {isZhLocale(locale)
                ? "规则可能因服务器、版本、卡池类型、活动或付费条款而不同。尤其不要把历史的无 50/50、软保底、平均抽数、武器概率或继承关系直接用于当前预算。"
                : "Rules can differ by server, version, banner type, event, or payment terms. In particular, do not use historical no-50/50 claims, soft pity, average pulls, weapon rates, or carry-over rules directly for a current budget."}
            </p>
            <p>
              {isZhLocale(locale)
                ? "做任何抽取或付费决定前，请打开目标卡池的游戏内详情、概率和规则页，记录当前服务器、结束时间、角色范围、抽数、保底与兑换条件；官方公告仅用于补充解释。"
                : "Before any pull or payment decision, open the target banner's in-game Details, Rates, and Rules screens. Record the server, end time, character pool, pull count, pity, and exchange conditions; use official notices only as supporting context."}
            </p>
          </div>
        </section>

        {/* Verification workflow */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "当前卡池核验流程" : "Current banner verification workflow"}
          </h2>
          <div className="space-y-3">
            {(
              [
                { step: "1", title: isZhLocale(locale) ? "确认目标环境" : "Confirm the target environment", desc: isZhLocale(locale) ? "确认服务器、客户端版本和卡池结束时间；不要从历史日期或社区截图推断当前状态。" : "Confirm the server, client version, and banner end time. Do not infer current status from historical dates or community screenshots." },
                { step: "2", title: isZhLocale(locale) ? "读取游戏内详情" : "Read the in-game details", desc: isZhLocale(locale) ? "逐项确认角色范围、概率、保底、继承、定轨、兑换和付费规则。" : "Check the character pool, rates, pity, carry-over, path, exchange, and payment rules item by item." },
                { step: "3", title: isZhLocale(locale) ? "只记录已确认资源" : "Count only confirmed resources", desc: isZhLocale(locale) ? "预算只包含账户中已到账的资源与游戏内明确显示的奖励，不计入传闻、预测或过期福利。" : "Budget only resources already on the account and rewards explicitly shown in-game, excluding rumors, forecasts, or expired benefits." },
                { step: "4", title: isZhLocale(locale) ? "保留核验记录" : "Keep a verification record", desc: isZhLocale(locale) ? "截图或记录规则页日期，方便在版本更新后重新核对，而不是沿用旧攻略中的数字。" : "Save the rule-page date or screenshot so it can be checked again after an update instead of reusing figures from old guides." },
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
            {isZhLocale(locale) ? "历史问答记录" : "Historical FAQ records"}
          </h2>
          <FaqSection faqs={faqs} locale={locale} />
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
