import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../components/JsonLd";
import Link from "next/link";
import redeemCodesData from "../../../data/redeem-codes.json";
import { localizedText } from "../../../lib/seo-copy";
import { ContentStatus } from "../../../components/ContentStatus";
import operations from "../../../data/version-operations.json";

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
  const title = localizedText(locale, "异环活动日历与兑换码 — NTE Guide", "NTE Events & Redeem Codes — NTE Guide");
  const description = localizedText(
    locale,
    "异环(NTE)活动与兑换码历史参考页，记录旧活动、模式和兑换码字段；当前开放状态、奖励与资格请以目标区服客户端和官方公告为准。",
    "Historical NTE events and redeem-code reference for recorded activities, modes, and code fields. Verify current availability, rewards, and eligibility in the target server's client and official notices."
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("events", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

const REFERENCE_EVENTS = [
  {
    id: "launch-celebration",
    titleZh: "开服庆典活动",
    titleEn: "Launch Celebration Event",
    typeZh: "历史开服活动",
    typeEn: "Historical Launch Event",
    descZh: "全球服开服庆典的历史奖励记录，不应默认视为当前可领取内容。",
    descEn: "Historical global-launch reward record. Do not assume these rewards remain claimable now.",
    rewardZh: ["异环币 x10000", "S级弧盘自选箱 x1", "角色觉醒材料 x10"],
    rewardEn: ["Hethereau Coin x10000", "S-Rank Arc Selector x1", "Awakening Material x10"],
    color: "border-yellow-500/30 bg-yellow-500/5",
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    id: "city-tycoon-season1",
    titleZh: "都市大亨 第一赛季",
    titleEn: "City Tycoon Season 1",
    typeZh: "常驻玩法",
    typeEn: "Permanent Mode",
    descZh: "都市大亨第一赛季的历史模式与奖励记录；当前模式、条件和奖励请以客户端显示为准。",
    descEn: "Historical record of City Tycoon Season 1 mode and rewards; verify current mode, requirements, and rewards in the client.",
    rewardZh: ["满配赤子 6+5", "专属弧盘「沉思之猫」", "异环币 x20000"],
    rewardEn: ["Maxed Chiz 6+5", 'Exclusive Arc "Contemplative Cat"', "Hethereau Coin x20000"],
    color: "border-emerald-500/30 bg-emerald-500/5",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "beginner-login",
    titleZh: "新手7日登录奖励",
    titleEn: "7-Day Beginner Login Bonus",
    typeZh: "新手参考",
    typeEn: "Beginner Reference",
    descZh: "新手登录奖励的参考结构；实际领取资格和奖励以客户端显示为准。",
    descEn: "Reference structure for beginner login rewards; verify eligibility and rewards in your client.",
    rewardZh: ["A级角色自选 x1", "基础猎手指南 x30", "异环币 x5000"],
    rewardEn: ["A-Rank Character Selector x1", "Basic Hunter Guide x30", "Hethereau Coin x5000"],
    color: "border-blue-500/30 bg-blue-500/5",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
];

export default async function EventsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const reviewedAt = operations.reviewedAt;

  const redeemCodeDataset = redeemCodesData as { codes: { code: string; reward: string; rewardEn: string; status: string; expiresAt: string; region: string }[] };
  const activeCodes = redeemCodeDataset.codes.filter((c) => c.status === "active");

  return (
    <>
      <ArticleJsonLd
        title={isZh ? "异环活动日历与兑换码" : "NTE Events & Redeem Codes"}
        description={isZh ? "异环历史活动、模式、奖励和兑换码字段参考；当前状态必须以客户端核对。" : "Historical NTE event, mode, reward, and redeem-code fields; verify current status in the client."}
        url={`https://nteguide.com/${lang}/events`}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZh ? "活动日历" : "Events" },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {isZh ? "活动与奖励历史资料" : "Historical Events & Rewards"}
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          {isZh
            ? "本站记录的活动、模式、奖励与兑换码仅供历史查阅，不验证当前开放、资格、奖励或兑换状态。请以目标区服客户端和官方公告为准。"
            : "The site’s recorded events, modes, rewards, and codes are for historical reference only and do not verify current availability, eligibility, rewards, or redemption status. Use the target server’s client and official notices as the source of truth."}
        </p>
        <div className="mb-8">
          <ContentStatus locale={locale} status="watch" reviewedAt={reviewedAt} />
        </div>

        {/* Current limited events */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZh ? "当前活动：未在本站验证" : "Current Events: Not Verified Here"}
          </h2>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6 text-center">
            <p className="text-sm text-gray-500">
              {isZh ? "本站尚未核实可列出的当前限时活动；请以游戏内活动页和官方公告为准。" : "No current limited event is listed until it is verified here; check the in-game event page and official notices."}
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZh ? "常驻与历史活动参考" : "Permanent & Historical References"}
          </h2>
          <div className="space-y-4">
            {REFERENCE_EVENTS.map((event) => (
              <div
                key={event.id}
                className={`rounded-xl border p-5 ${event.color}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${event.badge}`}>
                    {isZh ? event.typeZh : event.typeEn}
                  </span>
                  <h3 className="text-sm font-semibold">
                    {isZh ? event.titleZh : event.titleEn}
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  {isZh ? event.descZh : event.descEn}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(isZh ? event.rewardZh : event.rewardEn).map((r, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 rounded-lg bg-gray-800/80 text-gray-300 border border-gray-700/50">
                      {r}
                    </span>
                  ))}
                </div>
                {event.id === "city-tycoon-season1" && (
                  <Link
                    href={`/${lang}/city-tycoon`}
                    className="text-xs text-primary-400 hover:text-primary-300 mt-3 inline-block"
                  >
                    {isZh ? "查看都市大亨攻略 →" : "View City Tycoon Guide →"}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Active Redeem Codes */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZh ? "历史兑换码候选" : "Historical Redeem-Code Candidates"}
          </h2>
          {activeCodes.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6 text-center">
              <p className="text-sm text-gray-500">
                {isZh ? "本站未验证当前可用兑换码；请在官方来源和客户端兑换界面确认。" : "The site has not verified a currently redeemable code; confirm it in official sources and the client redemption screen."}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
              {activeCodes.map((code, i) => (
                <div
                  key={code.code}
                  className={`flex items-center gap-4 px-4 py-3 ${i > 0 ? "border-t border-gray-800/50" : ""}`}
                >
                  <code className="text-sm font-mono text-primary-400 bg-primary-500/10 px-3 py-1 rounded">
                    {code.code}
                  </code>
                  <span className="text-xs text-gray-400 flex-1 truncate">
                    {isZh ? code.reward : code.rewardEn}
                  </span>
                  <span className="text-[10px] text-gray-600 shrink-0">
                    {code.region === "cn" ? (isZh ? "国服历史字段" : "CN historical field") : (isZh ? "国际服历史字段" : "Global historical field")}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link
            href={`/${lang}/redeem-codes`}
            className="text-xs text-primary-400 hover:text-primary-300 mt-3 inline-block"
          >
            {isZh ? "查看全部兑换码 →" : "View All Codes →"}
          </Link>
        </section>

        {/* Upcoming Events placeholder */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZh ? "后续活动：未验证" : "Future Events: Unverified"}
          </h2>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6 text-center">
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p className="text-sm text-gray-500">
              {isZh
                ? "本站不承诺实时更新。请直接查看目标区服的游戏内活动页和官方公告，以确认后续活动与限定内容。"
                : "This site does not promise real-time updates. Check the target server’s in-game events page and official notices directly for future events and limited content."}
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
