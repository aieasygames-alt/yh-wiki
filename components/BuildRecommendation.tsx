import type { RecommendedBuild } from "../lib/queries";
import type { Locale } from "../lib/i18n";

interface BuildRecommendationProps {
  build: RecommendedBuild;
  locale: Locale;
}

export function BuildRecommendation({
  build,
  locale,
}: BuildRecommendationProps) {
  const bestWeapon = locale === "en" ? build.bestWeaponEn : build.bestWeapon;
  const bestDiskSet = locale === "en" ? build.bestDiskSetEn : build.bestDiskSet;
  const altWeapons = build.alternativeWeapons.map((w) => ({
    id: w.id,
    name: locale === "en" ? w.nameEn : w.name,
  }));
  const mainStats = locale === "en" ? build.mainStatsEn : build.mainStats;
  const subStats = locale === "en" ? build.subStatPriorityEn : build.subStatPriority;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">
        {locale === "en" ? "Recommended Build" : "推荐配置"}
      </h2>
      <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5 space-y-5">
        {/* Best Weapon */}
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {locale === "en" ? "Best Weapon" : "最佳武器"}
          </h3>
          <p className="text-sm font-medium text-primary-400">{bestWeapon}</p>
        </div>

        {/* Alternative Weapons */}
        {altWeapons.length > 0 && (
          <div>
            <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              {locale === "en" ? "Alternative Weapons" : "替代武器"}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {altWeapons.map((w) => (
                <li
                  key={w.id}
                  className="rounded-md bg-gray-800/60 px-3 py-1 text-sm text-gray-300"
                >
                  {w.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Best Disk Set */}
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {locale === "en" ? "Best Disk Set" : "最佳驱动盘"}
          </h3>
          <p className="text-sm font-medium text-primary-400">{bestDiskSet}</p>
        </div>

        {/* Main Stats */}
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {locale === "en" ? "Main Stats" : "主词条"}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(mainStats).map(([key, value]) => (
              <div
                key={key}
                className="rounded-md bg-gray-800/50 px-3 py-2 text-sm"
              >
                <span className="text-gray-500">{key}: </span>
                <span className="text-gray-300">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sub Stat Priority */}
        {subStats.length > 0 && (
          <div>
            <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              {locale === "en" ? "Sub Stat Priority" : "副词条优先级"}
            </h3>
            <ol className="flex flex-wrap gap-2">
              {subStats.map((stat, i) => (
                <li
                  key={i}
                  className="flex items-center gap-1.5 rounded-md bg-gray-800/50 px-3 py-1 text-sm"
                >
                  <span className="text-primary-400 font-bold text-xs">
                    {i + 1}
                  </span>
                  <span className="text-gray-300">{stat}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
