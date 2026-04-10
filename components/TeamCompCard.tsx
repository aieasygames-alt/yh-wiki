import Link from "next/link";
import type { TeamComp } from "../lib/queries";

interface TeamCompCardProps {
  teams: TeamComp[];
  locale: "zh" | "en";
}

export function TeamCompCard({ teams, locale }: TeamCompCardProps) {
  if (!teams || teams.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">
        {locale === "zh" ? "推荐阵容" : "Recommended Teams"}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {teams.map((team, i) => {
          const name = locale === "zh" ? team.name : team.nameEn;
          const description =
            locale === "zh" ? team.description : team.descriptionEn;

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
