import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../components/JsonLd";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = isZhLocale(locale)
    ? (locale === "tw"
      ? "異環保時捷聯動攻略 — 918 Spyder 獲取方式、價格與展廳位置"
      : "异环保时捷联动攻略 — 918 Spyder 获取方式、价格与展厅位置")
    : "NTE Porsche Collab — 918 Spyder: How to Get, Price & Showroom Location";
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? "異環（NTE）× 保時捷聯動完整攻略：整理 918 Spyder 的獲取條件、展廳位置、聯動版本時間、平台支援與專屬塗裝內容。"
      : "异环（NTE）× 保时捷联动完整攻略：整理 918 Spyder 的获取条件、展厅位置、联动版本时间、平台支持与专属涂装内容。")
    : "Complete Neverness to Everness x Porsche guide covering the 918 Spyder unlock path, showroom location, collab timing, supported platforms, and exclusive liveries.";
  return {
    title,
    description,
    alternates: hreflangAlternates("porsche-collab", lang),
    openGraph: { title, description, type: "article" },
  };
}

export default async function PorscheCollabPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <>
      <ArticleJsonLd
        title={isZhLocale(locale) ? "异环保时捷联动攻略" : "NTE Porsche Collab — 918 Spyder Guide"}
        description={isZhLocale(locale) ? "918 Spyder 获取方式、价格与展厅位置" : "How to get the Porsche 918 Spyder in NTE"}
        url={`https://nteguide.com/${lang}/porsche-collab`}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZhLocale(locale) ? (locale === "tw" ? "保時捷聯動" : "保时捷联动") : "Porsche Collab" },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">
          {isZhLocale(locale)
            ? (locale === "tw" ? "異環 × 保時捷聯動完整攻略" : "异环 × 保时捷联动完整攻略")
            : "NTE x Porsche Collaboration — Complete Guide"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isZhLocale(locale)
            ? "异环（NTE）与保时捷的联动合作，带来限定车辆 Porsche 918 Spyder 和专属涂装。以下是完整的获取攻略。"
            : "The NTE x Porsche collaboration brings the exclusive Porsche 918 Spyder vehicle and special liveries. Here's everything you need to know."}
        </p>

        {/* Quick Answer for Featured Snippet */}
        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZhLocale(locale) ? "联动车型：" : "Vehicle:",
              value: "Porsche 918 Spyder",
            },
            {
              label: isZhLocale(locale) ? "上线版本：" : "Available:",
              value: isZhLocale(locale) ? "1.1 版本（2026年5月28日）" : "Version 1.1 (May 28, 2026)",
            },
            {
              label: isZhLocale(locale) ? "获取方式：" : "How to Get:",
              value: isZhLocale(locale) ? "完成联动活动任务" : "Complete collab event quests",
            },
            {
              label: isZhLocale(locale) ? "专属涂装：" : "Exclusive Livery:",
              value: isZhLocale(locale) ? "多款限定涂装可解锁" : "Multiple exclusive liveries unlockable",
            },
          ]}
        />

        {/* Overview Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "联动概览" : "Collaboration Overview"}
          </h2>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: isZhLocale(locale) ? "联动品牌" : "Brand", value: "Porsche" },
                  { label: isZhLocale(locale) ? "主推车型" : "Featured Model", value: "Porsche 918 Spyder" },
                  { label: isZhLocale(locale) ? "上线版本" : "Version", value: "1.1 (May 28, 2026)" },
                  { label: isZhLocale(locale) ? "联动类型" : "Type", value: isZhLocale(locale) ? "限定车辆 + 专属涂装" : "Limited vehicle + exclusive liveries" },
                  { label: isZhLocale(locale) ? "平台" : "Platforms", value: "PC, Android, iOS, PS5" },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-gray-800/50">
                    <td className="py-2 px-3 text-gray-400 font-medium">{row.label}</td>
                    <td className="py-2 px-3 text-gray-200">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Porsche 918 Spyder Details */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            Porsche 918 Spyder
          </h2>
          <div className="prose prose-sm prose-invert max-w-none text-gray-300 space-y-3">
            <p>
              {isZhLocale(locale)
                ? "Porsche 918 Spyder 是本次联动的旗舰车型，基于真实保时捷 918 Spyder 超级跑车设计。在游戏中，该车辆拥有出色的加速性能和极速表现，是目前游戏中最受期待的联动载具。"
                : "The Porsche 918 Spyder is the flagship vehicle of this collaboration, faithfully recreated from the real Porsche 918 Spyder supercar. In-game, it features outstanding acceleration and top speed, making it the most anticipated collab vehicle in NTE."}
            </p>
            <p>
              {isZhLocale(locale)
                ? "车辆特性："
                : "Vehicle specs:"}
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
              <li>{isZhLocale(locale) ? "顶级加速和极速性能" : "Top-tier acceleration and top speed"}</li>
              <li>{isZhLocale(locale) ? "专属保时捷造型和音效" : "Exclusive Porsche design and engine sounds"}</li>
              <li>{isZhLocale(locale) ? "支持漂移和智能巡航" : "Supports drifting and smart cruise control"}</li>
              <li>{isZhLocale(locale) ? "多款限定涂装可解锁" : "Multiple exclusive liveries to unlock"}</li>
            </ul>
          </div>
        </section>

        {/* How to Get */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "获取方式" : "How to Get the Porsche 918 Spyder"}
          </h2>
          <div className="prose prose-sm prose-invert max-w-none text-gray-300 space-y-3">
            <p>
              {isZhLocale(locale)
                ? "要获得 Porsche 918 Spyder，玩家需要完成 1.1 版本的联动活动任务："
                : "To get the Porsche 918 Spyder, players need to complete the Version 1.1 collaboration event quests:"}
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
              <li>{isZhLocale(locale) ? "更新游戏至 1.1 版本" : "Update the game to Version 1.1"}</li>
              <li>{isZhLocale(locale) ? "前往海特洛城的保时捷展厅" : "Visit the Porsche showroom in Hethereau"}</li>
              <li>{isZhLocale(locale) ? "完成联动活动指定任务" : "Complete the collab event quests"}</li>
              <li>{isZhLocale(locale) ? "领取 Porsche 918 Spyder 及专属涂装" : "Claim the Porsche 918 Spyder and exclusive liveries"}</li>
            </ol>
          </div>
        </section>

        {/* Showroom Location */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "展厅位置" : "Showroom Location"}
          </h2>
          <p className="text-sm text-gray-400 mb-3">
            {isZhLocale(locale)
              ? "保时捷展厅位于海特洛城（Hethereau）的特定区域。使用互动地图可以快速定位。"
              : "The Porsche showroom is located in a specific area of Hethereau. Use the interactive map to quickly find it."}
          </p>
          <Link
            href={`/${lang}/map`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-800 bg-gray-900/30 text-sm hover:border-primary-500/50 transition-colors"
          >
            {isZhLocale(locale) ? "打开互动地图" : "Open Interactive Map"} →
          </Link>
        </section>

        {/* Related Links */}
        <section className="mt-10 border-t border-gray-800 pt-6">
          <h2 className="text-lg font-bold mb-4">
            {isZhLocale(locale) ? "相关内容" : "Related Content"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: isZhLocale(locale) ? "载具系统" : "Vehicles", href: `/${lang}/vehicles` },
              { label: isZhLocale(locale) ? "1.1 更新日志" : "1.1 Patch Notes", href: `/${lang}/changelog/1.1` },
              { label: isZhLocale(locale) ? "载具攻略" : "Vehicle Guide", href: `/${lang}/guides/vehicle-system-guide` },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
              >
                <span className="text-sm">{link.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
