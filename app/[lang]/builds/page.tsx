import Link from "next/link";
import type { Metadata } from "next";
import {
  t,
  isZhLocale,
  Locale,
  LOCALES,
  hreflangAlternates,
} from "../../../lib/i18n";
import { getAvailableCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { GameImage } from "../../../components/GameImage";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";
import { localizedText } from "../../../lib/seo-copy";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const characters = getAvailableCharacters().filter((c) => c.recommendedBuild);
  const title = localizedText(
    locale,
    "异环角色构筑档案｜历史装备与词条方向",
    "NTE Character Build Archive | Historical Gear & Stat Directions"
  );
  const description = localizedText(
    locale,
    `异环角色构筑历史资料，覆盖 ${characters.length} 名角色的弧盘、卡带、主词条与副词条方向。投入前请以目标区服客户端为准。`,
    `Historical build context for ${characters.length} NTE characters, including Arc, disk, main-stat, and substat directions. Verify the target server's client before investing.`
  );

  return {
    title,
    description,
    alternates: hreflangAlternates("builds", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
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
    ? "异环角色构筑档案｜历史装备与词条方向"
    : "NTE Character Build Archive | Historical Gear & Stat Directions";
  const description = zh
    ? "一页查看异环角色的历史弧盘、卡带、主词条与副词条方向；当前技能、装备和获取状态请以客户端为准。"
    : "Compare historical Arc, disk, main-stat, and substat directions for NTE characters. Verify current skills, equipment, and availability in-client.";

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
          { label: zh ? "角色构筑档案" : "Build Archive" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {zh ? "这页构筑档案最适合怎么用？" : "How should you use this build archive?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {zh
              ? "先把它当作历史方向参考，再在目标区服客户端核对角色技能、装备效果、可获取状态与队伍触发条件。总表适合比较功能与替代件，不应作为当前版本的固定毕业答案。"
              : "Treat it as historical direction first, then verify character skills, gear effects, availability, and team triggers in the target server's client. It helps compare roles and replacements, not define a fixed current best-in-slot answer."}
          </p>
        </section>
        <div className="mb-8">
          <QuickAnswerCard
            locale={locale}
            items={[
              { label: zh ? "角色数量" : "Characters", value: `${characters.filter(c => c.recommendedBuild).length}` },
              { label: zh ? "查看详情" : "Details", value: zh ? "点击角色卡片查看历史构筑字段" : description },
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
                        type="character"
                        id={c.id}
                        name={zh ? c.name : c.nameEn}
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
                        {zh ? "历史弧盘方向" : "Historical Arc Direction"}
                      </span>
                      <span className="text-xs truncate">
                        {zh ? build.bestWeapon : build.bestWeaponEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs w-16">
                        {zh ? "历史卡带方向" : "Historical Disk Direction"}
                      </span>
                      <span className="text-xs truncate">
                        {zh ? build.bestDiskSet : build.bestDiskSetEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs w-16">
                        {zh ? "历史词条方向" : "Historical Substats"}
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

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {zh ? "参考历史构筑前先核对什么" : "Verify these before using a historical build"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{zh ? "先在客户端核对角色在你队里的当前职责，再区分站场输出、速切输出或功能位。" : "Verify the character's current role in your team in-client before treating it as an on-field, quick-swap, or utility build."}</li>
              <li>{zh ? "没有专属弧盘时，优先看词条和触发条件是否真的吃得到。" : "If you do not own the signature Arc, check whether the substat and passive condition are actually usable."}</li>
              <li>{zh ? "确认当前套装和主词条仍存在且适用，再考虑副词条效率。" : "Confirm the current set and main-stat options still exist and apply before optimizing substats."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {zh ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{zh ? "把历史字段中的套装、词条或武器直接视为当前最优解。" : "Treating historical sets, stats, or weapons as a current best-in-slot answer."}</li>
              <li>{zh ? "没有核对当前角色定位、技能效果和装备触发条件，就开始刷取或强化。" : "Farming or upgrading before verifying the character's current role, kit effects, and gear triggers."}</li>
              <li>{zh ? "忽略当前队伍条件、库存与资源成本，只按站内旧字段投入。" : "Ignoring current team conditions, inventory, and resource cost while investing from older site fields."}</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
