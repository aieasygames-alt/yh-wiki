import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES, asLocale } from "../../../../lib/i18n";
import { getBlogPost, getAllBlogPosts, getRelatedContent } from "../../../../lib/queries";
import { localizedSeoKeywords, pickLocalizedText } from "../../../../lib/traditional";
import { completeMetaDescription } from "../../../../lib/seo-copy";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../../components/JsonLd";
import { QuickAnswerCard } from "../../../../components/QuickAnswerCard";
import { ArticleContent } from "../../../../components/ArticleContent";
import { FaqSection } from "../../../../components/FaqSection";
import { KardzPromoCard } from "../../../../components/KardzPromoCard";
import { BlogImage } from "../../../../components/BlogImage";
import dynamic from "next/dynamic";

const GiscusComments = dynamic(() => import("../../../../components/GiscusComments").then((m) => ({ default: m.GiscusComments })), { ssr: false });

const EN_BLOG_SEO: Record<string, { title: string; description: string; h1: string }> = {
  "nte-vs-genshin-vs-wuthering-waves": {
    title: "NTE vs Genshin vs Wuthering Waves - Which Open-World Anime RPG Fits You?",
    description: "NTE vs Genshin Impact vs Wuthering Waves comparison for 2026: gacha value, world design, combat feel, content depth, mobile performance, and which game to start.",
    h1: "NTE vs Genshin vs Wuthering Waves: Which Game Should You Play?",
  },
  "nte-common-issues-fixes-guide": {
    title: "NTE Bug Fixes & Troubleshooting - Crashes, FPS, Login and Stuck Issues",
    description: "NTE troubleshooting guide for common bugs: crashes, FPS stutter, login and account sync, stuck characters, missing rewards, purchase issues, and support steps.",
    h1: "NTE Bug Fixes & Troubleshooting Guide",
  },
};

export function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.flatMap((p) => LOCALES.map((lang) => ({ lang, slug: p.id })));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const locale = asLocale(lang);
  const enSeo = locale === "en" ? EN_BLOG_SEO[slug] : undefined;
  const title = enSeo?.title || pickLocalizedText(locale, post.title, post.titleEn, post.titleTw);
  const description = completeMetaDescription(locale, enSeo?.description || pickLocalizedText(locale, post.summary, post.summaryEn, post.summaryTw));
  return {
    title,
    description,
    keywords: localizedSeoKeywords(locale),
    alternates: hreflangAlternates(`blog/${slug}`, lang),
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      ...(post.image ? { images: [{ url: `https://nteguide.com${post.image}`, width: 1920, height: 1080, alt: post.imageAlt || title }] } : {}),
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const title = pickLocalizedText(locale, post.title, post.titleEn, post.titleTw);
  const enSeo = locale === "en" ? EN_BLOG_SEO[slug] : undefined;
  const content = pickLocalizedText(locale, post.content, post.contentEn, post.contentTw);
  const summary = pickLocalizedText(locale, post.summary, post.summaryEn, post.summaryTw);
  const category = isZhLocale(locale) ? post.categoryZh : post.categoryEn;

  return (
    <>
      <ArticleJsonLd
        title={enSeo?.title || title}
        description={summary}
        url={`https://nteguide.com/${lang}/blog/${slug}/`}
        datePublished={post.date}
        dateModified={post.date}
        image={post.image ? `https://nteguide.com${post.image}` : undefined}
      />
      {post.faq && post.faq.length > 0 && (
        <FaqPageJsonLd faqs={post.faq} lang={locale} />
      )}
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "blog.title"), href: `/${lang}/blog` },
          { label: title },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400">
            {category}
          </span>
          <time className="text-xs text-gray-500" dateTime={post.date}>
            {post.date}
          </time>
        </div>
        <h1 className="text-2xl font-bold mb-6">{enSeo?.h1 || title}</h1>
        {post.image && (
          <BlogImage src={post.image} alt={post.imageAlt || title} />
        )}
        <p className="text-gray-400 mb-6 text-sm border-l-2 border-primary-500 pl-3">
          {summary}
        </p>

        {/* Quick Answer — GEO optimized */}
        {summary && (
          <QuickAnswerCard
            locale={locale}
            items={[
              {
                label: isZhLocale(locale) ? "摘要：" : "Summary:",
                value: summary,
              },
            ]}
          />
        )}

        <div className="mb-6">
          <KardzPromoCard locale={locale} variant="compact" />
        </div>
        <ArticleContent content={content} lang={lang} />

        {post.faq && post.faq.length > 0 && (
          <FaqSection faqs={post.faq} locale={locale} />
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400"
              >
                #{isZhLocale(locale) ? (() => { const zh = t(locale, `blog.tags.${tag}`); return zh !== `blog.tags.${tag}` ? zh : tag; })() : tag}
              </span>
            ))}
          </div>
        )}

        {/* Internal Links */}
        {post.internalLinks.length > 0 && (
          <section className="mt-10 border-t border-gray-800 pt-6">
            <h2 className="text-lg font-bold mb-4">
              {t(locale, "blogDetails.relatedContent")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {post.internalLinks.map((link) => (
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

        {/* Related Posts */}
        {(() => {
          const related = getRelatedContent(slug, post.tags, 3);
          if (related.length === 0) return null;
          return (
            <section className="mt-10 border-t border-gray-800 pt-6">
              <h2 className="text-lg font-bold mb-4">
                {isZhLocale(locale) ? (locale === "tw" ? "延伸閱讀" : "延伸阅读") : "Keep Reading"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {related.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/${lang}${rp.href}`}
                    className="group rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden hover:border-primary-500/50 transition-colors"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                        <span>{rp.kind === "guide" ? (isZhLocale(locale) ? "攻略" : "Guide") : (isZhLocale(locale) ? "文章" : "Post")}</span>
                        <span>{rp.date}</span>
                      </div>
                      <h3 className="text-sm font-medium mt-1 group-hover:text-primary-400 transition-colors">
                        {pickLocalizedText(locale, rp.title, rp.titleEn, rp.titleTw)}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {pickLocalizedText(locale, rp.summary, rp.summaryEn, rp.summaryTw)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}
        {/* Player Discussion */}
        <GiscusComments locale={locale} term={`blog-${slug}`} />
      </article>
    </>
  );
}
