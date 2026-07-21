import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getVehicle, getAllVehicles } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
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
    `${name} 属性、极速与获取方式 | 异环载具 Wiki`,
    `${vehicle.nameEn} Stats, Top Speed & How to Get`
  );
  const description = completeMetaDescription(locale, localizedText(
    locale,
    `异环载具「${name}」完整数据：${typeLabel}，极速 ${vehicle.topSpeed} km/h，来源为${sourceLabel}。查看加速、换挡、刹车、漂移评分、价格和获取建议。`,
    `${vehicle.nameEn} vehicle guide for Neverness to Everness: ${vehicle.typeEn}, top speed ${vehicle.topSpeed} km/h, source ${vehicle.sourceEn}. Check acceleration, shift, brake, drift, price, and acquisition notes.`
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
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "vehicles.title"), href: `/${lang}/vehicles` },
          { label: vehicleName },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
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
                {isZhLocale(locale) ? vehicleName : `${vehicle.nameEn} Stats & Acquisition`}
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
            {localizedText(locale, "载具概览", "Vehicle Overview")}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {localizedText(
              locale,
              `「${vehicleName}」是异环中的${typeLabel}载具，品牌为${brandLabel || "未知"}，极速 ${vehicle.topSpeed} km/h。该页面汇总基础性能、获取来源、价格和常见问题，适合在购买、收藏或对比驾驶手感前快速确认车辆定位。加速、换挡、刹车与漂移评分越高，越适合竞速、城市通勤或复杂路况探索。`,
              `${vehicle.nameEn} is a ${vehicle.typeEn} vehicle in Neverness to Everness from ${vehicle.brandEn || "an unknown brand"}, with a top speed of ${vehicle.topSpeed} km/h. This page summarizes performance, source, price, and FAQs so you can compare its driving role before buying, collecting, or using it for city traversal. Higher acceleration, shift, brake, and drift scores make it stronger for racing, commuting, or complex routes.`
            )}
          </p>
        </section>

        {/* Performance Stats */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {t(locale, "vehicles.performanceStats")}
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
            {t(locale, "vehicles.howToGet")}
          </h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{t(locale, "common.source")}</p>
                <p className="font-medium">{sourceLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{t(locale, "common.price")}</p>
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
              {localizedText(locale, "适合什么场景", "Best use cases", "適合什麼場景")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                `判断「${vehicleName}」时，先看你需要的是极速、起步、漂移还是稳定刹车。极速 ${vehicle.topSpeed} km/h 更适合长距离直线移动；如果加速和换挡评分更高，则更适合城市短程、频繁转向和任务追踪路线。`,
                `When judging ${vehicle.nameEn}, start with the driving problem you need to solve: top speed, launch, drift, or stable braking. Its ${vehicle.topSpeed} km/h top speed matters most on long straight routes, while stronger acceleration and shift scores are better for city traversal, frequent turns, and quest tracking.`,
                `判斷「${vehicleName}」時，先看你需要的是極速、起步、漂移還是穩定煞車。極速 ${vehicle.topSpeed} km/h 更適合長距離直線移動；如果加速和換檔評分更高，則更適合城市短程、頻繁轉向和任務追蹤路線。`
              )}
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {localizedText(
                locale,
                `如果来源是「${sourceLabel}」，建议先确认是否需要主线进度、商店解锁或货币储备，再决定是否优先入手。`,
                `Because the source is ${sourceLabel}, check story progress, shop unlocks, or currency reserves before prioritizing it.`,
                `如果來源是「${sourceLabel}」，建議先確認是否需要主線進度、商店解鎖或貨幣儲備，再決定是否優先入手。`
              )}
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "对比建议", "Comparison notes", "對比建議")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                `不要只按价格或外观选择载具。对比同类车辆时，把「${vehicleName}」的极速、漂移和刹车放在同一张表里看：探索路线更看重稳定和操控，竞速路线才更看重速度上限。`,
                `Do not choose a vehicle by price or appearance alone. When comparing vehicles in the same class, read ${vehicle.nameEn}'s top speed, drift, and brake scores together: exploration routes value stability and handling, while racing routes care more about speed ceiling.`,
                `不要只按價格或外觀選擇載具。對比同類車輛時，把「${vehicleName}」的極速、漂移和煞車放在同一張表裡看：探索路線更看重穩定和操控，競速路線才更看重速度上限。`
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
