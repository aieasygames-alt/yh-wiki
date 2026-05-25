import Link from "next/link";
import {
  t,
  isZhLocale,
  Locale,
  LOCALES,
} from "../../../lib/i18n";
import { getAvailableCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { TierBadge } from "../../../components/TierBadge";
import { GameImage } from "../../../components/GameImage";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function BuildsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const characters = getAvailableCharacters();

  const zh = isZhLocale(locale);

  const title = zh
    ? "异环全角色最佳Build推荐"
    : "Best Builds for All NTE Characters";
  const description = zh
    ? "一页查看所有异环角色的最佳武器（弧盘）、卡带套装、主词条与副词条优先级推荐。"
    : "View the best Arcs (weapons), Cartridge sets, main stats, and sub-stat priorities for every NTE character in one page.";

  return (
    <>
      <ItemListJsonLd
        items={characters.map((c) => ({
          name: zh ? c.name : c.nameEn,
          url: `https://nteguide.com/${lang}/characters/${c.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: zh ? "全角色Build" : "Best Builds" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <div className="mb-8">
          <QuickAnswerCard
            locale={locale}
            items={[
              { label: zh ? "角色数量" : "Characters", value: `${characters.filter(c => c.recommendedBuild).length}` },
              { label: zh ? "查看详情" : "Details", value: zh ? "点击角色卡片查看完整Build" : description },
            ]}
          />
        </div>

        {/* Build Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters
            .filter((c) => c.recommendedBuild)
            .map((c) => {
              const build = c.recommendedBuild!;
              const substats: string[] = zh
                ? (build.subStatPriority ?? [])
                : (build.subStatPriorityEn ?? []);
              return (
                <Link
                  key={c.id}
                  href={`/${lang}/characters/${c.id}`}
                  className="block rounded-lg border border-gray-800 bg-gray-900/30 p-4 hover:border-primary-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {c.image && (
                      <GameImage
                        src={c.image}
                        alt={zh ? c.name : c.nameEn}
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm truncate">
                          {zh ? c.name : c.nameEn}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                          {c.rank}
                        </span>
                        {c.tierRank && <TierBadge rank={c.tierRank} />}
                      </div>
                      <p className="text-xs text-gray-500">
                        {zh ? c.role : c.roleEn}
                      </p>
                    </div>
                  </div>

                  {/* Build Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs w-16">
                        {zh ? "最佳武器" : "Best Arc"}
                      </span>
                      <span className="text-xs truncate">
                        {zh ? build.bestWeapon : build.bestWeaponEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs w-16">
                        {zh ? "卡带" : "Disk Set"}
                      </span>
                      <span className="text-xs truncate">
                        {zh ? build.bestDiskSet : build.bestDiskSetEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs w-16">
                        {zh ? "副词条" : "Substats"}
                      </span>
                      <span className="text-xs truncate text-primary-400">
                        {substats.join(" > ")}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </>
  );
}
