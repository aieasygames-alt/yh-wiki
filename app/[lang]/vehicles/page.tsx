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
  const locale = lang as Locale;
  const vehicles = getAllVehicles();
  const freeVehicles = vehicles.filter((vehicle) => vehicle.price === null).length;
  const fastest = vehicles.reduce((a, b) => a.topSpeed > b.topSpeed ? a : b);
  const description = isZhLocale(locale)
    ? `异环载具图鉴，当前收录 ${vehicles.length} 台载具，包含 ${freeVehicles} 台可免费获取车型，并可快速查看极速、价格、品牌与获取方式。当前最高时速 ${fastest.topSpeed} km/h。`
    : `Neverness to Everness vehicle database with ${vehicles.length} vehicles, including ${freeVehicles} free options, plus top speed, price, brand, and acquisition info. Current fastest speed: ${fastest.topSpeed} km/h.`;

  return {
    title: t(locale, "vehicles.seoTitle"),
    description,
    alternates: hreflangAlternates("vehicles", lang),
    openGraph: {
      title: t(locale, "vehicles.seoTitle"),
      description,
      type: "website",
    },
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

  const fastest = vehicles.reduce((a, b) => a.topSpeed > b.topSpeed ? a : b);
  const mostExpensive = vehicles.filter(v => v.price !== null).reduce((a, b) => (a.price ?? 0) > (b.price ?? 0) ? a : b);
  const freeVehicles = vehicles.filter(v => v.price === null).length;

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "vehicles.title") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            {t(locale, "vehicles.database")}
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
                  topSpeed={vehicle.topSpeed}
                  price={vehicle.price ?? null}
                  brand={vehicle.brand}
                  brandEn={vehicle.brandEn}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Stats Summary */}
        <div className="mt-12 p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <h2 className="text-lg font-bold mb-4">
            {t(locale, "vehicles.statistics")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-400">{vehicles.length}</p>
              <p className="text-sm text-gray-400">{t(locale, "vehicles.totalVehicles")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {fastest.topSpeed} km/h
              </p>
              <p className="text-sm text-gray-400">{`${t(locale, "vehicles.fastest")}: ${fastest.nameEn}`}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">
                {mostExpensive.price !== null ? `${(mostExpensive.price / 1000000).toFixed(0)}M` : "—"}
              </p>
              <p className="text-sm text-gray-400">{`${t(locale, "vehicles.mostExpensive")}: ${mostExpensive.nameEn}`}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">
                {freeVehicles}
              </p>
              <p className="text-sm text-gray-400">{t(locale, "vehicles.freeVehicles")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
