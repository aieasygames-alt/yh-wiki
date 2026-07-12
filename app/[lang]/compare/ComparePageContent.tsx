import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { ArticleContent } from "../../../components/ArticleContent";
import { getCompare } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import { CompareTable } from "../../../components/CompareTable";
import { localizedText } from "../../../lib/seo-copy";

interface ComparePageProps {
  params: { lang: string; slug: string };
}

export async function generateCompareMetadata({ params }: ComparePageProps) {
  const { lang, slug } = await params;
  return generateCompareMetadataForSlug(lang, slug);
}

export function generateCompareMetadataForSlug(lang: string, slug: string) {
  const article = getCompare(slug);
  if (!article) return {};
  const locale = lang as Locale;
  const rawTitle = localizedText(locale, article.title, article.titleEn, article.titleTw);
  const title = /20\d{2}/.test(rawTitle) ? rawTitle : `${rawTitle} (2026)`;
  const summary = localizedText(locale, article.summary, article.summaryEn, article.summaryTw);
  const category = localizedText(locale, article.categoryZh, article.categoryEn);
  const relatedCount = article.internalLinks.length;
  const description = isZhLocale(locale)
    ? `${summary} 本页同时整理 ${category} 对比重点、核心差异与 ${relatedCount} 个相关延伸入口，适合在抽卡、入坑或换游前快速判断。`
    : `${summary} This comparison also highlights key differences, ${category.toLowerCase()} takeaways, and ${relatedCount} related paths to help you evaluate the best fit before you start or switch games.`;
  return {
    title,
    description,
    alternates: hreflangAlternates(`compare/${slug}`, lang),
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export function ComparePageContent({ params }: ComparePageProps) {
  // This will be called from each slug-specific page
  // We need to await params in the page component
  return <ComparePageInner params={params} />;
}

async function ComparePageInner({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = params;
  const locale = lang as Locale;
  const article = getCompare(slug);
  if (!article) notFound();

  const title = localizedText(locale, article.title, article.titleEn, article.titleTw);
  const content = localizedText(locale, article.content, article.contentEn, article.contentTw);
  const summary = localizedText(locale, article.summary, article.summaryEn, article.summaryTw);
  const category = localizedText(locale, article.categoryZh, article.categoryEn);
  const url = `https://nteguide.com/${lang}/compare/${slug}`;

  // Determine comparison table based on slug
  const compareTable = getCompareTable(slug, locale);
  const decisionGuide = getCompareDecisionGuide(slug, locale);
  const bestFor = getCompareBestFor(slug, locale);
  const supportCopy = getCompareSupportCopy(slug, locale);

  return (
    <>
      <ArticleJsonLd title={title} description={summary} url={url} datePublished={article.date} dateModified={article.date} />
      {getCompareFaqs(slug) && <FaqPageJsonLd faqs={getCompareFaqs(slug)!} lang={locale} />}
      <BreadcrumbJsonLd
        items={[
          { name: "NTE Guide", url: "https://nteguide.com" },
          { name: t(locale, "compareDetails.compare"), url: `https://nteguide.com/${lang}/compare/${slug}` },
          { name: title },
        ]}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "compareDetails.gameCompare"), href: `/${lang}/compare/${slug}` },
          { label: title },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400">
            {category}
          </span>
          <time className="text-xs text-gray-500" dateTime={article.date}>
            {article.date}
          </time>
        </div>
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <p className="text-gray-400 mb-6 text-sm border-l-2 border-primary-500 pl-3">
          {summary}
        </p>

        {supportCopy && (
          <>
            <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <h2 className="text-lg font-bold mb-3">{supportCopy.introTitle}</h2>
              <p className="text-sm leading-7 text-gray-300">{supportCopy.introBody}</p>
            </section>

            <section className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
                <h2 className="text-base font-semibold text-white">{supportCopy.checkFirstTitle}</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
                  {supportCopy.checkFirst.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
                <h2 className="text-base font-semibold text-white">{supportCopy.mistakesTitle}</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
                  {supportCopy.mistakes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}

        {decisionGuide && (
          <section className="mb-8 rounded-xl border border-primary-500/30 bg-primary-500/5 p-5">
            <h2 className="text-lg font-bold mb-3">
              {isZhLocale(locale) ? "先看结论" : "Quick Take"}
            </h2>
            <ul className="space-y-2 text-sm leading-6 text-gray-300">
              {decisionGuide.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-primary-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Compare Table */}
        {compareTable && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">
              {t(locale, "compareDetails.quickComparison")}
            </h2>
            <CompareTable
              headers={compareTable.headers}
              items={compareTable.items}
              highlight={0}
            />
          </section>
        )}

        {/* Content */}
        <ArticleContent content={content} lang={lang} />

        {bestFor && (
          <section className="mt-10 rounded-xl border border-gray-800 bg-gray-900/40 p-5">
            <h2 className="text-lg font-bold mb-4">
              {isZhLocale(locale) ? "更适合谁" : "Who Each Game Fits"}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {bestFor.map((card) => (
                <div key={card.title} className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
                  <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{card.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/${lang}/tags/${tag}`}
                className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 hover:text-primary-400 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Internal Links */}
        {article.internalLinks.length > 0 && (
          <section className="mt-10 border-t border-gray-800 pt-6">
            <h2 className="text-lg font-bold mb-4">
              {t(locale, "compareDetails.relatedContent")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {article.internalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${lang}${link.href}`}
                  className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
                >
                  <span className="text-sm">
                    {localizedText(locale, link.label, link.labelEn)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

function getCompareTable(slug: string, locale: Locale) {
  if (slug === "nte-vs-genshin") {
    if (isZhLocale(locale)) {
      return {
        headers: ["维度", "异环 (NTE)", "原神 (Genshin)"],
        items: [
          { name: "战斗风格", values: ["动作连招 + 弹反", "元素反应 + 切人"] },
          { name: "世界观", values: ["现代都市奇幻", "奇幻冒险"] },
          { name: "画面风格", values: ["写实渲染", "卡通渲染"] },
          { name: "平台", values: ["PC", "PC / 手机 / PS"] },
          { name: "抽卡机制", values: ["90 抽必出 UP（无 50/50）", "90 抽小保底 / 180 抽大保底"] },
          { name: "多人模式", values: ["组队挑战", "4 人联机"] },
        ],
      };
    }
    return {
      headers: ["Feature", "NTE", "Genshin Impact"],
      items: [
        { name: "Combat", values: ["Action combos + Parry", "Elemental Reactions"] },
        { name: "Setting", values: ["Modern Urban Fantasy", "Fantasy Adventure"] },
        { name: "Graphics", values: ["Realistic", "Cel-shaded"] },
        { name: "Platforms", values: ["PC", "PC / Mobile / PS"] },
        { name: "Gacha", values: ["90 pulls, no 50/50", "90 / 180 pulls with 50/50"] },
        { name: "Multiplayer", values: ["Co-op Challenges", "4-player Co-op"] },
      ],
    };
  }

  if (slug === "nte-vs-wuthering-waves") {
    if (isZhLocale(locale)) {
      return {
        headers: ["维度", "异环 (NTE)", "鸣潮 (WuWa)"],
        items: [
          { name: "战斗核心", values: ["异能 + 动作连招", "声骸 + 闪避弹反"] },
          { name: "世界观", values: ["现代都市", "后末日科幻"] },
          { name: "养成系统", values: ["磁盘套装", "声骸系统"] },
          { name: "画面引擎", values: ["自研引擎", "虚幻引擎"] },
          { name: "抽卡保底", values: ["测试中", "80 抽保底"] },
        ],
      };
    }
    return {
      headers: ["Feature", "NTE", "Wuthering Waves"],
      items: [
        { name: "Combat Core", values: ["Esper + Action Combos", "Echo + Dodge/Parry"] },
        { name: "Setting", values: ["Modern Urban", "Post-apocalyptic"] },
        { name: "Progression", values: ["Disk Sets", "Echo System"] },
        { name: "Engine", values: ["Custom Engine", "Unreal Engine"] },
        { name: "Gacha Pity", values: ["TBD", "80 pulls"] },
      ],
    };
  }

  if (slug === "nte-vs-zzz") {
    if (isZhLocale(locale)) {
      return {
        headers: ["维度", "异环 (NTE)", "绝区零 (ZZZ)"],
        items: [
          { name: "开发商", values: ["Hotta Studio (完美世界)", "miHoYo (米哈游)"] },
          { name: "游戏类型", values: ["开放世界动作RPG", "都市动作RPG"] },
          { name: "世界观", values: ["超自然都市开放世界", "空洞危机都市"] },
          { name: "战斗风格", values: ["异能连招 + 弹反", "动作连携 + 属性异常"] },
          { name: "探索模式", values: ["无缝开放世界", "关卡制（TV频道+战斗）"] },
          { name: "50/50机制", values: ["无（必出UP）", "有（50%歪常驻）"] },
          { name: "保底抽数", values: ["90抽", "90抽"] },
          { name: "画面风格", values: ["写实渲染 (UE5)", "风格化赛璐璐"] },
          { name: "平台", values: ["PC / 手机 / PS5", "PC / 手机 / PS5"] },
          { name: "特色系统", values: ["载具驾驶、买房装修", "TV探索、连携技"] },
        ],
      };
    }
    return {
      headers: ["Feature", "NTE", "Zenless Zone Zero"],
      items: [
        { name: "Developer", values: ["Hotta Studio (Perfect World)", "miHoYo (HoYoverse)"] },
        { name: "Genre", values: ["Open World Action RPG", "Urban Action RPG"] },
        { name: "Setting", values: ["Supernatural Urban Open World", "Hollow Crisis City"] },
        { name: "Combat", values: ["Esper Combos + Parry", "Chain Attacks + Anomaly"] },
        { name: "Exploration", values: ["Seamless Open World", "Instance-based (TV + Combat)"] },
        { name: "50/50 System", values: ["None (Guaranteed Featured)", "Yes (50% Standard)"] },
        { name: "Pity Count", values: ["90 pulls", "90 pulls"] },
        { name: "Art Style", values: ["Realistic (UE5)", "Stylized Cel-shaded"] },
        { name: "Platforms", values: ["PC / Mobile / PS5", "PC / Mobile / PS5"] },
        { name: "Unique Features", values: ["Driving, Housing", "TV Exploration, Chain Attacks"] },
      ],
    };
  }

  if (slug === "nte-vs-ananta") {
    if (isZhLocale(locale)) {
      return {
        headers: ["维度", "异环 (NTE)", "无限大 (Ananta)"],
        items: [
          { name: "开发商", values: ["完美世界 / 幻塔工作室", "网易游戏"] },
          { name: "游戏类型", values: ["开放世界动作RPG", "开放世界动作RPG"] },
          { name: "世界观", values: ["现代都市奇幻", "现代都市奇幻"] },
          { name: "战斗风格", values: ["异能连招 + 弹反", "动作连招 + 属性切换"] },
          { name: "50/50机制", values: ["无（必出UP）", "有（50%歪常驻）"] },
          { name: "保底抽数", values: ["90抽", "90抽"] },
          { name: "画面风格", values: ["写实渲染 (UE5)", "风格化渲染"] },
          { name: "平台", values: ["PC / 手机 / PS5", "PC / 手机"] },
          { name: "特色系统", values: ["载具驾驶、买房装修、城市经营", "都市探索、角色切换"] },
        ],
      };
    }
    return {
      headers: ["Feature", "NTE", "Ananta"],
      items: [
        { name: "Developer", values: ["Perfect World / Hotta Studio", "NetEase Games"] },
        { name: "Genre", values: ["Open World Action RPG", "Open World Action RPG"] },
        { name: "Setting", values: ["Modern Urban Fantasy", "Modern Urban Fantasy"] },
        { name: "Combat", values: ["Esper Combos + Parry", "Action Combos + Element Switch"] },
        { name: "50/50 System", values: ["None (Guaranteed Featured)", "Yes (50% Standard)"] },
        { name: "Pity Count", values: ["90 pulls", "90 pulls"] },
        { name: "Art Style", values: ["Realistic (UE5)", "Stylized"] },
        { name: "Platforms", values: ["PC / Mobile / PS5", "PC / Mobile"] },
        { name: "Unique Features", values: ["Driving, Housing, City Tycoon", "Urban Exploration, Character Switch"] },
      ],
    };
  }

  return null;
}

function getCompareDecisionGuide(slug: string, locale: Locale) {
  if (slug === "nte-vs-genshin") {
    return isZhLocale(locale)
      ? [
          "如果你最在意抽卡成本、无 50/50 和现代都市题材，异环更有吸引力。",
          "如果你更喜欢成熟长线内容、元素反应体系和更完整的历史版本积累，原神仍然更稳。",
          "这组对比的核心不是谁绝对更强，而是你更偏动作操作还是偏奇幻探索。 ",
        ]
      : [
          "Pick NTE if banner efficiency, no 50/50, and an urban-fantasy setting matter most to you.",
          "Pick Genshin if you value mature long-tail content, elemental systems, and a more established live-service history.",
          "The real split here is action-heavy urban play versus fantasy exploration depth.",
        ];
  }

  if (slug === "nte-vs-wuthering-waves") {
    return isZhLocale(locale)
      ? [
          "异环更偏现代都市开放世界与生活化玩法，鸣潮更偏后末日动作与声骸养成。",
          "如果你重视载具、买房和无 50/50，异环的差异化会更明显。",
          "如果你更想要高压战斗手感和既有动作框架，鸣潮的方向会更直接。",
        ]
      : [
          "NTE leans into urban open-world systems, while WuWa leans into post-apocalyptic action and Echo progression.",
          "Choose NTE for driving, housing, and no-50/50 banner value.",
          "Choose WuWa if you mainly want combat intensity inside an already-established action framework.",
        ];
  }

  if (slug === "nte-vs-zzz") {
    return isZhLocale(locale)
      ? [
          "异环和绝区零都走都市题材，但异环是开放世界，绝区零更偏关卡制与战斗编排。",
          "如果你想要自由探索、开车和房屋系统，异环更贴近你要的体验。",
          "如果你更喜欢更紧凑的关卡战斗循环和米系表现风格，绝区零会更合口味。",
        ]
      : [
          "Both games are urban-themed, but NTE is open-world while ZZZ is much more stage-driven.",
          "Choose NTE for free exploration, driving, and housing-style systems.",
          "Choose ZZZ for tighter combat loops and a more instance-focused structure.",
        ];
  }

  if (slug === "nte-vs-ananta") {
    return isZhLocale(locale)
      ? [
          "如果你现在就想玩都市二次元开放世界，异环已经上线而且版本内容在持续更新。",
          "如果你更想等网易方案、接受更传统的 50/50 抽卡结构，可以继续观察无限大。",
          "这页最重要的判断点其实不是题材，而是上线状态、抽卡友好度和特色系统差异。",
        ]
      : [
          "If you want to play an urban anime open-world game now, NTE is already live and updating.",
          "If you want to wait for NetEase's take and are comfortable with a more traditional 50/50 banner structure, Ananta may still be worth watching.",
          "The main decision here is live status, banner friendliness, and feature priorities rather than theme alone.",
        ];
  }

  if (slug === "nte-vs-honkai-star-rail") {
    return isZhLocale(locale)
      ? [
          "这两款游戏最根本的差异是动作开放世界 vs 回合制策略，不是同一种游玩节奏。",
          "如果你更享受亲自操作、弹反和自由跑图，异环会更适合你。",
          "如果你更喜欢阵容规划、弱点击破和低操作负担，星穹铁道的匹配度更高。",
        ]
      : [
          "The biggest split here is open-world action versus turn-based strategy, not just theme.",
          "Choose NTE for direct control, parries, and free exploration.",
          "Choose HSR for roster planning, weakness-break strategy, and lower execution demand.",
        ];
  }

  if (slug === "games-like-nte") {
    return isZhLocale(locale)
      ? [
          "如果你只是想找都市二次元开放世界的近似体验，优先看题材、战斗和抽卡机制是否接近。",
          "多数“像异环”的游戏只会在其中一两个维度相似，很少能同时覆盖都市、动作、载具和生活系统。",
          "适合先用这页筛方向，再去看单独的对比页做更细判断。",
        ]
      : [
          "If you're looking for games like NTE, compare theme, combat, and banner structure before anything else.",
          "Most alternatives only overlap in one or two dimensions, not all of NTE's urban, action, driving, and lifestyle systems at once.",
          "Use this page to narrow the field, then move to individual comparison pages for the final call.",
        ];
  }

  return null;
}

function getCompareBestFor(slug: string, locale: Locale) {
  const zh = isZhLocale(locale);

  const build = (leftTitle: string, leftDescription: string, rightTitle: string, rightDescription: string) => [
    { title: leftTitle, description: leftDescription },
    { title: rightTitle, description: rightDescription },
  ];

  switch (slug) {
    case "nte-vs-genshin":
      return zh
        ? build("更适合选异环的人", "想要更友好的抽卡结构、更强的动作反馈，以及现代都市题材下的新鲜感。", "更适合选原神的人", "更看重成熟内容池、稳定更新节奏、奇幻世界观和元素反应体系。")
        : build("Choose NTE if...", "You want a friendlier banner structure, stronger action feedback, and a fresher modern-urban setting.", "Choose Genshin if...", "You value mature content depth, stable cadence, fantasy worldbuilding, and elemental systems.");
    case "nte-vs-wuthering-waves":
      return zh
        ? build("更适合选异环的人", "希望把动作战斗和都市生活化内容放在一起体验，比如开车、买房和城市探索。", "更适合选鸣潮的人", "更喜欢围绕声骸、末日氛围和高压动作手感来构建长期养成。")
        : build("Choose NTE if...", "You want action combat mixed with urban systems like driving, housing, and city exploration.", "Choose WuWa if...", "You prefer an Echo-focused progression loop and a heavier post-apocalyptic combat atmosphere.");
    case "nte-vs-zzz":
      return zh
        ? build("更适合选异环的人", "想要开放世界自由度，而不是主要在关卡和战斗房间里循环推进。", "更适合选绝区零的人", "偏爱更集中、更短回合的战斗与演出节奏，不一定需要开放世界。")
        : build("Choose NTE if...", "You want open-world freedom rather than a mostly stage-based loop.", "Choose ZZZ if...", "You prefer tighter, shorter combat cycles and stylish staged progression over open-world scale.");
    case "nte-vs-ananta":
      return zh
        ? build("更适合选异环的人", "现在就要开玩，并且更在意无 50/50、载具和房屋系统这些已落地功能。", "更适合继续等无限大的人", "愿意等待网易方案正式成型，并把题材相似度放在比上线时间更高的位置。")
        : build("Choose NTE if...", "You want a live game right now and care about no-50/50, driving, and housing systems that already exist.", "Keep watching Ananta if...", "You're happy to wait for NetEase's version and care more about theme overlap than immediate availability.");
    case "nte-vs-honkai-star-rail":
      return zh
        ? build("更适合选异环的人", "偏动作、偏探索、愿意自己操作角色并享受开放地图带来的节奏变化。", "更适合选星穹铁道的人", "偏策略、偏剧情、喜欢回合制队伍规划和更轻的操作负担。")
        : build("Choose NTE if...", "You want action, exploration, and direct control inside a freer map structure.", "Choose HSR if...", "You prefer strategy, story cadence, and lower mechanical execution with turn-based teams.");
    default:
      return null;
  }
}

function getCompareSupportCopy(slug: string, locale: Locale) {
  const zh = isZhLocale(locale);
  const tw = locale === "tw";

  const generic = {
    introTitle: zh ? (tw ? "這頁對比最適合怎麼看？" : "这页对比最适合怎么用？") : "How should you use this comparison?",
    introBody: zh
      ? (tw
          ? "先用這頁判斷兩款遊戲在戰鬥節奏、抽卡成本、世界結構與目前上線狀態上的核心差異，再跳去角色、卡池或入坑指南確認細節。這頁最適合做選遊戲判斷，不適合替代單獨的配隊、配置或版本頁。"
          : "先用这页判断两款游戏在战斗节奏、抽卡成本、世界结构与当前上线状态上的核心差异，再跳去角色、卡池或入坑指南确认细节。这页最适合做选游戏判断，不适合替代单独的配队、配置或版本页。")
      : "Use this page to judge the biggest differences in combat rhythm, banner cost, world structure, and current live status before jumping into character, banner, or onboarding pages. It is best for choosing between games, not for replacing build, system, or patch guides.",
    checkFirstTitle: zh ? (tw ? "先看什麼" : "先看什么") : "What should you compare first?",
    mistakesTitle: zh ? (tw ? "常見誤區" : "常见误区") : "Common mistakes",
    checkFirst: zh
      ? [
          tw ? "先確認你更在意的是戰鬥手感、抽卡友好度，還是世界題材與生活化玩法。" : "先确认你更在意的是战斗手感、抽卡友好度，还是世界题材与生活化玩法。",
          tw ? "把“現在能不能玩、更新成熟度如何”放進判斷，而不是只看宣傳概念。" : "把“现在能不能玩、更新成熟度如何”放进判断，而不是只看宣传概念。",
          tw ? "如果你和朋友要一起入坑，順手確認平台、區服與多人邊界。" : "如果你和朋友要一起入坑，顺手确认平台、区服与多人边界。",
        ]
      : [
          "Decide whether combat feel, banner value, or world theme matters most to you first.",
          "Include live status and update maturity in the comparison instead of judging from trailers alone.",
          "If you're starting with friends, verify platforms, server tracks, and co-op boundaries too.",
        ],
    mistakes: zh
      ? [
          tw ? "只看題材相近，就預設兩款遊戲的戰鬥節奏與養成壓力也一樣。" : "只看题材相近，就预设两款游戏的战斗节奏与养成压力也一样。",
          tw ? "把早期測試資訊或舊版本印象當成現在依然有效的結論。" : "把早期测试信息或旧版本印象当成现在依然有效的结论。",
          tw ? "只比較抽卡，不比較長線內容成熟度與你真正會玩的日常循環。" : "只比较抽卡，不比较长线内容成熟度与自己真正会玩的日常循环。",
        ]
      : [
          "Assuming a similar theme means the same combat pace and progression pressure.",
          "Treating older beta or early-version impressions as if they still define the current game.",
          "Comparing banner rules only and ignoring long-term content maturity and your actual play loop.",
        ],
  };

  if (slug === "nte-vs-honkai-star-rail") {
    return {
      ...generic,
      checkFirst: zh
        ? [
            tw ? "先確認你要的是親自操作的動作開放世界，還是回合制隊伍策略。" : "先确认你要的是亲自操作的动作开放世界，还是回合制队伍策略。",
            tw ? "如果你遊戲時間零碎，順手比較日常耗時與自動化負擔。" : "如果你游戏时间零碎，顺手比较日常耗时与自动化负担。",
            tw ? "把地圖探索需求和劇情演出偏好一起算進去。" : "把地图探索需求和剧情演出偏好一起算进去。",
          ]
        : [
            "Decide whether you want direct-control open-world action or turn-based team strategy first.",
            "If your play sessions are short, compare daily-time demand and automation comfort too.",
            "Weigh exploration needs alongside story-presentation preference.",
          ],
      mistakes: zh
        ? [
            tw ? "只因為都是二次元抽卡，就把它們當成同一類主玩法。" : "只因为都是二次元抽卡，就把它们当成同一类主玩法。",
            tw ? "拿單一角色強度直接替代整體玩法匹配度判斷。" : "拿单一角色强度直接替代整体玩法匹配度判断。",
            tw ? "忽略回合制與動作遊戲在操作負擔上的根本差異。" : "忽略回合制与动作游戏在操作负担上的根本差异。",
          ]
        : [
            "Treating them as the same genre just because both are anime gacha games.",
            "Using one character's strength to replace the broader fit of the whole game loop.",
            "Ignoring the basic execution-gap between turn-based and action-heavy play.",
          ],
    };
  }

  return generic;
}

function getCompareFaqs(slug: string) {
  const faqs: Record<string, { question: string; questionZh: string; answer: string; answerZh: string }[]> = {
    "nte-vs-genshin": [
      {
        question: "Is NTE better than Genshin Impact?",
        questionZh: "异环比原神更好吗？",
        answer: "It depends on your preference. NTE offers modern urban fantasy, no 50/50 gacha, and action combo combat. Genshin has a more mature ecosystem, broader platform support, and elemental reaction strategy. Both are excellent free-to-play games worth trying.",
        answerZh: "取决于个人喜好。异环提供现代都市奇幻、无50/50抽卡和动作连招战斗。原神有更成熟的生态、更广的平台支持和元素反应策略。两款都是优秀的免费游戏，值得尝试。"
      },
      {
        question: "Can I play NTE and Genshin at the same time?",
        questionZh: "可以同时玩异环和原神吗？",
        answer: "Yes, both are free-to-play and don't require exclusivity. Many players enjoy both games, using NTE for its urban setting and Genshin for its fantasy world.",
        answerZh: "可以。两款游戏都是免费的，不要求排他性。很多玩家同时享受两款游戏，用异环体验都市设定，用原神探索奇幻世界。"
      },
      {
        question: "Which game is more F2P friendly?",
        questionZh: "哪款游戏对零氪玩家更友好？",
        answer: "NTE is generally considered more F2P-friendly due to its no 50/50 gacha system and 90-pull hard pity that guarantees the featured character. Genshin requires up to 180 pulls for guarantee if you lose the 50/50.",
        answerZh: "异环通常被认为更友好，因为它没有50/50机制，90抽保底必出UP角色。原神如果歪了可能需要180抽才能保底。"
      },
    ],
    "nte-vs-wuthering-waves": [
      {
        question: "Is NTE similar to Wuthering Waves?",
        questionZh: "异环和鸣潮相似吗？",
        answer: "Both are anime action RPGs, but NTE features modern urban fantasy setting while Wuthering Waves has a post-apocalyptic world. NTE uses a no-50/50 gacha system while WuWa has a traditional 50/50 system. Combat styles also differ significantly.",
        answerZh: "两款都是二次元动作RPG，但异环是现代都市奇幻设定，鸣潮是后末日世界。异环没有50/50抽卡机制，鸣潮有传统50/50。战斗风格也有明显差异。"
      },
      {
        question: "Which has better combat: NTE or Wuthering Waves?",
        questionZh: "异环和鸣潮哪个战斗更好？",
        answer: "Wuthering Waves has deeper action combat with dodge/parry mechanics. NTE focuses more on character switching combos and anomaly chain mechanics. If you prefer pure action, WuWa may appeal more. If you like strategic team switching, NTE is compelling.",
        answerZh: "鸣潮有更深的动作战斗，包含闪避弹反机制。异环更注重角色切换连招和异环链机制。如果你喜欢纯粹的动作感，鸣潮更合适。如果你喜欢策略性切换，异环更有吸引力。"
      },
    ],
    "games-like-nte": [
      {
        question: "What games are similar to Neverness to Everness?",
        questionZh: "有哪些类似异环的游戏？",
        answer: "Games similar to NTE include Genshin Impact, Wuthering Waves, Zenless Zone Zero, Tower of Fantasy, and Honkai: Star Rail. All feature anime-style graphics, gacha character acquisition, and action RPG gameplay.",
        answerZh: "类似异环的游戏包括原神、鸣潮、绝区零、幻塔和崩坏：星穹铁道。它们都有二次元画风、抽卡角色获取和动作RPG玩法。"
      },
      {
        question: "Is NTE free to play?",
        questionZh: "异环是免费游戏吗？",
        answer: "Yes, Neverness to Everness is completely free to download and play. It uses an optional in-game purchase model for character acquisition through the gacha system.",
        answerZh: "是的，异环完全免费下载和游玩。游戏使用可选的内购模式，通过抽卡系统获取角色。"
      },
    ],
    "nte-vs-zzz": [
      {
        question: "Is NTE better than Zenless Zone Zero?",
        questionZh: "异环比绝区零更好吗？",
        answer: "They are different experiences. NTE is a true open-world game with driving, housing, and urban exploration. ZZZ focuses on instanced combat and TV-style exploration. If you want an open world, choose NTE. If you prefer polished instanced combat, ZZZ may appeal more.",
        answerZh: "两者体验不同。异环是真正的开放世界，有驾驶、买房和城市探索。绝区零专注于关卡制战斗和TV式探索。如果你想要开放世界，选异环。如果你更喜欢精良的关卡制战斗，绝区零更合适。"
      },
      {
        question: "Which is more F2P friendly: NTE or ZZZ?",
        questionZh: "异环和绝区零哪个对零氪更友好？",
        answer: "NTE is significantly more F2P-friendly. NTE has no 50/50 mechanic on the limited banner (guaranteed featured character), gives ~418 free pulls at launch, offers beginner banner selector, and provides a free S-rank from City Tycoon. ZZZ has a traditional 50/50 system requiring up to 180 pulls for guarantee.",
        answerZh: "异环对零氪友好得多。异环限定池无50/50（必出UP角色），开服送约418抽，新手池可自选，城市经营送免费S级角色。绝区零有传统50/50机制，大保底需180抽。"
      },
      {
        question: "Can I play both NTE and ZZZ?",
        questionZh: "可以同时玩异环和绝区零吗？",
        answer: "Yes, both are free-to-play. They offer different enough experiences that many players enjoy both. NTE for open-world urban exploration and ZZZ for stylized combat sessions.",
        answerZh: "可以，两款都是免费的。它们体验差异足够大，很多玩家同时享受两款。异环玩开放世界城市探索，绝区零玩风格化战斗。"
      },
    ],
    "nte-vs-ananta": [
      {
        question: "Is Neverness to Everness the same game as Ananta?",
        questionZh: "异环和无限大是同一款游戏吗？",
        answer: "No, they are completely different games by different developers. NTE is developed by Hotta Studio (Perfect World) and Ananta is developed by NetEase. Both are urban-themed anime RPGs, which is why they are often confused, but they have different combat systems, gacha mechanics, and unique features.",
        answerZh: "不是，它们是完全不同的游戏，由不同开发商制作。异环由完美世界/幻塔工作室开发，无限大由网易开发。两款都是都市题材二次元RPG，因此常被混淆，但它们在战斗系统、抽卡机制和特色玩法上完全不同。"
      },
      {
        question: "Which is more F2P friendly: NTE or Ananta?",
        questionZh: "异环和无限大哪个对零氪更友好？",
        answer: "NTE is significantly more F2P-friendly. NTE has no 50/50 mechanic on the limited banner (guaranteed featured character every time), gives ~418 free pulls at launch, and provides a free S-rank from City Tycoon. Ananta uses a traditional 50/50 gacha system where you may need up to 180 pulls for a guaranteed featured character.",
        answerZh: "异环对零氪友好得多。异环限定池无50/50机制（每次必出UP角色），开服送约418抽，城市经营送免费S级角色。无限大使用传统50/50抽卡系统，可能需要180抽才能保底UP角色。"
      },
      {
        question: "Why do people confuse NTE with Ananta?",
        questionZh: "为什么人们会把异环和无限大搞混？",
        answer: "Both games are modern urban-themed anime action RPGs that launched around the same time period (2026). They share similar aesthetics and gameplay concepts — open world, gacha characters, modern city setting. However, they are made by entirely different companies and have distinct combat systems, gacha policies, and unique features like NTE's driving and housing systems.",
        answerZh: "两款游戏都是现代都市题材的二次元动作RPG，且都在2026年前后上线。它们共享类似的美学和玩法概念——开放世界、抽卡角色、现代城市设定。但它们由完全不同的公司制作，在战斗系统、抽卡政策和特色功能（如异环的驾驶和买房系统）上有明显区别。"
      },
    ],
  };
  return faqs[slug] || null;
}
