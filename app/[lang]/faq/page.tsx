import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllFaqs, getFaqCategories } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = locale === "zh";
  const isTw = locale === "tw";
  const enBaseTitle = "NTE FAQ — 50+ Answers: Download, Gacha Pity, Redeem Codes & More";
  const enBaseDesc = "Quick answers: Is NTE multiplayer? How to download? Can your PC run it? All active redeem codes? Gacha pity system? Cross-platform? 50+ FAQs covered.";
  const title = isTw
    ? "異環FAQ — 下載安裝、聯機多人、配置要求、兌換碼、抽卡保底等50+常見問題解答"
    : isZh
      ? "异环FAQ — 下载安装、联机多人、配置要求、兑换码、抽卡保底等50+常见问题解答"
      : locale === "en"
        ? enBaseTitle
        : `${enBaseTitle} (${locale.toUpperCase()})`;
  const description = isTw
    ? "異環(NTE)常見問題即時解答：怎麼下載？可以聯機嗎？配置要求？兌換碼怎麼用？抽卡保底機制？一次性解答所有新手疑問。"
    : isZh
      ? "异环(NTE)常见问题即时解答：怎么下载安装？可以联机吗？手机配置够吗？兑换码怎么用？抽卡保底机制？一次解答所有新手疑问。"
      : locale === "en"
        ? enBaseDesc
        : `${enBaseDesc} In ${locale.toUpperCase()}.`;
  return {
    title,
    description,
    alternates: hreflangAlternates("faq", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function FaqListPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const faqs = getAllFaqs();
  const categories = getFaqCategories(locale);

  const faqsByCategory = categories.map((cat) => ({
    ...cat,
    faqs: faqs.filter((f) => f.category === cat.slug),
  }));

  const totalFaqs = faqs.length;

  return (
    <>
      <ItemListJsonLd
        items={faqs.map((f) => ({
          name: isZhLocale(locale) ? f.question : f.questionEn,
          url: `https://nteguide.com/${lang}/faq/${f.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "faq.title") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t(locale, "faq.title")}</h1>
          <p className="mt-2 text-gray-500">
            {isZhLocale(locale)
              ? `共 ${totalFaqs} 个常见问题，覆盖新手入门、角色培养、抽卡系统等分类`
              : `${totalFaqs} frequently asked questions covering beginners, characters, gacha, and more`}
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            id="faq-search"
            type="text"
            placeholder={t(locale, "faqDetails.searchPlaceholder")}
            className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-colors"
          />
        </div>

        {/* Category Quick Jump */}
        <div className="flex flex-wrap gap-2 mb-8 sticky top-0 bg-[var(--background)] py-3 z-10 border-b border-gray-800">
          {faqsByCategory.map((cat) => (
            <a
              key={cat.slug}
              href={`#cat-${cat.slug}`}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-700 text-gray-400 hover:text-primary-400 hover:border-primary-500/50 transition-colors"
            >
              {cat.name} ({cat.faqs.length})
            </a>
          ))}
        </div>

        {/* FAQ List */}
        {faqsByCategory.map((cat) => (
          <section key={cat.slug} id={`cat-${cat.slug}`} className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-primary-400">{cat.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                {cat.faqs.length}
              </span>
            </div>
            <div className="space-y-3">
              {cat.faqs.map((faq, index) => (
                <a
                  key={faq.id}
                  href={`/${lang}/faq/${faq.id}`}
                  className="faq-item group block rounded-xl border border-gray-800 bg-gray-900/30 p-4 hover:border-primary-500/50 hover:bg-gray-900/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/5"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-md bg-gray-800 group-hover:bg-primary-500/20 flex items-center justify-center text-xs text-gray-500 group-hover:text-primary-400 transition-colors">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium group-hover:text-primary-300 transition-colors">
                        {isZhLocale(locale) ? faq.question : faq.questionEn}
                      </h3>
                      <p className="mt-1.5 text-xs text-gray-500 line-clamp-2">
                        {isZhLocale(locale) ? faq.answer : faq.answerEn}
                      </p>
                      {faq.tags && faq.tags.length > 0 && (
                        <div className="mt-2 flex gap-1.5 flex-wrap">
                          {faq.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800/80 text-gray-500"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <svg className="flex-shrink-0 w-4 h-4 text-gray-600 group-hover:text-primary-400 transition-colors mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}

        {/* No Results Message (hidden by default, shown by JS) */}
        <div id="faq-no-results" className="hidden text-center py-12">
          <p className="text-gray-500">
            {t(locale, "faqDetails.noMatching")}
          </p>
        </div>
      </div>

      {/* Client-side search script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function() {
  var input = document.getElementById('faq-search');
  if (!input) return;
  var noResults = document.getElementById('faq-no-results');
  var sections = document.querySelectorAll('section[id^="cat-"]');
  var items = document.querySelectorAll('.faq-item');

  input.addEventListener('input', function() {
    var q = this.value.toLowerCase().trim();
    var visibleCount = 0;

    items.forEach(function(item) {
      var text = item.textContent.toLowerCase();
      var show = !q || text.indexOf(q) !== -1;
      item.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    sections.forEach(function(section) {
      var visibleItems = section.querySelectorAll('.faq-item:not([style*="display: none"])');
      section.style.display = visibleItems.length > 0 ? '' : 'none';
    });

    if (noResults) {
      noResults.classList.toggle('hidden', visibleCount > 0 || !q);
    }
  });
})();
          `,
        }}
      />
    </>
  );
}
