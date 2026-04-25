import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { ArticleContent } from "../../../components/ArticleContent";
import { getCompare } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import { CompareTable } from "../../../components/CompareTable";
import type { CompareArticle } from "../../../lib/queries";

interface ComparePageProps {
  params: { lang: string; slug: string };
}

export async function generateCompareMetadata({ params }: ComparePageProps) {
  const { lang, slug } = await params;
  const article = getCompare(slug);
  if (!article) return {};
  const locale = lang as Locale;
  const rawTitle = isZhLocale(locale) ? article.title : article.titleEn;
  const description = isZhLocale(locale) ? article.summary : article.summaryEn;
  const title = `${rawTitle} (2026) | NTE Guide`;
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

  const title = isZhLocale(locale) ? article.title : article.titleEn;
  const content = isZhLocale(locale) ? article.content : article.contentEn;
  const summary = isZhLocale(locale) ? article.summary : article.summaryEn;
  const category = isZhLocale(locale) ? article.categoryZh : article.categoryEn;
  const url = `https://nteguide.com/${lang}/compare/${slug}`;

  // Determine comparison table based on slug
  const compareTable = getCompareTable(slug, locale);

  return (
    <>
      <ArticleJsonLd title={title} description={summary} url={url} datePublished={article.date} />
      {getCompareFaqs(slug) && <FaqPageJsonLd faqs={getCompareFaqs(slug)!} lang={locale} />}
      <BreadcrumbJsonLd
        items={[
          { name: "NTE Guide", url: "https://nteguide.com" },
          { name: isZhLocale(locale) ? "对比" : "Compare", url: `https://nteguide.com/${lang}/compare/${slug}` },
          { name: title },
        ]}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZhLocale(locale) ? "游戏对比" : "Compare", href: `/${lang}/compare/${slug}` },
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

        {/* Compare Table */}
        {compareTable && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">
              {isZhLocale(locale) ? "快速对比" : "Quick Comparison"}
            </h2>
            <CompareTable
              headers={compareTable.headers}
              items={compareTable.items}
              highlight={0}
            />
          </section>
        )}

        {/* Content */}
        <ArticleContent content={content} />

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
              {isZhLocale(locale) ? "相关内容" : "Related Content"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {article.internalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${lang}${link.href}`}
                  className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
                >
                  <span className="text-sm">
                    {isZhLocale(locale) ? link.label : link.labelEn}
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
          { name: "抽卡保底", values: ["测试中", "90 抽大保底"] },
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
        { name: "Gacha Pity", values: ["TBD", "90 pulls"] },
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

  return null;
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
  };
  return faqs[slug] || null;
}
