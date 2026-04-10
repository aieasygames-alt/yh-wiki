import Link from "next/link";
import { notFound } from "next/navigation";
import { t, hreflangAlternates } from "../../../../lib/i18n";
import { getBlogPost, getAllBlogPosts } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";

export function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.flatMap((p) => [
    { lang: "zh", slug: p.id },
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
  const title = lang === "zh" ? post.title : post.titleEn;
  const description = lang === "zh" ? post.summary : post.summaryEn;
  return {
    title: `${title} | NTE Blog`,
    description,
    alternates: hreflangAlternates(`blog/${slug}`),
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
  const locale = lang as "zh" | "en";
  const post = getBlogPost(slug);
  if (!post) notFound();

  const title = locale === "zh" ? post.title : post.titleEn;
  const content = locale === "zh" ? post.content : post.contentEn;
  const summary = locale === "zh" ? post.summary : post.summaryEn;
  const category = locale === "zh" ? post.categoryZh : post.categoryEn;

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
        <div className="prose prose-invert max-w-none">
          {content.split("\n").map((paragraph, i) => (
            <p key={i} className="text-gray-300 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
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
        {post.internalLinks.length > 0 && (
          <section className="mt-10 border-t border-gray-800 pt-6">
            <h2 className="text-lg font-bold mb-4">
              {locale === "zh" ? "相关内容" : "Related Content"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {post.internalLinks.map((link) => (
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
