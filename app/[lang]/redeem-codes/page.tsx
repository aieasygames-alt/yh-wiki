import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import redeemCodesData from "../../../data/redeem-codes.json";
import charactersData from "../../../data/characters.json";
import blogData from "../../../data/blog.json";
import { RedeemCodesClient } from "./RedeemCodesClient";

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
    ? (locale === "tw" ? "異環兌換碼狀態與領取入口｜區服、來源與複核資訊" : "异环兑换码状态与领取入口｜区服、来源与复核信息")
    : "NTE Redeem Code Status & Entry | Server, Source, and Review Details";
  const description = isZh
    ? (locale === "tw" ? "異環(NTE)兌換碼狀態參考：查看最後複核日期、來源、伺服器、獎勵與輸入入口；請以遊戲內領取結果為準。" : "异环(NTE)兑换码状态参考：查看最后复核日期、来源、服务器、奖励与输入入口；请以游戏内领取结果为准。")
    : "NTE redeem-code status reference with the last review date, sources, servers, rewards, and redemption steps. Verify every claim in-game.";

  return {
    title,
    description,
    alternates: hreflangAlternates("redeem-codes", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function RedeemCodesPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const redeemCodeDataset = redeemCodesData as {
    reviewedAt: string;
    codes: Array<{
      code: string;
      reward: string;
      rewardEn: string;
      status: "active" | "expired" | "unknown";
      expiresAt: string;
      source: string;
      region: "cn" | "global";
      revealedAt?: string;
    }>;
  };
  const codes = redeemCodeDataset.codes;
  const topChars = (charactersData as Array<{
    id: string;
    name: string;
    nameEn: string;
    attribute: string;
    tierRank?: string;
    image?: string;
  }>).filter((character) => character.tierRank === "SS" || character.tierRank === "S+").slice(0, 8);
  const latestPosts = [...(blogData as Array<{
    id: string;
    title: string;
    titleEn: string;
    summary: string;
    summaryEn: string;
    category: string;
    categoryEn: string;
    date: string;
  }>)]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const activeCodes = codes.filter((code) => code.status === "active").map((code) => code.code);
  const activeCodesLabel = activeCodes.join(", ");
  const faqs = isZhLocale(locale)
    ? [
        { question: "异环现在有哪些标记为有效的兑换码？", questionZh: "异环现在有哪些标记为有效的兑换码？", answer: `本站当前标记为有效的代码：${activeCodesLabel || "暂无已验证代码"}。兑换前请在本页核对区服、状态和游戏内结果；TBA 不代表永久有效。`, answerZh: `本站当前标记为有效的代码：${activeCodesLabel || "暂无已验证代码"}。兑换前请在本页核对区服、状态和游戏内结果；TBA 不代表永久有效。` },
        { question: "异环兑换码在哪里输入？", questionZh: "异环兑换码在哪里输入？", answer: "进入游戏后，点击右上角头像 → 设置 → 兑换码输入框，输入本页标记为有效的代码。奖励到账前不要把代码收益计入抽卡预算。", answerZh: "进入游戏后，点击右上角头像 → 设置 → 兑换码输入框，输入本页标记为有效的代码。奖励到账前不要把代码收益计入抽卡预算。" },
      ]
    : [
        { question: "Which NTE redeem codes are currently marked active?", questionZh: "Which NTE redeem codes are currently marked active?", answer: `This page currently marks these codes active: ${activeCodesLabel || "no verified codes"}. Verify server, status, and the in-game result before treating a code as pull income; TBA does not mean permanent.`, answerZh: `This page currently marks these codes active: ${activeCodesLabel || "no verified codes"}. Verify server, status, and the in-game result before treating a code as pull income; TBA does not mean permanent.` },
        { question: "How do I redeem NTE codes?", questionZh: "How do I redeem NTE codes?", answer: "Launch the game, tap your profile icon, open Settings, and enter a code marked active on this page. Confirm the reward in mail before changing your resource plan.", answerZh: "Launch the game, tap your profile icon, open Settings, and enter a code marked active on this page. Confirm the reward in mail before changing your resource plan." },
      ];

  return (
    <>
      <ArticleJsonLd
        title={isZhLocale(locale) ? "异环兑换码状态与领取入口" : "NTE Redeem Code Status & Entry"}
        description={isZhLocale(locale) ? "异环兑换码状态追踪：核对区服、有效状态、来源和领取结果" : "NTE redeem-code status tracker with server, verification, source, and claim checks"}
        url={`https://nteguide.com/${lang}/redeem-codes`}
      />
      <FaqPageJsonLd faqs={faqs} lang={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.redeemCodes") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 pt-2 pb-1">
        <p className="text-xs text-gray-500">
          {isZhLocale(locale)
            ? (locale === "tw" ? `最後複核：${redeemCodeDataset.reviewedAt}` : `最后复核：${redeemCodeDataset.reviewedAt}`)
            : `Last reviewed: ${redeemCodeDataset.reviewedAt}`}
        </p>
      </div>
      <section className="max-w-4xl mx-auto px-4 pb-4">
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale)
              ? (locale === "tw" ? "短時效活動碼怎麼判讀？" : "短时效活动码怎么判断？")
              : "How should you read short-lived event codes?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? (locale === "tw"
                ? "前瞻直播碼通常有效期很短；只有標記為有效且來源明確的碼才建議嘗試。待複核或失效碼僅保留作識別用途。"
                : "前瞻直播码通常有效期很短；只有标记为有效且来源明确的码才建议尝试。待复核或失效码仅保留作识别用途。")
              : "Livestream codes usually expire quickly. Only codes marked active with a clear source are recommended; watchlist and expired codes remain for identification only."}
          </p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-4">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale)
              ? (locale === "tw" ? "這頁兌換碼怎麼看最快？" : "这页兑换码怎么看最快？")
              : "What is the fastest way to use this codes page?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? (locale === "tw"
                ? "先看最後複核日期與有效標記，再按國際服或國服篩選。只有來源明確的有效碼才值得嘗試，並請在遊戲內確認獎勵。"
                : "先看最后复核日期与有效标记，再按国际服或国服筛选。只有来源明确的有效码才值得尝试，并请在游戏内确认奖励。")
              : "Start with the last review date and active status, then filter by Global or CN server. Try only source-backed active codes and confirm the reward in-game."}
          </p>
        </div>
      </section>
      <RedeemCodesClient lang={lang} codes={codes} topChars={topChars} latestPosts={latestPosts} />
      <section className="max-w-4xl mx-auto px-4 pb-12 pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "兌換前先確認" : "兑换前先确认")
                : "Check this before redeeming"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "伺服器對不對，很多碼只限特定區服。" : "服务器对不对，很多码只限特定区服。") : "Make sure the server matches, because many codes are region-specific."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "活動碼通常比常駐碼更容易先過期。" : "活动码通常比常驻码更容易先过期。") : "Event codes usually expire earlier than permanent ones."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "如果遊戲內提示失敗，先排除大小寫和多餘空格。" : "如果游戏内提示失败，先排除大小写和多余空格。") : "If redemption fails, rule out capitalization and extra spaces first."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "常見誤區" : "常见误区")
                : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "只看社群轉發，不核對最後檢查時間。" : "只看社群转发，不核对最后检查时间。") : "Using reposted social posts without checking the last verification date."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "把同名角色活動和不同區服碼混為一談。" : "把同名角色活动和不同区服码混为一谈。") : "Mixing event promotions with codes from another server region."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "看到過期就忽略獎勵規律，錯過下一輪活動判斷。" : "看到过期就忽略奖励规律，错过下一轮活动判断。") : "Ignoring expired-code patterns and missing clues for the next campaign drop."}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
