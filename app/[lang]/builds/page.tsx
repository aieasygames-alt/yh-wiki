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
import { TierBadge } from "../../../components/TierBadge";
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
    "异环全角色 Build 推荐 - 武器、卡带与词条优先级",
    "NTE Best Builds - Weapons, Disks, and Stat Priorities"
  );
  const description = localizedText(
    locale,
    `异环全角色 Build 总表，覆盖 ${characters.length} 名已有配装建议的角色，整理最佳弧盘、卡带套装、主词条与副词条优先级，方便快速抄作业和横向比较。`,
    `Best build list for ${characters.length} NTE characters, covering recommended Arcs, disk sets, main stats, and substat priorities for faster comparison and account planning.`
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
        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {zh ? "这页 Build 表最适合怎么用？" : "How should you use this build list?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {zh
              ? "先用它确认角色的弧盘和卡带方向，再回到单角色攻略检查配队、循环和替代件。这个总表适合快速筛选，不适合在不知道角色定位时直接无脑照搬。"
              : "Use this page to confirm each character's Arc and disk direction first, then jump into the character guide for team context, rotations, and alternatives. It is best for fast comparison, not blind copy-paste without role context."}
          </p>
        </section>
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
                        {c.tierRank && <TierBadge rank={c.tierRank} locale={locale} />}
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

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {zh ? "抄作业前先看什么" : "Check these before copying a build"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{zh ? "确认角色在你队里的职责，是站场主C、速切副C还是纯辅助。" : "Confirm whether the character is your on-field carry, quick-swap damage slot, or pure support."}</li>
              <li>{zh ? "没有专属弧盘时，优先看词条和触发条件是否真的吃得到。" : "If you do not own the signature Arc, check whether the substat and passive condition are actually usable."}</li>
              <li>{zh ? "卡带主词条通常比副词条更影响成型速度，先把主词条配对。" : "Main stat matching usually matters more than substat perfection, so solve that first."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {zh ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{zh ? "只看评分最高的套装，不看自己当前副本与资源成本。" : "Picking only the highest-rated set without considering your current farm efficiency and account budget."}</li>
              <li>{zh ? "把输出角色和功能角色都按同一套暴击思路来堆。" : "Forcing every character into the same crit-focused template, including utility units."}</li>
              <li>{zh ? "忽略配队触发条件，导致纸面强度高、实战覆盖率低。" : "Ignoring team triggers and ending up with a build that looks strong on paper but has poor uptime in real combat."}</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
