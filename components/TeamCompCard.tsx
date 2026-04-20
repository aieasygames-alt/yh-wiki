import Link from "next/link";
import type { TeamComp } from "../lib/queries";
import type { Locale } from "../lib/i18n";

interface TeamCompCardProps {
  teams: TeamComp[];
  locale: Locale;
}

export function TeamCompCard({ teams, locale }: TeamCompCardProps) {
  if (!teams || teams.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">
        {locale === "en" ? "Recommended Teams" : "推荐阵容"}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {teams.map((team, i) => {
          const name = locale === "en" ? team.nameEn : team.name;
          const description =
            locale === "en" ? team.descriptionEn : team.description;

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
                    href={`/${locale}/characters/${memberId}`}
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
    </section>
  );
}
