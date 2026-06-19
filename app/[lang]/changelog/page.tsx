import { getAllChangelogs } from "../../../lib/queries";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = t(locale, "changelog.seoTitle");
  const description = t(locale, "changelog.description");
  return {
    title,
    description,
    alternates: hreflangAlternates("changelog", lang),
    openGraph: { title, description },
  };
}

export default async function ChangelogListPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const changelogs = getAllChangelogs();

  const typeColors: Record<string, string> = {
    major: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    minor: "bg-primary-500/20 text-primary-400 border-primary-500/30",
    fix: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "changelog.title") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">{t(locale, "changelog.title")}</h1>
        <p className="text-gray-400 mb-8">{t(locale, "changelog.description")}</p>

        <div className="space-y-6">
          {changelogs.map((cl) => {
            const dateStr = locale === "en" && cl.dateGlobal ? cl.dateGlobal : cl.date;
            const highlights = isZhLocale(locale) ? cl.highlights : cl.highlightsEn;
            const versionName = isZhLocale(locale) ? cl.versionName : cl.versionNameEn;
            const typeLabel = cl.type === "major"
              ? t(locale, "changelogDetails.major")
              : cl.type === "minor"
              ? t(locale, "changelogDetails.minor")
              : t(locale, "changelogDetails.fix");

            return (
              <Link
                key={cl.id}
                href={`/${lang}/changelog/${cl.version}`}
                className="block rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg font-bold text-primary-400">v{cl.version}</span>
                  <span className="text-sm text-gray-400">{versionName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[cl.type] || typeColors.fix}`}>
                    {typeLabel}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">{dateStr}</span>
                </div>
                <ul className="space-y-1">
                  {highlights?.slice(0, 4).map((h, i) => (
                    <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-primary-500 mt-1">•</span>
                      {h}
                    </li>
                  ))}
                </ul>
                {cl.sections && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {cl.sections.map((s) => (
                      <span key={s.title} className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-500">
                        {isZhLocale(locale) ? s.title : s.titleEn}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { href: `/${lang}/cn-vs-global`, label: isZhLocale(locale) ? "国服 vs 国际服" : "CN vs Global" },
            { href: `/${lang}/steam`, label: isZhLocale(locale) ? "Steam 版发售" : "Steam Version" },
            { href: `/${lang}/banners`, label: isZhLocale(locale) ? "卡池时间表" : "Banner Schedule" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3 text-sm text-gray-300 hover:border-primary-500/40 hover:text-primary-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
