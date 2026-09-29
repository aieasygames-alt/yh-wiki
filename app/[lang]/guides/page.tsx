import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllGuides, getGuideCategories } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";

// Category icon + color mapping
const CATEGORY_STYLES: Record<string, { icon: string; color: string; gradient: string }> = {
  beginner: { icon: "🌟", color: "text-yellow-400", gradient: "from-yellow-500/10 to-transparent" },
  combat: { icon: "⚔️", color: "text-red-400", gradient: "from-red-500/10 to-transparent" },
  advanced: { icon: "🎯", color: "text-purple-400", gradient: "from-purple-500/10 to-transparent" },
  exploration: { icon: "🗺️", color: "text-emerald-400", gradient: "from-emerald-500/10 to-transparent" },
  characters: { icon: "👤", color: "text-primary-400", gradient: "from-primary-500/10 to-transparent" },
  bosses: { icon: "👾", color: "text-orange-400", gradient: "from-orange-500/10 to-transparent" },
  tierlist: { icon: "🏆", color: "text-yellow-400", gradient: "from-yellow-500/10 to-transparent" },
  equipment: { icon: "🔧", color: "text-sky-400", gradient: "from-sky-500/10 to-transparent" },
  farming: { icon: "💰", color: "text-amber-400", gradient: "from-amber-500/10 to-transparent" },
  collectibles: { icon: "💎", color: "text-cyan-400", gradient: "from-cyan-500/10 to-transparent" },
  systems: { icon: "⚙️", color: "text-gray-400", gradient: "from-gray-500/10 to-transparent" },
  faq: { icon: "❓", color: "text-blue-400", gradient: "from-blue-500/10 to-transparent" },
  comparison: { icon: "⚖️", color: "text-indigo-400", gradient: "from-indigo-500/10 to-transparent" },
  other: { icon: "📋", color: "text-gray-400", gradient: "from-gray-500/10 to-transparent" },
};

function getCategoryStyle(slug: string) {
  return CATEGORY_STYLES[slug] || CATEGORY_STYLES.other;
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const guides = getAllGuides();
  const categories = getGuideCategories(locale);
  const title = isZhLocale(locale)
    ? (locale === "tw" ? "異環攻略歷史資料庫" : "异环攻略历史资料库")
    : "NTE Guide Archive | Historical References";
  const description = locale === "tw"
    ? `異環攻略歷史資料庫收錄 ${guides.length} 篇文章與 ${categories.length} 個分類，包含新手、隊伍、探索、Boss、版本與資源記錄。現行規則請以目標區服客戶端與官方公告為準。`
    : locale === "zh"
    ? `异环攻略历史资料库收录 ${guides.length} 篇文章与 ${categories.length} 个分类，包含新手、队伍、探索、Boss、版本与资源记录。现行规则请以目标区服客户端与官方公告为准。`
    : `Browse ${guides.length} historical NTE guide references across ${categories.length} categories covering beginner, team, exploration, boss, version, and resource records. Verify live rules in the target server's client and official notices.`;

  return {
    title,
    description,
    alternates: hreflangAlternates("guides", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function GuidesListPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const guides = getAllGuides();
  const categories = getGuideCategories(locale);

  const guidesByCategory = categories.map((cat) => ({
    ...cat,
    guides: guides.filter((g) => g.category === cat.slug),
  }));

  const totalGuides = guides.length;

  return (
    <>
      <ItemListJsonLd
        items={guides.map((g) => ({
          name: isZhLocale(locale) ? g.title : g.titleEn,
          url: `https://nteguide.com/${lang}/guides/${g.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "guides.title") },
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="relative mb-10 rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-900/20 via-gray-900/30 to-purple-900/10 p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {isZhLocale(locale) ? (locale === "tw" ? "異環攻略歷史資料庫" : "异环攻略历史资料库") : "NTE Guide Archive"}
            </h1>
            <p className="text-gray-400 text-lg mb-6 max-w-2xl">
              {isZhLocale(locale)
                ? (locale === "tw" ? "查閱站內收錄的新手、隊伍、探索、Boss、版本與資源歷史資料；現行規則請先在客戶端與官方公告核對。" : "查阅站内收录的新手、队伍、探索、Boss、版本与资源历史资料；现行规则请先在客户端与官方公告核对。")
                : "Browse site-recorded beginner, team, exploration, boss, version, and resource references. Verify live rules in the client and official notices first."}
            </p>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/30 w-fit">
              <span className="text-2xl font-bold text-primary-400">{totalGuides}</span>
              <span className="text-sm text-gray-400">{isZhLocale(locale) ? "篇历史资料" : "Historical references"}</span>
            </div>
          </div>
        </div>

        {/* Category sections */}
        {guidesByCategory.map((cat) => {
          const style = getCategoryStyle(cat.slug);
          return (
            <section key={cat.slug} className="mb-10">
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xl`}>{style.icon}</span>
                <h2 className={`text-xl font-bold ${style.color}`}>{cat.name}</h2>
                <span className="text-sm text-gray-600">({cat.guides.length})</span>
                <div className={`flex-1 h-px bg-gradient-to-r ${style.gradient}`} />
              </div>

              {/* Guide cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cat.guides.map((guide) => (
                  <Link
                    key={guide.id}
                    href={`/${lang}/guides/${guide.id}`}
                    className={`group block rounded-xl border border-gray-800 bg-gradient-to-br ${style.gradient} via-gray-900/30 to-transparent p-4 hover:border-primary-500/40 hover:bg-gray-900/50 transition-all hover:-translate-y-0.5`}
                  >
                    <h3 className="text-sm font-medium group-hover:text-primary-400 transition-colors line-clamp-2">
                      {isZhLocale(locale) ? guide.title : guide.titleEn}
                    </h3>
                    <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {isZhLocale(locale) ? guide.summary : guide.summaryEn}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {guide.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800/60 text-gray-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {guide.date && (
                        <span className="text-[10px] text-gray-600">
                          {guide.date}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
