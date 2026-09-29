import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllVehicles } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { VehicleCard } from "../../../components/VehicleCard";

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
  const title = locale === "tw"
    ? "異環載具歷史資料｜性能、來源與價格記錄"
    : locale === "zh"
      ? "异环载具历史资料｜性能、来源与价格记录"
      : "NTE Vehicle History | Performance, Source & Price Records";
  const description = locale === "tw"
    ? `異環載具歷史資料庫收錄 ${vehicles.length} 筆性能、價格、品牌與來源字段記錄。${freeVehicles} 筆歷史字段標為免費；最高記錄極速為 ${fastest.topSpeed} km/h，現行內容須以目標客戶端與官方公告復核。`
    : locale === "zh"
      ? `异环载具历史资料库收录 ${vehicles.length} 条性能、价格、品牌与来源字段记录。其中 ${freeVehicles} 条历史字段标为免费；最高记录极速为 ${fastest.topSpeed} km/h，现行内容须以目标客户端与官方公告复核。`
      : `Historical NTE vehicle records covering ${vehicles.length} performance, price, brand, and source entries. ${freeVehicles} historical entries are marked free, and the highest recorded top speed is ${fastest.topSpeed} km/h. Verify current details in your target client and official notices.`;

  return {
    title,
    description,
    alternates: hreflangAlternates("vehicles", lang),
    openGraph: {
      title,
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
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "vehicles.title") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            {isZhLocale(locale) ? "异环载具历史资料" : "NTE Vehicle History"}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {isZhLocale(locale)
              ? "本站归档的性能、价格、品牌和来源字段记录。它们不是当前版本的载具目录、购买报价或解锁保证。"
              : "An archive of recorded performance, price, brand, and source fields. It is not a current vehicle catalog, purchase quote, or unlock guarantee."}
          </p>
        </div>

        <section className="mb-8 rounded-xl border border-amber-500/40 bg-amber-950/20 p-5">
          <h2 className="text-lg font-semibold text-amber-100">
            {isZhLocale(locale) ? "历史载具字段，使用前必须复核" : "Historical vehicle fields require verification"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-amber-50/80">
            {isZhLocale(locale)
              ? "极速、评分、价格、免费标记、来源和前置条件都可能因测试阶段、服务器、版本或活动而变化。进行购买、兑换、路线规划或资源投入前，请在目标客户端和官方公告中逐项确认。"
              : "Top speed, ratings, price, free status, source, and prerequisites may differ by test phase, server, version, or event. Confirm each field in your target client and official notices before purchasing, redeeming, planning routes, or spending resources."}
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale) ? "这页历史资料适合做什么？" : "What is this historical index useful for?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? "它适合查阅过去被记录过的车种、品牌、性能字段和来源表述，并作为核验当前客户端内容时的对照线索。页面不提供当前版本的购买、优先级或配装结论。"
              : "Use it to look up previously recorded vehicle types, brands, performance fields, and source wording as leads for checking the current client. It does not provide current purchase, priority, or build conclusions."}
          </p>
        </section>

        <section className="mb-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "复核当前客户端时应确认什么" : "What to confirm in the current client"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "该载具是否仍存在，以及名称、类型和品牌是否与当前客户端一致。" : "Whether the vehicle still exists and whether its name, class, and brand match the current client."}</li>
              <li>{isZhLocale(locale) ? "当前价格、货币类型、免费条件、来源和前置解锁是否已变更。" : "Whether current price, currency, free conditions, source, and unlock requirements have changed."}</li>
              <li>{isZhLocale(locale) ? "极速、评分、驾驶规则及可用场景是否仍由当前版本支持。" : "Whether top speed, ratings, driving rules, and availability are still supported by the current version."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "把历史“免费”字段理解为当前仍可免费取得。" : "Treating a historical “free” field as proof that the vehicle is still free today."}</li>
              <li>{isZhLocale(locale) ? "将旧价格或来源直接用于当前货币规划、兑换或购买。" : "Using old prices or sources directly for current currency planning, redemption, or purchases."}</li>
              <li>{isZhLocale(locale) ? "把历史面板排名当作现行版本的性能结论。" : "Treating historical stat rankings as current-version performance conclusions."}</li>
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
            {isZhLocale(locale) ? "历史字段摘要" : "Historical field summary"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-400">{vehicles.length}</p>
              <p className="text-sm text-gray-400">{isZhLocale(locale) ? "归档条目" : "Archived entries"}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {fastest.topSpeed} km/h
              </p>
              <p className="text-sm text-gray-400">{isZhLocale(locale) ? `历史最高记录：${fastest.nameEn}` : `Highest recorded: ${fastest.nameEn}`}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">
                {mostExpensive.price !== null ? `${(mostExpensive.price / 1000000).toFixed(0)}M` : "—"}
              </p>
              <p className="text-sm text-gray-400">{isZhLocale(locale) ? `历史最高价格字段：${mostExpensive.nameEn}` : `Highest recorded price: ${mostExpensive.nameEn}`}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">
                {freeVehicles}
              </p>
              <p className="text-sm text-gray-400">{isZhLocale(locale) ? "历史免费字段" : "Historical free fields"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
