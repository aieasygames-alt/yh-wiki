import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllVehicles } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { VehicleCard } from "../../../components/VehicleCard";
import { DataStatusBanner } from "../../../components/DataStatusBanner";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  return {
    title:
      isZhLocale(lang)
        ? "载具图鉴 & 属性大全 | 异环 Wiki"
        : "All Vehicles & Stats | Neverness to Everness Wiki",
    description:
      isZhLocale(lang)
        ? "异环全载具图鉴，包含摩托车、越野车、轿车、跑车、SUV等所有载具的详细属性、价格和获取方式。"
        : "Complete vehicle database for Neverness to Everness. All motorcycles, off-road vehicles, sedans, sports cars, and SUVs with detailed stats, prices, and acquisition methods.",
    alternates: hreflangAlternates("vehicles", lang),
  };
}

export default async function VehiclesPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const vehicles = getAllVehicles();

  // Group by type
  const groupedVehicles = vehicles.reduce((acc, v) => {
    const type = isZhLocale(locale) ? v.type : v.typeEn;
    if (!acc[type]) acc[type] = [];
    acc[type].push(v);
    return acc;
  }, {} as Record<string, typeof vehicles>);

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZhLocale(locale) ? "载具" : "Vehicles" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            {isZhLocale(locale) ? "载具图鉴" : "Vehicle Database"}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {isZhLocale(locale)
              ? "异环全载具图鉴，包含所有载具的详细属性、价格和获取方式。"
              : "Complete vehicle database with detailed stats, prices, and acquisition methods."}
          </p>
        </div>

        {Object.entries(groupedVehicles).map(([type, typeVehicles]) => (
          <section key={type} className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-500 rounded"></span>
              {type}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {typeVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  id={vehicle.id}
                  name={vehicle.name}
                  nameEn={vehicle.nameEn}
                  type={vehicle.type}
                  typeEn={vehicle.typeEn}
                  rarity={vehicle.rarity}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Stats Summary */}
        <div className="mt-12 p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <h2 className="text-lg font-bold mb-4">
            {isZhLocale(locale) ? "载具统计" : "Vehicle Statistics"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-400">{vehicles.length}</p>
              <p className="text-sm text-gray-400">{isZhLocale(locale) ? "总载具数" : "Total Vehicles"}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {vehicles.filter((v) => v.rarity >= 5).length}
              </p>
              <p className="text-sm text-gray-400">{isZhLocale(locale) ? "5星载具" : "5-Star"}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">
                {vehicles.filter((v) => v.speed === "S").length}
              </p>
              <p className="text-sm text-gray-400">{isZhLocale(locale) ? "S级速度" : "S-Rank Speed"}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">
                {vehicles.filter((v) => v.price !== "-").length}
              </p>
              <p className="text-sm text-gray-400">{isZhLocale(locale) ? "商店可购买" : "Shop Available"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
