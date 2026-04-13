import Link from "next/link";
import { notFound } from "next/navigation";
import { t, hreflangAlternates } from "../../../lib/i18n";
import { getCompare } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, BreadcrumbJsonLd } from "../../../components/JsonLd";
import { CompareTable } from "../../../components/CompareTable";
import type { CompareArticle } from "../../../lib/queries";

interface ComparePageProps {
  params: { lang: string; slug: string };
}

export async function generateCompareMetadata({ params }: ComparePageProps) {
  const { lang, slug } = await params;
  const article = getCompare(slug);
  if (!article) return {};
  const locale = lang as "zh" | "en";
  const title = locale === "zh" ? article.title : article.titleEn;
  const description = locale === "zh" ? article.summary : article.summaryEn;
  return {
    title: `${title} | NTE Compare`,
    description,
    alternates: hreflangAlternates(`compare/${slug}`, lang),
    openGraph: {
      title: `${title} | NTE Compare`,
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
  const locale = lang as "zh" | "en";
  const article = getCompare(slug);
  if (!article) notFound();

  const title = locale === "zh" ? article.title : article.titleEn;
  const content = locale === "zh" ? article.content : article.contentEn;
  const summary = locale === "zh" ? article.summary : article.summaryEn;
  const category = locale === "zh" ? article.categoryZh : article.categoryEn;
  const url = `https://nteguide.com/${lang}/compare/${slug}`;

  // Determine comparison table based on slug
  const compareTable = getCompareTable(slug, locale);

  return (
    <>
      <ArticleJsonLd title={title} description={summary} url={url} datePublished={article.date} />
      <BreadcrumbJsonLd
        items={[
          { name: "NTE Guide", url: "https://nteguide.com" },
          { name: locale === "zh" ? "对比" : "Compare", url: `https://nteguide.com/${lang}/compare/${slug}` },
          { name: title },
        ]}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: locale === "zh" ? "游戏对比" : "Compare", href: `/${lang}/compare/${slug}` },
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
              {locale === "zh" ? "快速对比" : "Quick Comparison"}
            </h2>
            <CompareTable
              headers={compareTable.headers}
              items={compareTable.items}
              highlight={0}
            />
          </section>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {content.split("\n").map((paragraph, i) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith("### ")) {
              return <h3 key={i} className="text-lg font-semibold mt-6 mb-3 text-gray-200">{trimmed.slice(4)}</h3>;
            }
            if (trimmed.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-bold mt-8 mb-4 text-gray-100">{trimmed.slice(3)}</h2>;
            }
            if (/^\d+\.\s/.test(trimmed)) {
              const nameEnd = trimmed.indexOf("\n");
              const name = nameEnd > -1 ? trimmed.slice(0, nameEnd) : trimmed;
              const rest = nameEnd > -1 ? trimmed.slice(nameEnd + 1) : "";
              return (
                <div key={i} className="mb-4 pl-4 border-l-2 border-gray-700">
                  <p className="font-semibold text-gray-200">{name}</p>
                  {rest && <p className="text-gray-300 mt-1 leading-relaxed">{rest}</p>}
                </div>
              );
            }
            return <p key={i} className="text-gray-300 mb-4 leading-relaxed">{trimmed}</p>;
          })}
        </div>

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
              {locale === "zh" ? "相关内容" : "Related Content"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {article.internalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${lang}${link.href}`}
                  className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
                >
                  <span className="text-sm">
                    {locale === "zh" ? link.label : link.labelEn}
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

function getCompareTable(slug: string, locale: "zh" | "en") {
  if (slug === "nte-vs-genshin") {
    if (locale === "zh") {
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
    if (locale === "zh") {
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

  return null;
}
