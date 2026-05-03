import { Metadata } from "next";
import { isZhLocale, Locale, hreflangAlternates, t } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";

const langs = ["zh", "tw", "en"] as const;

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const isTw = locale === "tw";

  const title = isTw
    ? "關於我們 — NTE Guide"
    : isZhLocale(locale)
      ? "关于我们 — NTE Guide"
      : "About Us — NTE Guide";
  const description = isTw
    ? "關於 NTE Guide — 異環玩家社群工具站，提供角色資料、強度排行、養成計算器等實用工具。"
    : isZhLocale(locale)
      ? "关于 NTE Guide — 异环玩家社群工具站，提供角色资料、强度排行、养成计算器等实用工具。"
      : "About NTE Guide — A community-driven resource for Neverness to Everness players.";

  return {
    title,
    description,
    alternates: hreflangAlternates("about", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function AboutPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;

  const offerItems = [
    { title: t(locale, "about.offerDbTitle"), desc: t(locale, "about.offerDbDesc") },
    { title: t(locale, "about.offerToolsTitle"), desc: t(locale, "about.offerToolsDesc") },
    { title: t(locale, "about.offerTierTitle"), desc: t(locale, "about.offerTierDesc") },
    { title: t(locale, "about.offerGuidesTitle"), desc: t(locale, "about.offerGuidesDesc") },
    { title: t(locale, "about.offerCodesTitle"), desc: t(locale, "about.offerCodesDesc") },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: t(locale, "about.breadcrumbHome"), href: `/${lang}` },
          { label: t(locale, "about.breadcrumbLabel") },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {t(locale, "about.title")}
      </h1>
      <p className="text-gray-400 mb-8 text-sm">
        {t(locale, "about.subtitle")}
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        {/* Who We Are */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "about.whoWeAreTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "about.whoWeAreContent")}
          </p>
        </section>

        {/* What We Offer */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "about.whatWeOfferTitle")}
          </h2>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-2">
            {offerItems.map((item, i) => (
              <li key={i}>
                <strong className="text-gray-300">{item.title}</strong>
                {" — "}
                {item.desc}
              </li>
            ))}
          </ul>
        </section>

        {/* Community */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "about.communityTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "about.communityContent")}
          </p>
        </section>

        {/* Disclaimer */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "about.disclaimerTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "about.disclaimerContent")}
          </p>
        </section>
      </div>
    </div>
  );
}
