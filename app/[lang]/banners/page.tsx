import Link from "next/link";
import type { Metadata } from "next";
import { t, isZhLocale, type Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { localizedText } from "../../../lib/seo-copy";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { FaqPageJsonLd } from "../../../components/JsonLd";
import { FaqSection } from "../../../components/FaqSection";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";
import { ContentStatus } from "../../../components/ContentStatus";
import operations from "../../../data/version-operations.json";

type BannerStatus = "historical";

interface BannerEntry {
  id: string;
  characterId: string;
  name: string;
  nameEn: string;
  phase: string;
  phaseEn: string;
  startDate: string;
  endDate: string;
  status: BannerStatus;
  attribute: string;
  attributeZh: string;
  role: string;
  roleZh: string;
  arc: string;
  arcZh: string;
  weapon: string;
  weaponZh: string;
  boostedA: string[];
  cosmetics: { pulls: number; name: string; nameZh: string }[];
  summary: string;
  summaryZh: string;
}

const banners: BannerEntry[] = [
  {
    id: "zankou-1-3-phase-1",
    characterId: "zankou",
    name: "赞空",
    nameEn: "Zankou",
    phase: "1.3 上半",
    phaseEn: "Version 1.3 Phase 1",
    startDate: "2026-08-19",
    endDate: "2026-09-09",
    status: "historical",
    attribute: "Incantation",
    attributeZh: "咒术",
    role: "S-rank Gas DPS",
    roleZh: "S级气体输出",
    arc: "Gas",
    arcZh: "气体",
    weapon: "Tiger Special",
    weaponZh: "Tiger Special",
    boostedA: [],
    cosmetics: [],
    summary: "Version 1.3 Phase 1 limited S-rank character with Incantation/Gas affinity.",
    summaryZh: "1.3上半限定S级角色，咒术/气体属性。",
  },
  {
    id: "linko-1-3-phase-2",
    characterId: "linko",
    name: "链子",
    nameEn: "Linko",
    phase: "1.3 下半",
    phaseEn: "Version 1.3 Phase 2",
    startDate: "2026-09-09",
    endDate: "2026-09-30",
    status: "historical",
    attribute: "Anima",
    attributeZh: "生命",
    role: "S-rank Plasma Burst DPS",
    roleZh: "S级等离子爆发输出",
    arc: "Plasma",
    arcZh: "等离子",
    weapon: "Bright Moon Special",
    weaponZh: "Bright Moon Special",
    boostedA: [],
    cosmetics: [],
    summary: "Version 1.3 Phase 2 limited S-rank character focused on burst damage and synchronized team attacks.",
    summaryZh: "1.3下半限定S级角色，偏爆发输出与团队协同攻击。",
  },
  {
    id: "illica-1-2-phase-1",
    characterId: "illica",
    name: "Iroi",
    nameEn: "Illica",
    phase: "1.2 上半",
    phaseEn: "Version 1.2 Phase 1",
    startDate: "2026-07-02",
    endDate: "2026-07-23",
    status: "historical",
    attribute: "Lakshana",
    attributeZh: "相",
    role: "S-rank Heal/Buff Support",
    roleZh: "S级治疗增益辅助",
    arc: "Condensate",
    arcZh: "凝聚",
    weapon: "Signature Arc (TBD)",
    weaponZh: "专属弧盘待确认",
    boostedA: ["Adler", "Mint", "Skia", "Edgar", "Taygedo", "Nelly", "Merula", "Alphard"],
    cosmetics: [],
    summary:
      "Illica was the Version 1.2 Phase 1 limited banner — NTE's first limited S-rank healer/buffer and a member of ETD-4. Use her as a historical roster reference when planning current Version 1.3 teams.",
    summaryZh:
      "伊洛伊是1.2上半限定卡池角色——异环首位S级限定治疗增益辅助，ETD-4成员。缺少专属治疗/增益辅助的账号建议优先抽取，她能融入绝大多数配队。",
  },
  {
    id: "zhenhong-1-2-phase-2",
    characterId: "zhenhong",
    name: "真红",
    nameEn: "Zhenhong",
    phase: "1.2 下半",
    phaseEn: "Version 1.2 Phase 2",
    startDate: "2026-07-08",
    endDate: "2026-07-29",
    status: "historical",
    attribute: "Cosmos",
    attributeZh: "宇宙",
    role: "S-rank Attack DPS",
    roleZh: "S级进攻主C",
    arc: "Condensate",
    arcZh: "凝聚",
    weapon: "Blushing Mirage",
    weaponZh: "绯红幻影",
    boostedA: ["Adler", "Mint", "Skia", "Edgar", "Taygedo", "Nelly", "Merula", "Alphard"],
    cosmetics: [],
    summary:
      "Shinku/Zhenhong was a Version 1.2 limited banner — a Cosmos dragon-tribe fighter DPS built around her Rage gauge and Berserk state. She remains a useful 999 Nights and boss-content reference.",
    summaryZh:
      "Shinku/真红是当前1.2限定卡池角色——宇宙属性龙族格斗家主C，技能围绕Rage与Berserk爆发窗口构建。需要999 Nights或Boss爆发输出的玩家重点关注。",
  },
  {
    id: "iroi-1-2-phase-2",
    characterId: "iroi",
    name: "伊洛伊",
    nameEn: "Iroi",
    phase: "1.2 下半",
    phaseEn: "Version 1.2 Phase 2",
    startDate: "2026-07-29",
    endDate: "2026-08-19",
    status: "historical",
    attribute: "Anima",
    attributeZh: "生命",
    role: "S-rank Buff/Heal Support",
    roleZh: "S级增益/治疗辅助",
    arc: "Liquid",
    arcZh: "液体",
    weapon: "The Wrong Gate",
    weaponZh: "错误之门",
    boostedA: ["Haniel", "Skia", "Aurelia"],
    cosmetics: [],
    summary:
      "Iroi is the next 1.2 Phase 2 limited banner — an Anima support/healer using Liquid Arcs. Watch her if you need a second sustain/buffer or want safer 999 Nights teams.",
    summaryZh:
      "Iroi 是1.2下半下一期限定卡池角色——生命属性增益/治疗辅助，使用液体弧盘。需要第二个生存增益位或想提高999 Nights容错率的玩家可以提前规划。",
  },
  {
    id: "lacrimosa-1-1-phase-1",
    characterId: "lacrimosa",
    name: "安魂曲",
    nameEn: "Lacrimosa",
    phase: "1.1 上半",
    phaseEn: "Version 1.1 Phase 1",
    startDate: "2026-05-28",
    endDate: "2026-06-11",
    status: "historical",
    attribute: "Chaos",
    attributeZh: "混沌",
    role: "S-rank Attack DPS",
    roleZh: "S级进攻输出",
    arc: "Liquid",
    arcZh: "液体",
    weapon: "The Last Rose",
    weaponZh: "最后一朵玫瑰",
    boostedA: ["Mint", "Edgar", "Adler"],
    cosmetics: [],
    summary: "1.1 Phase 1 limited banner and the main Chaos DPS pickup. Now ended; may rerun in future versions.",
    summaryZh: "1.1上半限定卡池，混沌输出核心。目前已结束，后续版本可能复刻。",
  },
  {
    id: "chaos-1-1-phase-2",
    characterId: "chaos",
    name: "卡厄斯",
    nameEn: "Chaos",
    phase: "1.1 下半",
    phaseEn: "Version 1.1 Phase 2",
    startDate: "2026-06-11",
    endDate: "2026-06-25",
    status: "historical",
    attribute: "Lakshana",
    attributeZh: "相",
    role: "S-rank Attack DPS",
    roleZh: "S级进攻输出",
    arc: "Condensate",
    arcZh: "凝聚",
    weapon: "What All Seek",
    weaponZh: "众人追寻之物",
    boostedA: ["TBC"],
    cosmetics: [],
    summary: "1.1 Phase 2 limited banner — the first limited S-rank male character. Now ended.",
    summaryZh: "1.1下半限定卡池——首位S级限定男角色。目前已结束。",
  },
  {
    id: "nanally-1-0-phase-1",
    characterId: "nanally",
    name: "娜娜莉",
    nameEn: "Nanally",
    phase: "1.0 上半",
    phaseEn: "Version 1.0 Phase 1",
    startDate: "2026-04-29",
    endDate: "2026-05-13",
    status: "historical",
    attribute: "Anima",
    attributeZh: "生命",
    role: "S-rank DPS",
    roleZh: "S级输出",
    arc: "Plasma",
    arcZh: "等离子",
    weapon: "Signature Arc",
    weaponZh: "专属弧盘",
    boostedA: ["Adler", "Edgar", "Mint"],
    cosmetics: [],
    summary: "First global limited banner and still a key DPS reference point for tier-list comparisons.",
    summaryZh: "国际服首个限定卡池，仍是强度榜和输出角色对比的重要参照。",
  },
  {
    id: "hotori-1-0-phase-2",
    characterId: "hotori",
    name: "穗鸟",
    nameEn: "Hotori",
    phase: "1.0 下半",
    phaseEn: "Version 1.0 Phase 2",
    startDate: "2026-05-13",
    endDate: "2026-06-03",
    status: "historical",
    attribute: "Cosmos",
    attributeZh: "宇宙",
    role: "S-rank Buff/Burst DPS",
    roleZh: "S级增益/爆发输出",
    arc: "Solid",
    arcZh: "固体",
    weapon: "Signature Arc",
    weaponZh: "专属弧盘",
    boostedA: ["Haniel", "Aurelia", "Skia"],
    cosmetics: [],
    summary: "Strong utility banner with team-buff value and time-stop utility in combat and exploration.",
    summaryZh: "偏功能性和队伍增益价值的限定卡池，战斗与探索都有特殊用途。",
  },
];

const statusStyle: Record<BannerStatus, string> = {
  historical: "border-gray-700 bg-gray-800/40 text-gray-400",
};

function statusLabel(status: BannerStatus, locale: Locale) {
  const zh: Record<BannerStatus, string> = {
    historical: "历史记录",
  };
  const en: Record<BannerStatus, string> = {
    historical: "Historical record",
  };
  return isZhLocale(locale) ? zh[status] : en[status];
}

function formatDate(date: string, locale: Locale) {
  return isZhLocale(locale) ? date.replaceAll("-", ".") : date;
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(
    locale,
    "异环卡池历史资料 - 角色与版本记录",
    "NTE Banner History - Character and Version Records"
  );
  const description = localizedText(
    locale,
    "异环(NTE)卡池历史资料：已收录的角色、版本、日期与机制记录。当前卡池、概率、保底与资源决策请以目标区服客户端和官方公告为准。",
    "NTE banner history with recorded characters, versions, dates, and mechanics. Verify current banners, rates, pity, and resource decisions in your target client and official notices."
  );

  return {
    title,
    description,
    alternates: hreflangAlternates("banners", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function BannersPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const today = operations.reviewedAt;
  const faqs = [
    {
      question: "Who is the current NTE banner?",
      questionZh: "异环当前卡池是谁？",
      answer: `This page is a historical archive reviewed on ${today}; it does not identify the current banner. Check the in-game countdown and official notice before spending Solid Dice.`,
      answerZh: `本页是截至 ${today} 复核的历史资料库，不识别当前卡池。消耗 Solid Dice 前请以游戏内倒计时和官方公告为准。`,
    },
    {
      question: "Who is the next NTE banner?",
      questionZh: "异环下一期卡池是谁？",
      answer: "This archive does not predict or list the next limited banner. The records below are for character and version review only.",
      answerZh: "本资料库不预测或列出下一期限定卡池。下方记录仅用于角色与版本回顾。",
    },
    {
      question: "Does NTE have a 50/50 on character banners?",
      questionZh: "异环角色池有50/50吗？",
      answer: "Historical site records may describe past pity rules, but they do not verify the current banner. Read the in-game banner details and official notice before pulling.",
      answerZh: "站内历史记录可能描述过往保底规则，但不验证当前卡池。抽取前请阅读游戏内卡池详情与官方公告。",
    },
    {
      question: "Should I pull Shinku or wait for Iroi?",
      questionZh: "应该抽Shinku/真红还是等Iroi？",
      answer: "Do not base a current pull decision on the historical Shinku or Iroi schedules below. Wait for the in-game banner countdown and an official notice, then compare that banner with your roster needs.",
      answerZh: "不要依据下方真红或伊洛伊的历史排期做当前抽取决定。请等待游戏内卡池倒计时与官方公告，再按自己的队伍缺口判断。",
    },
    {
      question: "Are CN and global server banner dates the same?",
      questionZh: "异环国服和国际服卡池时间一样吗？",
      answer: "Banner dates can differ by server and publisher region. Always verify the date inside your own game client before spending Solid Dice; this page preserves historical schedules only.",
      answerZh: "不同服务器和发行地区的日期可能不同。消耗 Solid Dice 前请以游戏内卡池倒计时为准；本页只保存历史排期。",
    },
  ];

  return (
    <>
      <FaqPageJsonLd faqs={faqs} lang={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZh ? "卡池历史资料" : "Banner History" },
        ]}
      />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-400 mb-3">
            {isZh ? `最后复核 ${today}` : `Last reviewed ${today}`}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isZh ? "异环卡池历史资料" : "NTE Banner History"}
          </h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            {isZh
              ? "整理已收录的卡池、角色、版本与机制记录。本页不显示当前或下一期卡池，也不适合用于抽取、充值或资源规划；请以目标区服客户端和官方公告为准。"
              : "Browse recorded banner, character, version, and mechanic history. This page does not show current or next banners and must not be used for pulls, spending, or resource planning; verify those in your target client and official notices."}
          </p>
          <div className="mt-4">
            <ContentStatus locale={locale} status="watch" reviewedAt={today} />
          </div>
        </section>

        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZh ? "当前卡池：" : "Current banner:",
              value: isZh ? "不在本站历史资料中判断；请查看目标区服游戏内倒计时。" : "Not determined by this archive; check your target server's in-game countdown.",
            },
            {
              label: isZh ? "下一期：" : "Next banner:",
              value: isZh ? "本页不预测后续角色或日期；请等待官方公告和客户端详情。" : "This page does not predict upcoming characters or dates; wait for official notices and client details.",
            },
            {
              label: isZh ? "角色池保底：" : "Character pity:",
              value: isZh ? "历史机制字段，不代表当前规则；抽取前请在客户端详情页核对。" : "Historical mechanic field, not a current rule; verify it in the in-game banner details before pulling.",
            },
            {
              label: isZh ? "武器池提醒：" : "Weapon banner note:",
              value: isZh ? "抽专武前请在客户端确认当前保底、概率和资源预算。" : "Before pulling a weapon, confirm current pity, rates, and your budget in the client.",
            },
          ]}
        />

        <section className="mt-6 mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "看卡池时先判断什么" : "What should you check first on a banner page?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "先在客户端确认目标卡池、概率、保底、继承和结束倒计时。" : "First confirm the target banner, rates, pity, carry-over, and end countdown in the client."}</li>
              <li>{isZh ? "把角色池和专武池拆开预算，不要把历史规则直接套到当前详情。" : "Separate character and weapon budgets; do not apply historical rules directly to current details."}</li>
              <li>{isZh ? "再按当前账号缺口与活动目标决定投入，不使用本站历史角色评价替代客户端信息。" : "Then decide from your current roster gap and event goals, not from this site's historical character evaluations."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "把历史日期或旧截图当作当前卡池开放证明。" : "Treating historical dates or old screenshots as proof that a current banner is open."}</li>
              <li>{isZh ? "假定不同服务器的卡池、概率、保底与活动节奏完全同步。" : "Assuming every server has identical banner, rate, pity, and event timing."}</li>
              <li>{isZh ? "依据本站旧角色评价或排期直接消费资源。" : "Spending resources directly from this site's older character evaluations or schedules."}</li>
            </ul>
          </div>
        </section>

        <section className="grid gap-4 mb-10">
          {banners.map((banner) => (
            <article
              key={banner.id}
              className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 hover:border-primary-500/30 transition-colors"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded border ${statusStyle[banner.status]}`}>
                      {statusLabel(banner.status, locale)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {isZh ? banner.phase : banner.phaseEn}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold">
                    {isZh ? `${banner.name} (${banner.nameEn})` : `${banner.nameEn} (${banner.name})`}
                  </h2>
                  <p className="text-sm text-gray-400 mt-2 max-w-2xl">
                    {isZh ? banner.summaryZh : banner.summary}
                  </p>
                </div>
                <div className="md:text-right shrink-0">
                  <p className="text-sm font-mono text-primary-300">
                    {formatDate(banner.startDate, locale)} - {formatDate(banner.endDate, locale)}
                  </p>
                  <Link
                    href={`/${lang}/characters/${banner.characterId}`}
                    className="inline-block mt-3 text-sm text-primary-400 hover:text-primary-300"
                  >
                    {isZh ? "查看角色攻略" : "View character guide"}
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 text-sm">
                <div className="rounded-lg bg-gray-800/50 p-3">
                  <p className="text-xs text-gray-500">{isZh ? "属性" : "Attribute"}</p>
                  <p className="font-medium">{isZh ? banner.attributeZh : banner.attribute}</p>
                </div>
                <div className="rounded-lg bg-gray-800/50 p-3">
                  <p className="text-xs text-gray-500">{isZh ? "定位" : "Role"}</p>
                  <p className="font-medium">{isZh ? banner.roleZh : banner.role}</p>
                </div>
                <div className="rounded-lg bg-gray-800/50 p-3">
                  <p className="text-xs text-gray-500">{isZh ? "弧盘类型" : "Arc Type"}</p>
                  <p className="font-medium">{isZh ? banner.arcZh : banner.arc}</p>
                </div>
                <div className="rounded-lg bg-gray-800/50 p-3">
                  <p className="text-xs text-gray-500">{isZh ? "专武/专属弧盘" : "Signature Arc"}</p>
                  <p className="font-medium">{isZh ? banner.weaponZh : banner.weapon}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
                <span>{isZh ? "陪跑：" : "Boosted A-rank:"}</span>
                {banner.boostedA.map((item) => (
                  <span key={item} className="rounded-full bg-gray-800 px-2 py-1">
                    {item}
                  </span>
                ))}
              </div>

              {banner.cosmetics.length > 0 && (
                <div className="mt-4 rounded-lg border border-gray-800 bg-gray-950/40 p-3">
                  <p className="text-xs text-gray-500 mb-2">
                    {isZh ? "卡池外观里程碑" : "Banner cosmetic milestones"}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {banner.cosmetics.map((item) => (
                      <div key={item.pulls} className="text-sm">
                        <span className="text-primary-300 font-mono">{item.pulls}</span>{" "}
                        <span className="text-gray-400">{isZh ? item.nameZh : item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>

        <section className="mb-10 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {[
            { href: `/${lang}/gacha`, label: isZh ? "抽卡模拟器" : "Gacha Simulator" },
            { href: `/${lang}/guides/gacha-system`, label: isZh ? "抽卡机制详解" : "Gacha System Guide" },
            { href: `/${lang}/tier-list`, label: isZh ? "角色评级历史资料" : "Historical Tier List" },
            { href: `/${lang}/cn-vs-global`, label: isZh ? "国服 vs 国际服日期" : "CN vs Global Dates" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3 text-sm text-gray-300 hover:border-primary-500/40 hover:text-primary-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </section>

        <FaqSection faqs={faqs} locale={locale} />
      </main>
    </>
  );
}
