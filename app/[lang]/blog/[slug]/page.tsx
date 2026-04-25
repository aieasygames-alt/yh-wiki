import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../../lib/i18n";
import { getBlogPost, getAllBlogPosts } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { ArticleContent } from "../../../../components/ArticleContent";

function getRelatedPosts(currentSlug: string, tags: string[], count: number) {
  const allPosts = getAllBlogPosts();
  const scored = allPosts
    .filter((p) => p.id !== currentSlug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((tag) => tags.includes(tag)).length,
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date));

  if (scored.length >= count) return scored.slice(0, count).map((s) => s.post);

  // Fallback: fill with latest posts not already selected
  const selectedIds = new Set(scored.map((s) => s.post.id));
  const fallback = allPosts
    .filter((p) => p.id !== currentSlug && !selectedIds.has(p.id))
    .sort((a, b) => b.date.localeCompare(a.date));
  return [...scored.map((s) => s.post), ...fallback].slice(0, count);
}

export function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.flatMap((p) => [
    { lang: "zh", slug: p.id },
    { lang: "tw", slug: p.id },
    { lang: "en", slug: p.id },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const title = isZhLocale(lang) ? post.title : post.titleEn;
  const description = isZhLocale(lang) ? post.summary : post.summaryEn;
  return {
    title: `${title} | NTE Blog`,
    description,
    alternates: hreflangAlternates(`blog/${slug}`, lang),
    openGraph: {
      title: `${title} | NTE Blog`,
      description,
      type: "article",
      publishedTime: post.date,
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

  const title = isZhLocale(locale) ? post.title : post.titleEn;
  const content = isZhLocale(locale) ? post.content : post.contentEn;
  const summary = isZhLocale(locale) ? post.summary : post.summaryEn;
  const category = isZhLocale(locale) ? post.categoryZh : post.categoryEn;

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={summary}
        url={`https://nteguide.com/${lang}/blog/${slug}`}
      />
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
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <p className="text-gray-400 mb-6 text-sm border-l-2 border-primary-500 pl-3">
          {summary}
        </p>
        <ArticleContent content={content} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/${lang}/tags/${tag}`}
                className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 hover:text-primary-400 transition-colors"
              >
                #{isZhLocale(locale) ? (() => { const zh = t(locale, `blog.tags.${tag}`); return zh !== `blog.tags.${tag}` ? zh : tag; })() : tag}
              </Link>
            ))}
          </div>
        )}

        {/* Internal Links */}
        {post.internalLinks.length > 0 && (
          <section className="mt-10 border-t border-gray-800 pt-6">
            <h2 className="text-lg font-bold mb-4">
              {isZhLocale(locale) ? "相关内容" : "Related Content"}
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
          const related = getRelatedPosts(slug, post.tags, 3);
          if (related.length === 0) return null;
          return (
            <section className="mt-10 border-t border-gray-800 pt-6">
              <h2 className="text-lg font-bold mb-4">
                {isZhLocale(locale) ? "推荐阅读" : "Related Posts"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {related.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/${lang}/blog/${rp.id}`}
                    className="group rounded-xl border border-gray-800 bg-gray-900/30 p-4 hover:border-primary-500/50 transition-colors"
                  >
                    <span className="text-xs text-gray-500">{rp.date}</span>
                    <h3 className="text-sm font-medium mt-1 group-hover:text-primary-400 transition-colors">
                      {isZhLocale(locale) ? rp.title : rp.titleEn}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {isZhLocale(locale) ? rp.summary : rp.summaryEn}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}
      </article>
    </>
  );
}
