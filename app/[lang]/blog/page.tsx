import { getAllBlogPosts } from "../../../lib/queries";
import { t, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { BlogCard } from "../../../components/BlogCard";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const title = lang === "zh" ? "异环攻略博客 - 最新资讯与深度攻略" : "NTE Blog - Latest News & In-Depth Guides";
  const description = lang === "zh"
    ? "异环（Neverness to Everness）最新攻略博客，涵盖游戏评测、版本更新、角色攻略和玩法技巧。"
    : "Neverness to Everness blog featuring game reviews, version updates, character guides, and gameplay tips.";
  return {
    title: `${title} | NTE Guide`,
    description,
    alternates: hreflangAlternates("blog"),
    openGraph: {
      title: `${title} | NTE Guide`,
      description,
    },
  };
}

export default async function BlogListPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  const posts = getAllBlogPosts();

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "blog.title") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">{t(locale, "blog.title")}</h1>
        <p className="text-gray-400 mb-8">{t(locale, "blog.description")}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              title={locale === "zh" ? post.title : post.titleEn}
              summary={locale === "zh" ? post.summary : post.summaryEn}
              category={locale === "zh" ? post.categoryZh : post.categoryEn}
              date={post.date}
              tags={post.tags}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </>
  );
}
