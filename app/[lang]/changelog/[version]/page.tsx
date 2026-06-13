import { getChangelogByVersion, getAllChangelogs } from "../../../../lib/queries";
import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../../lib/i18n";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const changelogs = getAllChangelogs();
  return changelogs.flatMap((cl) => LOCALES.map((lang) => ({ lang, version: cl.version })));
}

export async function generateMetadata({ params }: { params: { lang: string; version: string } }) {
  const { lang, version } = await params;
  const cl = getChangelogByVersion(version);
  if (!cl) return { title: "Not Found" };

  const versionName = isZhLocale(lang) ? cl.versionName : cl.versionNameEn;
  const title = isZhLocale(lang)
    ? `异环 ${cl.version} ${versionName} 更新日志`
    : `NTE ${cl.version} Patch Notes — ${versionName}`;
  const description = isZhLocale(lang)
    ? `异环 ${cl.version} 版本更新内容：${(cl.highlights || []).slice(0, 3).join("、")}`
    : `Neverness to Everness v${cl.version} patch notes and update details: ${(cl.highlightsEn || []).slice(0, 3).join(", ")}`;

  return {
    title,
    description,
    alternates: hreflangAlternates(`changelog/${version}`, lang),
    openGraph: { title, description },
  };
}

export default async function ChangelogDetailPage({ params }: { params: { lang: string; version: string } }) {
  const { lang, version } = await params;
  const locale = lang as Locale;
  const cl = getChangelogByVersion(version);
  if (!cl) notFound();

  const versionName = isZhLocale(locale) ? cl.versionName : cl.versionNameEn;
  const highlights = isZhLocale(locale) ? cl.highlights : cl.highlightsEn;

  const typeColors: Record<string, string> = {
    major: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    minor: "bg-primary-500/20 text-primary-400 border-primary-500/30",
    fix: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  const typeLabel = cl.type === "major"
    ? t(locale, "changelogDetails.major")
    : cl.type === "minor"
    ? t(locale, "changelogDetails.minor")
    : t(locale, "changelogDetails.fix");

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "changelog.title"), href: `/${lang}/changelog` },
          { label: `v${cl.version}` },
        ]}
      />
      <ArticleJsonLd
        title={isZhLocale(locale) ? `异环 ${versionName} 更新说明 v${cl.version}` : `Neverness to Everness ${versionName} Patch Notes v${cl.version}`}
        description={isZhLocale(locale)
          ? `${versionName} 版本（v${cl.version}，${cl.date}）更新内容与补偿说明`
          : `${versionName} (v${cl.version}, ${cl.date}) patch notes and compensation details`}
        url={`https://nteguide.com/${lang}/changelog/${version}`}
        datePublished={cl.date}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">
              <span className="text-primary-400">v{cl.version}</span> {versionName}
            </h1>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[cl.type] || typeColors.fix}`}>
              {typeLabel}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{t(locale, "changelogDetails.cn")}: {cl.date}</span>
            {cl.dateGlobal && <span>{t(locale, "changelogDetails.global")}: {cl.dateGlobal}</span>}
          </div>
        </div>

        {/* Highlights */}
        {highlights && highlights.length > 0 && (
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 mb-8">
            <h2 className="text-sm font-bold text-yellow-400 mb-2">
              {t(locale, "changelogDetails.highlights")}
            </h2>
            <ul className="space-y-1">
              {highlights.map((h, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">★</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sections */}
        {cl.sections && cl.sections.map((section, si) => {
          const sectionTitle = isZhLocale(locale) ? section.title : section.titleEn;
          return (
            <div key={si} className="mb-8">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-800">{sectionTitle}</h2>
              <div className="space-y-3">
                {section.items && section.items.map((item, ii) => {
                  const itemName = isZhLocale(locale) ? item.name : item.nameEn;
                  const itemDesc = isZhLocale(locale) ? item.description : item.descriptionEn;
                  return (
                    <div key={ii} className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        {item.ref && item.type === "character" ? (
                          <Link href={`/${lang}/characters/${item.ref}`} className="text-sm font-medium text-primary-400 hover:underline">
                            {itemName}
                          </Link>
                        ) : (
                          <span className="text-sm font-medium text-gray-200">{itemName}</span>
                        )}
                        {item.tags && item.tags.map((tag) => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">{tag}</span>
                        ))}
                      </div>
                      {itemDesc && <p className="text-xs text-gray-500">{itemDesc}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Compensation */}
        {cl.compensation && (
          <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-4 mb-8">
            <h2 className="text-sm font-bold text-primary-400 mb-1">
              {t(locale, "changelogDetails.compensation")}
            </h2>
            <p className="text-sm text-gray-300">{isZhLocale(locale) ? cl.compensation : cl.compensationEn}</p>
          </div>
        )}

        {/* Internal Links */}
        {cl.internalLinks && cl.internalLinks.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-800">
            <h3 className="text-sm font-bold text-gray-400 mb-2">
              {t(locale, "changelogDetails.relatedLinks")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cl.internalLinks.map((link) => (
                <Link
                  key={link}
                  href={`/${lang}${link}`}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-primary-400 transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-8">
          <Link href={`/${lang}/changelog`} className="text-sm text-primary-400 hover:underline">
            ← {t(locale, "changelogDetails.backToList")}
          </Link>
        </div>
      </div>
    </>
  );
}
