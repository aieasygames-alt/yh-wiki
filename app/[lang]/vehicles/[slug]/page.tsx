import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../../lib/i18n";
import { getVehicle, getAllVehicles } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { ProductJsonLd, FaqPageJsonLd } from "../../../../components/JsonLd";
import { FaqSection } from "../../../../components/FaqSection";

export function generateStaticParams() {
  const vehicles = getAllVehicles();
  return vehicles.flatMap((v) => [
    { lang: "zh", slug: v.id },
    { lang: "tw", slug: v.id },
    { lang: "en", slug: v.id },
  ]);
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
        ? `${vehicle.name} 属性 & 获取方式 | 异环 Wiki`
        : `${vehicle.nameEn} (${vehicle.name}) Stats & How to Get - NTE Guide`,
    description:
      isZhLocale(lang)
        ? `异环载具「${vehicle.name}」详细属性数据，包含速度、加速度、操控性及获取方式。`
        : `Complete stats for ${vehicle.nameEn} in Neverness to Everness. Speed, acceleration, handling, and how to get it.`,
    alternates: hreflangAlternates(`vehicles/${slug}`, lang),
    openGraph: {
      title:
        isZhLocale(lang)
          ? `${vehicle.name} | 异环 Wiki`
          : `${vehicle.nameEn} Stats & Acquisition | NTE Guide`,
      description:
        isZhLocale(lang)
          ? `异环载具「${vehicle.name}」详细属性数据，包含速度、加速度、操控性及获取方式。`
          : `Complete stats for ${vehicle.nameEn} in Neverness to Everness.`,
      type: "article",
    },
  };
}

function StatBar({ label, value, locale }: { label: string; value: string; locale: Locale }) {
  const rankValue = value === "S" ? 100 : value === "A" ? 75 : value === "B" ? 50 : 25;
  const colorClass = value === "S" ? "bg-yellow-500" : value === "A" ? "bg-green-500" : value === "B" ? "bg-blue-500" : "bg-gray-500";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400 w-16">{label}</span>
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${rankValue}%` }}></div>
      </div>
      <span className={`text-sm font-bold ${value === "S" ? "text-yellow-400" : value === "A" ? "text-green-400" : "text-gray-400"} w-6`}>
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

  return (
    <>
      <ProductJsonLd
        name={isZhLocale(locale) ? vehicle.name : vehicle.nameEn}
        description={isZhLocale(locale) ? vehicle.description : vehicle.descriptionEn}
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
          { label: isZhLocale(locale) ? "载具" : "Vehicles", href: `/${lang}/vehicles` },
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
              <p className="text-gray-500">{isZhLocale(locale) ? vehicle.nameEn : vehicle.name}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs px-3 py-1 rounded-full border bg-gray-800 text-gray-300">
                  {typeLabel}
                </span>
                {vehicle.rarity >= 5 && (
                  <span className="text-xs font-bold text-yellow-400">★★★★★</span>
                )}
                {vehicle.rarity === 4 && (
                  <span className="text-xs font-bold text-blue-400">★★★★</span>
                )}
                {vehicle.rarity === 3 && (
                  <span className="text-xs font-bold text-green-400">★★★</span>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            {isZhLocale(locale) ? vehicle.description : vehicle.descriptionEn}
          </p>
        </div>

        {/* Performance Stats */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "性能属性" : "Performance Stats"}
          </h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4 space-y-3">
            <StatBar label={isZhLocale(locale) ? "速度" : "Speed"} value={vehicle.speed} locale={locale} />
            <StatBar label={isZhLocale(locale) ? "加速" : "Acceleration"} value={vehicle.acceleration} locale={locale} />
            <StatBar label={isZhLocale(locale) ? "操控" : "Handling"} value={vehicle.handling} locale={locale} />
          </div>
        </section>

        {/* Acquisition */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "获取方式" : "How to Get"}
          </h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{isZhLocale(locale) ? "来源" : "Source"}</p>
                <p className="font-medium">{sourceLabel}</p>
              </div>
              {vehicle.price !== "-" && (
                <div className="text-right">
                  <p className="text-sm text-gray-400">{isZhLocale(locale) ? "价格" : "Price"}</p>
                  <p className="font-medium text-primary-400">¤{vehicle.price}</p>
                </div>
              )}
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
            {isZhLocale(locale) ? "← 返回载具列表" : "← Back to Vehicles"}
          </Link>
        </div>
      </div>
    </>
  );
}
