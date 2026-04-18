import { getAllChangelogs } from "../../../lib/queries";
import { t, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const title = lang === "zh" ? "版本更新日志 - 异环" : "Version Changelog - NTE";
  const description = lang === "zh"
    ? "异环（Neverness to Everness）版本更新日志，包含新角色、新功能、系统优化等完整更新内容。"
    : "Neverness to Everness version changelog with new characters, features, system optimizations and more.";
  return {
    title: `${title} | NTE Guide`,
    description,
    alternates: hreflangAlternates("changelog", lang),
    openGraph: { title: `${title} | NTE Guide`, description },
  };
}

export default async function ChangelogListPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
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
            const highlights = locale === "en" ? cl.highlightsEn : cl.highlights;
            const versionName = locale === "en" ? cl.versionNameEn : cl.versionName;
            const typeLabel = cl.type === "major"
              ? (locale === "zh" ? "大版本" : "Major")
              : cl.type === "minor"
              ? (locale === "zh" ? "小版本" : "Minor")
              : (locale === "zh" ? "修复" : "Fix");

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
                  {highlights.slice(0, 4).map((h, i) => (
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
                        {locale === "en" ? s.titleEn : s.title}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
