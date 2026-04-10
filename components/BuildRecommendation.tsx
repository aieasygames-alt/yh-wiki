import type { RecommendedBuild } from "../lib/queries";

interface BuildRecommendationProps {
  build: RecommendedBuild;
  locale: "zh" | "en";
}

export function BuildRecommendation({
  build,
  locale,
}: BuildRecommendationProps) {
  const bestWeapon = locale === "zh" ? build.bestWeapon : build.bestWeaponEn;
  const bestDiskSet = locale === "zh" ? build.bestDiskSet : build.bestDiskSetEn;
  const altWeapons = build.alternativeWeapons.map((w) => ({
    id: w.id,
    name: locale === "zh" ? w.name : w.nameEn,
  }));
  const mainStats = locale === "zh" ? build.mainStats : build.mainStatsEn;
  const subStats = locale === "zh" ? build.subStatPriority : build.subStatPriorityEn;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">
        {locale === "zh" ? "推荐配置" : "Recommended Build"}
      </h2>
      <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5 space-y-5">
        {/* Best Weapon */}
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {locale === "zh" ? "最佳武器" : "Best Weapon"}
          </h3>
          <p className="text-sm font-medium text-primary-400">{bestWeapon}</p>
        </div>

        {/* Alternative Weapons */}
        {altWeapons.length > 0 && (
          <div>
            <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              {locale === "zh" ? "替代武器" : "Alternative Weapons"}
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
            {locale === "zh" ? "最佳驱动盘" : "Best Disk Set"}
          </h3>
          <p className="text-sm font-medium text-primary-400">{bestDiskSet}</p>
        </div>

        {/* Main Stats */}
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {locale === "zh" ? "主词条" : "Main Stats"}
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
              {locale === "zh" ? "副词条优先级" : "Sub Stat Priority"}
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
