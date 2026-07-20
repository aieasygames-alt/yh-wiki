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
  const description = locale === "tw"
    ? `異環載具圖鑑目前收錄 ${vehicles.length} 台車款，其中 ${freeVehicles} 台可免費取得，整理極速、價格、品牌與入手方式；目前最高時速 ${fastest.topSpeed} km/h。`
    : locale === "zh"
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

        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale) ? "这页载具图鉴最适合解决什么问题？" : "What is this vehicle index best for?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? "它适合你快速比较免费载具、前期代步车和高价收藏车的差异，判断当前阶段该先买、先攒还是先跳过。真正决定投入前，最好把极速、价格和获取难度一起看，而不是只看外观或单一面板。"
              : "Use this hub to compare free vehicles, early mobility options, and expensive collector cars so you can decide whether to buy now, save up, or skip. Before investing, weigh top speed, price, and acquisition difficulty together instead of judging by looks or one stat alone."}
          </p>
        </section>

        <section className="mb-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "买车前先看什么" : "What should you check before buying a vehicle?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "先确认你当前是缺纯移动效率，还是想补收藏、竞速或任务需求。" : "Decide whether you need pure movement efficiency, collection value, racing utility, or mission support."}</li>
              <li>{isZhLocale(locale) ? "免费车和前期低价车通常更适合过渡，不要太早把大额货币全压在第一台高价车上。" : "Free and low-cost early vehicles are often better transition picks than dumping your whole budget into one premium car too early."}</li>
              <li>{isZhLocale(locale) ? "看极速时也要看获取难度和价格，纸面更快不一定等于当前最值。" : "Compare top speed alongside cost and unlock difficulty; the fastest option is not always the best current value."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "只追最高时速，不看自己实际能否尽快拿到和长期使用。" : "Chasing top speed alone without checking whether the car is realistically obtainable or useful long term."}</li>
              <li>{isZhLocale(locale) ? "忽略免费载具的性价比，导致前中期资金压力过大。" : "Ignoring the value of free vehicles and creating unnecessary early-mid game currency pressure."}</li>
              <li>{isZhLocale(locale) ? "把收藏目标和实用目标混在一起，最后两边都不够舒服。" : "Mixing collector goals with practical mobility goals and under-optimizing both."}</li>
            </ul>
          </div>
        </section>

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
