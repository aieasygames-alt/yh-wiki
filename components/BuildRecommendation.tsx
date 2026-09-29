import type { RecommendedBuild } from "../lib/queries";
import { isZhLocale, type Locale } from "../lib/i18n";

interface BuildRecommendationProps {
  build: RecommendedBuild;
  locale: Locale;
}

export function BuildRecommendation({
  build,
  locale,
}: BuildRecommendationProps) {
  const bestWeapon = isZhLocale(locale) ? build.bestWeapon : build.bestWeaponEn;
  const bestDiskSet = isZhLocale(locale) ? build.bestDiskSet : build.bestDiskSetEn;
  const altWeapons = build.alternativeWeapons.map((w) => ({
    id: w.id,
    name: isZhLocale(locale) ? w.name : w.nameEn,
  }));
  const mainStats = isZhLocale(locale) ? build.mainStats : build.mainStatsEn;
  const subStats = isZhLocale(locale) ? build.subStatPriority : build.subStatPriorityEn;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">
        {isZhLocale(locale) ? (locale === "tw" ? "歷史構築欄位" : "历史构筑字段") : "Historical Build Fields"}
      </h2>
      <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5 space-y-5">
        {/* Best Weapon */}
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {isZhLocale(locale) ? (locale === "tw" ? "歷史武器關聯" : "历史武器关联") : "Historical weapon association"}
          </h3>
          <p className="text-sm font-medium text-primary-400">{bestWeapon}</p>
        </div>

        {/* Alternative Weapons */}
        {altWeapons.length > 0 && (
          <div>
            <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              {isZhLocale(locale) ? (locale === "tw" ? "歷史替代武器欄位" : "历史替代武器字段") : "Historical alternative weapon fields"}
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
            {isZhLocale(locale) ? (locale === "tw" ? "歷史卡帶關聯" : "历史卡带关联") : "Historical cassette association"}
          </h3>
          <p className="text-sm font-medium text-primary-400">{bestDiskSet}</p>
        </div>

        {/* Main Stats */}
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {isZhLocale(locale) ? (locale === "tw" ? "歷史主詞條欄位" : "历史主词条字段") : "Historical main-stat fields"}
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
              {isZhLocale(locale) ? (locale === "tw" ? "歷史副詞條順序" : "历史副词条顺序") : "Historical substat ordering"}
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
      <p className="mt-3 text-xs leading-5 text-amber-200/80">
        {isZhLocale(locale)
          ? (locale === "tw" ? "以上為站內歷史欄位，不代表目前畢業答案；請以客戶端核對裝備效果、數值、可獲取狀態和角色機制。" : "以上为站内历史字段，不代表当前毕业答案；请以客户端核对装备效果、数值、可获取状态和角色机制。")
          : "These are historical site fields, not current best-in-slot answers; verify equipment effects, values, availability, and character mechanics in the client."}
      </p>
    </section>
  );
}
