import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getVehicle, getAllVehicles } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { ProductJsonLd, FaqPageJsonLd } from "../../../../components/JsonLd";
import { FaqSection } from "../../../../components/FaqSection";

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

  return {
    title:
      isZhLocale(lang)
        ? `${vehicle.name} 属性 & 获取方式 | 异环游戏 Wiki`
        : `${vehicle.nameEn} Stats & How to Get - NTE Guide`,
    description:
      isZhLocale(lang)
        ? `异环载具「${vehicle.name}」详细属性数据，包含极速、加速、操控及获取方式。`
        : `Complete stats for ${vehicle.nameEn} in Neverness to Everness. Top speed, acceleration, handling, and how to get it.`,
    alternates: hreflangAlternates(`vehicles/${slug}`, lang),
    openGraph: {
      title:
        isZhLocale(lang)
          ? `${vehicle.name} | 异环游戏 Wiki`
          : `${vehicle.nameEn} Stats & Acquisition | NTE Guide`,
      description:
        isZhLocale(lang)
          ? `异环载具「${vehicle.name}」详细属性数据，极速${vehicle.topSpeed}km/h。`
          : `Complete stats for ${vehicle.nameEn} in Neverness to Everness. Top speed: ${vehicle.topSpeed} km/h.`,
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

  const typeLabel = isZhLocale(locale) ? vehicle.type : vehicle.typeEn;
  const sourceLabel = isZhLocale(locale) ? vehicle.source : vehicle.sourceEn;
  const brandLabel = isZhLocale(locale) ? vehicle.brand : vehicle.brandEn;
  const description = isZhLocale(locale) ? vehicle.description : vehicle.descriptionEn;

  const priceLabel = vehicle.price !== null
    ? (vehicle.price >= 1000000
      ? `${(vehicle.price / 1000000).toFixed(1)}M Fons`
      : vehicle.price >= 1000
        ? `${(vehicle.price / 1000).toFixed(0)}K Fons`
        : `${vehicle.price} Fons`)
    : (t(locale, "common.free"));

  return (
    <>
      <ProductJsonLd
        name={isZhLocale(locale) ? vehicle.name : vehicle.nameEn}
        description={description}
        url={`https://nteguide.com/${lang}/vehicles/${slug}`}
        image={`https://nteguide.com${vehicle.image || ""}`}
      />
      {vehicle.faq && vehicle.faq.length > 0 && (
        <FaqPageJsonLd faqs={vehicle.faq} lang={locale} />
      )}
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "vehicles.title"), href: `/${lang}/vehicles` },
          { label: isZhLocale(locale) ? vehicle.name : vehicle.nameEn },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Vehicle Info Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex gap-6">
            <img
              src={vehicle.image || "/images/vehicles/placeholder.webp"}
              alt={`${vehicle.name} - ${vehicle.nameEn}`}
              className="w-32 h-24 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {isZhLocale(locale) ? vehicle.name : `${vehicle.nameEn} Stats & Acquisition`}
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
