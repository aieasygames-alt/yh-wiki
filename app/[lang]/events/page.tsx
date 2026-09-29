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
    "异环(NTE)活动与兑换码参考页，区分已确认的当前限时内容、常驻玩法与历史活动，避免将开服福利误作当前资源。",
    "Neverness to Everness events and redeem-code reference, separating confirmed limited content from permanent modes and historical launch rewards."
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
    descZh: "经营你的城市，提升都市大亨等级至30级可免费获得满配赤子（小智）。",
    descEn: "Manage your city. Reach Lv.30 to get a free maxed Chiz (Xiaozhi).",
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
        description={isZh ? "异环活动、常驻玩法、历史奖励和可用兑换码的状态参考。" : "NTE event, permanent-mode, historical-reward, and active-code status reference."}
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
          {isZh ? "活动日历" : "Events & Calendar"}
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          {isZh
            ? "已确认活动、常驻玩法、历史奖励与可用兑换码参考。限时内容以客户端倒计时和官方公告为准。"
            : "Confirmed event references, permanent modes, historical rewards, and active codes. Verify limited content against the in-game countdown and official notices."}
        </p>
        <div className="mb-8">
          <ContentStatus locale={locale} status="watch" reviewedAt={reviewedAt} />
        </div>

        {/* Current limited events */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZh ? "当前活动" : "Current Events"}
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
            {isZh ? "可用兑换码" : "Active Redeem Codes"}
          </h2>
          {activeCodes.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6 text-center">
              <p className="text-sm text-gray-500">
                {isZh ? "暂无可用兑换码" : "No active codes right now"}
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
                    {code.region === "cn" ? (isZh ? "国服" : "CN") : "Global"}
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
            {isZh ? "即将到来" : "Coming Soon"}
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
                ? "新版本活动和限定内容将在官方公告后第一时间更新。"
                : "New version events and limited content will be updated as soon as officially announced."}
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
