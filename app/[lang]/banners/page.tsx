import Link from "next/link";
import type { Metadata } from "next";
import { t, isZhLocale, type Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { localizedText } from "../../../lib/seo-copy";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { FaqPageJsonLd } from "../../../components/JsonLd";
import { FaqSection } from "../../../components/FaqSection";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";

type BannerStatus = "current" | "next" | "ended" | "upcoming";

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
    id: "illica-1-2-phase-1",
    characterId: "illica",
    name: "Iroi",
    nameEn: "Illica",
    phase: "1.2 上半",
    phaseEn: "Version 1.2 Phase 1",
    startDate: "2026-07-02",
    endDate: "2026-07-23",
    status: "ended",
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
      "Illica is the current 1.2 Phase 1 limited banner — NTE's first limited S-rank healer/buffer and a member of ETD-4. Pull her if your account lacks a dedicated sustain/buff support; she slots into almost every team composition.",
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
    status: "current",
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
      "Shinku/Zhenhong is the current 1.2 Phase 1 limited banner — a Cosmos dragon-tribe fighter DPS built around her Rage gauge and Berserk state. Top pick if you need a burst DPS for 999 Nights or boss content.",
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
    status: "next",
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
    status: "ended",
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
    status: "ended",
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
    status: "ended",
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
    status: "ended",
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

const nextVersionTeasers = [
  {
    name: "Zankou",
    nameZh: "Zankou",
    detail: "S-rank Incantation character expected for version 1.3 Phase 1. Exact kit and signature Arc are still pending official detail.",
    detailZh: "1.3版本上半预热的S级咒术属性角色，具体技能与专属弧盘仍待官方进一步公布。",
  },
];

const statusStyle: Record<BannerStatus, string> = {
  current: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  next: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  upcoming: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  ended: "border-gray-700 bg-gray-800/40 text-gray-400",
};

function statusLabel(status: BannerStatus, locale: Locale) {
  const zh: Record<BannerStatus, string> = {
    current: "当前卡池",
    next: "下一期",
    upcoming: "预热",
    ended: "已结束",
  };
  const en: Record<BannerStatus, string> = {
    current: "Current",
    next: "Next",
    upcoming: "Upcoming",
    ended: "Ended",
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
    "异环卡池时间表 2026 — Shinku当前UP、Iroi下一期、Zankou 1.3预热",
    "NTE Banner Schedule 2026 — Shinku Current, Iroi Next, Zankou 1.3 Teaser"
  );
  const description = localizedText(
    locale,
    "异环(NTE)最新卡池时间表：Shinku/真红当前UP、Iroi下一期、Zankou 1.3预热、1.2限定祈愿日期、无50/50保底、专属Arc与抽取建议。",
    "Neverness to Everness banner schedule for 2026: current Shinku banner, next Iroi banner, Zankou 1.3 teaser, dates, no 50/50 pity, signature Arc notes and pull advice."
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
  const current = banners.find((b) => b.status === "current")!;
  const next = banners.find((b) => b.status === "next")!;
  const faqs = [
    {
      question: "Who is the current NTE banner?",
      questionZh: "异环当前卡池是谁？",
      answer: "The current Neverness to Everness limited banner is Shinku/Zhenhong, running from July 8 to July 29, 2026. She is a Cosmos S-rank burst DPS with the Blushing Mirage signature Arc.",
      answerZh: "异环当前限定卡池为 Shinku/真红，时间为 2026-07-08 至 2026-07-29。她是宇宙属性S级爆发主C，同期专属Arc为 Blushing Mirage。",
    },
    {
      question: "Who is the next NTE banner?",
      questionZh: "异环下一期卡池是谁？",
      answer: "Iroi is the next limited banner for version 1.2 Phase 2, scheduled from July 29 to August 19, 2026. She is an Anima support/healer using Liquid Arcs.",
      answerZh: "Iroi 是1.2下半下一期限定卡池角色，时间为 2026-07-29 至 2026-08-19。她是生命属性增益/治疗辅助，使用液体弧盘。",
    },
    {
      question: "Does NTE have a 50/50 on character banners?",
      questionZh: "异环角色池有50/50吗？",
      answer: "No. Limited character banners guarantee the featured S-rank character when you pull an S-rank. Soft pity starts around 70 pulls and hard pity is 90 pulls.",
      answerZh: "没有。限定角色池抽到S级时为当期UP角色，约70抽进入软保底，90抽硬保底。",
    },
    {
      question: "Should I pull Shinku or wait for Iroi?",
      questionZh: "应该抽Shinku/真红还是等Iroi？",
      answer: "Pull Shinku if you need a burst DPS for 999 Nights or boss fights. Wait for Iroi if your account already has damage but lacks a second sustain/buffer for safer teams.",
      answerZh: "缺999 Nights或Boss爆发输出就抽Shinku/真红；已经有主C、但缺第二个生存增益位，就等Iroi。",
    },
    {
      question: "Are CN and global server banner dates the same?",
      questionZh: "异环国服和国际服卡池时间一样吗？",
      answer: "Banner dates can differ slightly by server and publisher region. Always verify the date inside your own game client before spending Solid Dice. This page tracks the current public schedule and updates when official dates shift.",
      answerZh: "不同服务器和发行地区的日期可能略有差异。消耗Solid Dice前请以游戏内卡池倒计时为准。本页跟踪当前公开排期，并在官方日期变化后更新。",
    },
  ];

  return (
    <>
      <FaqPageJsonLd faqs={faqs} lang={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZh ? "卡池时间表" : "Banner Schedule" },
        ]}
      />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-400 mb-3">
            {isZh ? "2026-07-10 更新" : "Updated July 10, 2026"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isZh ? "异环卡池时间表：Shinku当前UP，Iroi下一期" : "NTE Banner Schedule: Current Shinku, Next Iroi"}
          </h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            {isZh
              ? "追踪 Neverness to Everness 最新限定祈愿、角色池保底、Arc池风险和1.3前瞻角色（Zankou）。这个页面会作为当前卡池入口，帮助你快速判断要抽、跳过还是等下一期。"
              : "Track the latest Neverness to Everness limited banners, character pity, Arc banner risks, and version 1.3 teaser (Zankou). Use this page to decide whether to pull, skip, or wait for the next phase."}
          </p>
        </section>

        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZh ? "当前卡池：" : "Current banner:",
              value: isZh
                ? `${current.name}，${formatDate(current.startDate, locale)} 至 ${formatDate(current.endDate, locale)}。`
                : `${current.nameEn}, ${current.startDate} to ${current.endDate}.`,
            },
            {
              label: isZh ? "下一期：" : "Next banner:",
              value: isZh
                ? `${next.name}，${formatDate(next.startDate, locale)} 至 ${formatDate(next.endDate, locale)}。`
                : `${next.nameEn}, ${next.startDate} to ${next.endDate}.`,
            },
            {
              label: isZh ? "角色池保底：" : "Character pity:",
              value: isZh ? "无50/50，约70抽软保底，90抽硬保底。" : "No 50/50, soft pity around 70 pulls, hard pity at 90.",
            },
            {
              label: isZh ? "武器池提醒：" : "Weapon banner note:",
              value: isZh ? "专武投入前先确认保底和资源预算，武器池通常比角色池更吃资源。" : "Confirm pity and budget before pulling weapons; weapon banners are usually more resource-heavy.",
            },
          ]}
        />

        <section className="mt-6 mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "看卡池时先判断什么" : "What should you check first on a banner page?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "先看你缺的是主C、辅助还是生存位，再决定追当前还是等下一期。" : "Decide whether your account needs a carry, support, or sustain slot before choosing current or next banner."}</li>
              <li>{isZh ? "把角色池和专武池拆开预算，不要把两边保底混在一起算。" : "Separate your character and weapon budgets instead of blending both pity plans together."}</li>
              <li>{isZh ? "如果你主要打 999 Nights 或 Boss，优先看爆发覆盖和容错，不只是人气。" : "If you mainly care about 999 Nights or bosses, prioritize burst coverage and survivability over hype alone."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "只看社群讨论热度，不看自己的现有配队缺口。" : "Following social hype without checking your own roster gaps."}</li>
              <li>{isZh ? "把不同服务器的上线时间和活动码节奏当成完全同步。" : "Assuming every server gets the exact same timing and event cadence."}</li>
              <li>{isZh ? "为了抽专武透支下期角色预算，结果主力队伍反而更慢成型。" : "Overspending on signature weapons and delaying the next role your account actually needs."}</li>
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

        <section className="mb-10 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-xl font-bold mb-4">
            {isZh ? "1.3 前瞻：残虹搜索需求升温" : "Version 1.3 Watchlist: Canhong"}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {nextVersionTeasers.map((item) => (
              <div key={item.name} className="rounded-lg bg-gray-800/50 p-4">
                <h3 className="font-semibold">{isZh ? `${item.nameZh} (${item.name})` : `${item.name} (${item.nameZh})`}</h3>
                <p className="text-sm text-gray-400 mt-2">{isZh ? item.detailZh : item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {[
            { href: `/${lang}/gacha`, label: isZh ? "抽卡模拟器" : "Gacha Simulator" },
            { href: `/${lang}/guides/gacha-system`, label: isZh ? "抽卡机制详解" : "Gacha System Guide" },
            { href: `/${lang}/tier-list`, label: isZh ? "最新强度榜" : "Latest Tier List" },
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
