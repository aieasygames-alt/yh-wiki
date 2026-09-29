import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getVehicle, getAllVehicles } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { BreadcrumbJsonLd, FaqPageJsonLd } from "../../../../components/JsonLd";
import { FaqSection } from "../../../../components/FaqSection";
import { GameImage } from "../../../../components/GameImage";
import { completeMetaDescription, localizedName, localizedText } from "../../../../lib/seo-copy";

export function generateStaticParams() {
  const vehicles = getAllVehicles();
  return vehicles.flatMap((v) => LOCALES.map((lang) => ({ lang, slug: v.id })));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return {};
  const locale = lang as Locale;
  const name = localizedName(locale, vehicle.name, vehicle.nameEn);
  const typeLabel = localizedText(locale, vehicle.type, vehicle.typeEn);
  const sourceLabel = localizedText(locale, vehicle.source, vehicle.sourceEn);
  const title = localizedText(
    locale,
    `${name} 历史性能与来源记录 | 异环载具资料`,
    `${vehicle.nameEn} Historical Stats & Acquisition Record`
  );
  const description = completeMetaDescription(locale, localizedText(
    locale,
    `异环载具「${name}」的历史字段记录：${typeLabel}，记录极速 ${vehicle.topSpeed} km/h，记录来源为${sourceLabel}。性能、价格和获取信息须以目标客户端与官方公告复核。`,
    `Historical NTE record for ${vehicle.nameEn}: ${vehicle.typeEn}, recorded top speed ${vehicle.topSpeed} km/h, recorded source ${vehicle.sourceEn}. Verify performance, price, and acquisition details in your target client and official notices.`
  ));

  return {
    title,
    description,
    alternates: hreflangAlternates(`vehicles/${slug}`, lang),
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

function StatBar({ label, value }: { label: string; value: number | null }) {
  if (value === null) return null;
  const pct = (value / 10) * 100;
  const colorClass = value >= 8 ? "bg-yellow-500" : value >= 5 ? "bg-green-500" : value >= 3 ? "bg-blue-500" : "bg-gray-500";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${pct}%` }}></div>
      </div>
      <span className={`text-sm font-bold w-6 text-right ${value >= 8 ? "text-yellow-400" : value >= 5 ? "text-green-400" : "text-gray-400"}`}>
        {value}
      </span>
    </div>
  );
}

export default async function VehicleDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const vehicleName = localizedName(locale, vehicle.name, vehicle.nameEn);
  const typeLabel = localizedText(locale, vehicle.type, vehicle.typeEn);
  const sourceLabel = localizedText(locale, vehicle.source, vehicle.sourceEn);
  const brandLabel = localizedText(locale, vehicle.brand, vehicle.brandEn);
  const description = localizedText(locale, vehicle.description, vehicle.descriptionEn);

  const priceLabel = vehicle.price !== null
    ? (vehicle.price >= 1000000
      ? `${(vehicle.price / 1000000).toFixed(1)}M Fons`
      : vehicle.price >= 1000
        ? `${(vehicle.price / 1000).toFixed(0)}K Fons`
        : `${vehicle.price} Fons`)
    : (t(locale, "common.free"));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t(locale, "site.nav.home"), url: `https://nteguide.com/${lang}` },
          { name: t(locale, "site.nav.vehicles") || "Vehicles", url: `https://nteguide.com/${lang}/vehicles` },
          { name: vehicleName },
        ]}
      />
      {vehicle.faq && vehicle.faq.length > 0 && (
        <FaqPageJsonLd faqs={vehicle.faq} lang={locale} />
      )}
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "vehicles.title"), href: `/${lang}/vehicles` },
          { label: vehicleName },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-8 rounded-xl border border-amber-500/40 bg-amber-950/20 p-5">
          <h2 className="text-lg font-semibold text-amber-100">
            {localizedText(locale, "历史载具资料，须以当前客户端复核", "Historical vehicle reference - verify in the current client", "歷史載具資料，須以目前客戶端覆核")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-amber-50/80">
            {localizedText(
              locale,
              `本页的极速、评分、价格、来源和前置条件均为历史记录字段，不证明「${vehicleName}」当前仍存在、可取得或保持相同性能。购买、兑换或投入资源前，请在目标客户端和官方公告中确认。`,
              `This page records historical top speed, ratings, price, source, and prerequisites. It does not prove that ${vehicle.nameEn} still exists, is obtainable, or performs the same way today. Confirm it in your target client and official notices before purchasing, redeeming, or spending resources.`,
              `本頁的極速、評分、價格、來源和前置條件均為歷史記錄字段，不證明「${vehicleName}」目前仍存在、可取得或保持相同性能。購買、兌換或投入資源前，請在目標客戶端和官方公告中確認。`
            )}
          </p>
        </section>

        {/* Vehicle Info Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex gap-6">
            <GameImage
              type="vehicle"
              id={vehicle.id}
              name={vehicle.name}
              src={vehicle.image || "/images/vehicles/placeholder.webp"}
              alt={`${vehicle.name} - ${vehicle.nameEn}`}
              width={128}
              height={96}
              className="w-32 h-24 rounded-lg shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {isZhLocale(locale) ? `${vehicleName} 历史记录` : `${vehicle.nameEn} Historical Record`}
              </h1>
              <p className="text-gray-500">{locale === "en" ? vehicle.name : vehicle.nameEn}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs px-3 py-1 rounded-full border bg-gray-800 text-gray-300">
                  {typeLabel}
                </span>
                {brandLabel && (
                  <span className="text-xs px-3 py-1 rounded-full border bg-blue-900/30 text-blue-400 border-blue-500/30">
                    {brandLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            {description}
          </p>
        </div>

        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-xl font-bold mb-3">
            {localizedText(locale, "历史字段概览", "Historical field overview", "歷史字段概覽")}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {localizedText(
              locale,
              `本页归档「${vehicleName}」曾被记录为${typeLabel}、品牌为${brandLabel || "未知"}，并带有 ${vehicle.topSpeed} km/h 的极速字段。性能、来源、价格和问答仅用于保留资料线索，不构成当前版本的驾驶表现、可用性或投入建议。`,
              `This page archives a record that ${vehicle.nameEn} was listed as a ${vehicle.typeEn} from ${vehicle.brandEn || "an unknown brand"}, with a ${vehicle.topSpeed} km/h top-speed field. Performance, source, price, and FAQs preserve research leads only; they are not current-version driving, availability, or spending advice.`,
              `本頁歸檔「${vehicleName}」曾被記錄為${typeLabel}、品牌為${brandLabel || "未知"}，並帶有 ${vehicle.topSpeed} km/h 的極速字段。性能、來源、價格和問答僅用於保留資料線索，不構成目前版本的駕駛表現、可用性或投入建議。`
            )}
          </p>
        </section>

        {/* Performance Stats */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {localizedText(locale, "历史性能字段", "Historical performance fields", "歷史性能字段")}
          </h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 w-20 shrink-0">{t(locale, "vehicles.topSpeed")}</span>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${Math.min((vehicle.topSpeed / 220) * 100, 100)}%` }}></div>
              </div>
              <span className="text-sm font-bold text-red-400 w-20 text-right">{vehicle.topSpeed} km/h</span>
            </div>
            <StatBar label={t(locale, "vehicles.acceleration")} value={vehicle.stats.acceleration} />
            <StatBar label={t(locale, "vehicles.shift")} value={vehicle.stats.shift} />
            <StatBar label={t(locale, "vehicles.brake")} value={vehicle.stats.brake} />
            <StatBar label={t(locale, "vehicles.drift")} value={vehicle.stats.drift} />
          </div>
        </section>

        {/* Acquisition */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {localizedText(locale, "历史来源与价格字段", "Historical source and price fields", "歷史來源與價格字段")}
          </h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{localizedText(locale, "记录来源", "Recorded source", "記錄來源")}</p>
                <p className="font-medium">{sourceLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{localizedText(locale, "记录价格", "Recorded price", "記錄價格")}</p>
                <p className="font-medium text-primary-400">{priceLabel}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {vehicle.faq && vehicle.faq.length > 0 && (
          <FaqSection faqs={vehicle.faq} locale={locale} />
        )}

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "如何阅读这些历史字段", "How to read these historical fields", "如何閱讀這些歷史字段")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                `极速 ${vehicle.topSpeed} km/h 与加速、换挡、刹车、漂移评分反映的是资料曾记录的字段组合。它们可用于定位旧资料中的差异，但不能推导当前版本的路线效率、竞速表现或驾驶手感。`,
                `The ${vehicle.topSpeed} km/h top-speed field and the acceleration, shift, brake, and drift ratings describe a previously recorded field set. They can help locate differences in old material, but cannot establish current route efficiency, racing performance, or handling.`,
                `極速 ${vehicle.topSpeed} km/h 與加速、換檔、煞車、漂移評分反映的是資料曾記錄的字段組合。它們可用於定位舊資料中的差異，但不能推導目前版本的路線效率、競速表現或駕駛手感。`
              )}
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {localizedText(
                locale,
                `来源字段「${sourceLabel}」和记录价格「${priceLabel}」也可能失效或对应不同环境。请把它们视为复核关键词，而非当前解锁、兑换或购买依据。`,
                `The recorded source ${sourceLabel} and price ${priceLabel} may be obsolete or refer to a different environment. Treat them as verification keywords, not as a basis for current unlocks, redemption, or purchases.`,
                `來源字段「${sourceLabel}」和記錄價格「${priceLabel}」也可能失效或對應不同環境。請把它們視為覆核關鍵詞，而非目前解鎖、兌換或購買依據。`
              )}
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "核验与对比边界", "Verification and comparison limits", "覆核與對比邊界")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                `与同类条目对照时，只能比较记录内的字段差异。版本平衡、货币、驾驶规则、地区和活动条件都可能使旧数据不再可比；任何当前性能或价值判断都应回到同一目标客户端完成。`,
                `When comparing this entry with others, compare only differences within the archived fields. Version balance, currencies, driving rules, regions, and event conditions can make old data non-comparable; make any current performance or value judgment in the same target client.`,
                `與同類條目對照時，只能比較記錄內的字段差異。版本平衡、貨幣、駕駛規則、地區和活動條件都可能使舊數據不再可比；任何目前性能或價值判斷都應回到同一目標客戶端完成。`
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href={`/${lang}/vehicles/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "载具列表", "Vehicle list", "載具列表")}
              </Link>
              <Link href={`/${lang}/map/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "互动地图", "Interactive map", "互動地圖")}
              </Link>
              <Link href={`/${lang}/explorer/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "探索伴侣", "Explorer companion", "探索伴侶")}
              </Link>
            </div>
          </div>
        </section>

        {/* Back to Vehicles */}
        <div className="text-center py-8">
          <Link
            href={`/${lang}/vehicles`}
            className="inline-block px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            {`← ${t(locale, "vehicles.backToList")}`}
          </Link>
        </div>
      </div>
    </>
  );
}
