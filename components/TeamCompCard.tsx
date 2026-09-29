import Link from "next/link";
import type { TeamComp } from "../lib/queries";
import { isZhLocale, type Locale } from "../lib/i18n";
import { localizedPath } from "../lib/url";

interface TeamCompCardProps {
  teams: TeamComp[];
  locale: Locale;
}

export function TeamCompCard({ teams, locale }: TeamCompCardProps) {
  if (!teams || teams.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">
        {isZhLocale(locale) ? (locale === "tw" ? "歷史隊伍示例" : "历史队伍示例") : "Historical Team Examples"}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {teams.map((team, i) => {
          const name = isZhLocale(locale) ? team.name : team.nameEn;
          const description =
            isZhLocale(locale) ? team.description : team.descriptionEn;

          return (
            <div
              key={i}
              className="rounded-xl border border-gray-800 bg-gray-900/30 p-5"
            >
              <h3 className="text-sm font-bold mb-3">{name}</h3>

              {/* Members */}
              <div className="flex flex-wrap gap-2 mb-3">
                {team.members.map((memberId) => (
                  <Link
                    key={memberId}
                    href={localizedPath(locale, `characters/${memberId}`)}
                    className="rounded-md bg-gray-800 px-3 py-1 text-sm text-primary-400 hover:text-primary-300 hover:bg-gray-800/80 transition-colors"
                  >
                    {memberId}
                  </Link>
                ))}
              </div>

              {/* Description */}
              {description && (
                <p className="text-sm text-gray-400 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-5 text-amber-200/80">
        {isZhLocale(locale)
          ? (locale === "tw" ? "隊伍成員與說明來自歷史資料；目前角色可用性、機制和元素觸發請在目標區服客戶端核對。" : "队伍成员与说明来自历史资料；当前角色可用性、机制和元素触发请在目标区服客户端核对。")
          : "Team members and descriptions come from historical materials; verify current availability, mechanics, and element triggers in the target server's client."}
      </p>
    </section>
  );
}
