import Link from "next/link";
import type { Metadata } from "next";
import { t, isZhLocale, type Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";
import { FaqSection } from "../../../components/FaqSection";
import { localizedText } from "../../../lib/seo-copy";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环 Steam / PC 平台选择与状态核验指南", "NTE Steam / PC Platform Choice & Status Check Guide", "異環 Steam / PC 平台選擇與狀態核驗指南");
  const description = localizedText(locale, "异环(NTE) Steam、独立启动器、Epic 与云端 PC 的选择参考。商店可用性、配置和账号继承规则会变化，请以当前商店页、游戏内提示和官方公告为准。", "A guide for choosing NTE on Steam, the launcher, Epic, or Cloud PC. Store availability, requirements, and account-transfer rules can change, so verify the current store page, in-game prompts, and official notices.", "異環(NTE) Steam、獨立啟動器、Epic 與雲端 PC 的選擇參考。商店可用性、配置和帳號繼承規則可能變動，請以目前商店頁、遊戲內提示和官方公告為準。");
  return {
    title,
    description,
    alternates: hreflangAlternates("steam", lang),
    openGraph: { title, description, type: "article" },
  };
}

export default async function SteamPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);

  const faqs = [
    {
      question: "When does NTE release on Steam?",
      questionZh: "异环 Steam 版什么时候发售？",
      answer: "Steam availability can change by store region and publishing cycle. Check the current Steam store page and official notice before downloading; then compare Steam, the standalone launcher, Epic, and Cloud PC based on your device and account route.",
      "answerZh": "Steam 可用性可能因商店地区和发行周期变化。下载前请核对当前 Steam 商店页和官方公告，再按设备和账号路径比较 Steam、独立启动器、Epic 与云异环 PC。"
    },
    {
      question: "Will my NTE account work on Steam?",
      questionZh: "异环 Steam 版能用现有账号吗？",
      answer: "Do not assume account inheritance across Steam, launcher, Epic, CN, and global routes. Confirm the account binding, server, and migration wording in the current client or official notice before creating or linking an account.",
      "answerZh": "不要默认 Steam、独立启动器、Epic、国服和国际服之间一定能继承账号。创建或绑定账号前，请在当前客户端或官方公告中核对账号绑定、区服和迁移说明。"
    },
    {
      question: "What are the PC requirements for NTE on Steam?",
      questionZh: "异环 Steam 版 PC 配置要求是什么？",
      answer: "Use the current store page and in-game launcher as the source of truth for minimum storage, OS, and hardware requirements. Treat comparison tables as planning references, not a promise of performance on every device.",
      "answerZh": "请以当前商店页和游戏启动器显示的存储、系统与硬件要求为准。配置对比表只用于规划参考，不承诺每台设备的实际表现。"
    },
    {
      question: "Is the Steam version worth waiting for?",
      questionZh: "异环 Steam 版值得等吗？",
      "answer": "Steam is worth choosing when the current store page supports your region and its account rules match your existing route. Otherwise, the launcher, Epic, or Cloud PC may be a better fit; compare them after verifying live availability.",
      "answerZh": "当当前商店页支持你的地区且账号规则符合现有路径时，Steam 才值得优先考虑。否则独立启动器、Epic 或云异环 PC 可能更合适；请先核验实时可用性再比较。"
    },
  ];

  return (
    <>
      <ArticleJsonLd
        title={isZh ? "异环 Steam / PC 平台选择与状态核验" : "NTE Steam / PC Platform Choice & Status Check"}
        description={localizedText(locale, "Steam、PC 配置和账号规则的核验要点与平台选择建议", "What to verify for Steam availability, PC requirements, account rules, and platform choice")}
        url={`https://nteguide.com/${lang}/steam`}
      />
      <FaqPageJsonLd faqs={faqs} lang={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZh ? "Steam 版" : "Steam Version" },
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-400 mb-3">
            {isZh ? "历史信息复核：2026-09-29" : "Historical information reviewed: September 29, 2026"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {localizedText(locale, "异环 Steam / PC：平台选择与状态核验", "NTE Steam / PC: Platform Choice & Status Check", "異環 Steam / PC：平台選擇與狀態核驗")}
          </h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            {localizedText(
              locale,
              "商店可用性、区服、账号继承与配置要求都可能变化。这页帮助你按平台生态、本地设备和网络条件做选择；下载或绑定前，请以当前 Steam 商店页、客户端提示和官方公告为准。",
              "Store availability, server coverage, account inheritance, and requirements can change. This page helps you choose by platform ecosystem, local hardware, and network conditions; verify the current Steam store page, client prompts, and official notices before downloading or linking an account.",
              "商店可用性、伺服器、帳號繼承與配置要求都可能變動。這頁幫你按平台生態、本地裝置與網路條件做選擇；下載或綁定前，請以目前 Steam 商店頁、客戶端提示和官方公告為準。"
            )}
          </p>
        </section>

        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZh
              ? (locale === "tw" ? "這頁 Steam 指南最適合怎麼用？" : "这页 Steam 指南最适合怎么用？")
              : "How should you use this Steam guide?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZh
              ? (locale === "tw"
                  ? "先用這頁判斷你現在是不是更適合 Steam、獨立啟動器、Epic 或雲端 PC，再回到配置、下載與帳號頁面確認細節。這頁最適合做平台選擇，不適合替代完整的安裝與故障排查文檔。"
                  : "先用这页判断你现在是不是更适合 Steam、独立启动器、Epic 或云端 PC，再回到配置、下载与账号页面确认细节。这页最适合做平台选择，不适合替代完整的安装与故障排查文档。")
              : "Use this page to decide whether Steam, the standalone launcher, Epic, or cloud PC is the best fit for you right now, then verify details on requirements, download, and account pages. It is best for platform choice, not for replacing full install or troubleshooting docs."}
          </p>
        </section>

        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZh ? "商店状态：" : "Store status:",
              value: isZh ? "下载前核对当前 Steam 商店页" : "Verify the current Steam store page before downloading"
            },
            {
              label: isZh ? "配置来源：" : "Requirements:",
              value: isZh ? "以当前商店页与启动器为准" : "Use the current store page and launcher"
            },
            {
              label: isZh ? "性能预期：" : "Performance:",
              value: isZh ? "因设备与版本而异，先看系统要求" : "Varies by device and version; check requirements"
            },
            {
              label: isZh ? "账号规则：" : "Account rules:",
              value: isZh ? "绑定与继承须以客户端/公告核验" : "Verify binding and inheritance in-client or officially"
            },
          ]}
        />

        <section className="my-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh
                ? (locale === "tw" ? "入 Steam 前先看什麼" : "入 Steam 前先看什么")
                : "What should you check before choosing Steam?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? (locale === "tw" ? "在商店頁和啟動器核對你的 PC 是否支援本地安裝，以及所需空間與下載大小。" : "在商店页和启动器核对你的 PC 是否支持本地安装，以及所需空间与下载大小。") : "Verify on the store page and launcher whether your PC supports a local install, including required storage and download size."}</li>
              <li>{isZh ? (locale === "tw" ? "核對目前 Steam 頁實際提供的功能、語言、好友與成就整合，不以歷史平台功能推斷。" : "核对当前 Steam 页实际提供的功能、语言、好友与成就整合，不以历史平台功能推断。") : "Verify the current Steam page for actual features, language, friends, and achievement integration instead of inferring from historical platform behavior."}</li>
              <li>{isZh ? (locale === "tw" ? "分別確認 Steam、啟動器、Epic 與雲端 PC 的地區、帳號、價格和可用性。" : "分别确认 Steam、启动器、Epic 与云端 PC 的地区、账号、价格和可用性。") : "Check region, account, pricing, and availability separately for Steam, the launcher, Epic, and Cloud PC."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh
                ? (locale === "tw" ? "常見誤區" : "常见误区")
                : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? (locale === "tw" ? "假定 Steam 與其他入口一定共用或一定不共用進度。" : "假定 Steam 與其他入口一定共用或一定不共用進度。") : "Assuming Steam must either share or not share progression with other entry points."}</li>
              <li>{isZh ? (locale === "tw" ? "只因為看到 Steam 上線，就忽略了配置與下載成本。" : "只因为看到 Steam 上线，就忽略了配置与下载成本。") : "Seeing Steam availability and ignoring the local hardware and storage cost."}</li>
              <li>{isZh ? (locale === "tw" ? "把平台入口問題和區服、帳號體系問題混在一起。" : "把平台入口问题和区服、账号体系问题混在一起。") : "Mixing up platform-entry decisions with server-region or account-system decisions."}</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "一、先核验 Steam 商店状态" : "1. Verify Steam Store Status First"}</h2>
          <p className="text-gray-400 leading-relaxed">
            {isZh
              ? "不要把历史商店状态当作当前可用性的证明。先在 Steam 商店页确认你的地区是否可获取，再核对游戏名称、发行方、支持语言、下载要求与当前公告。确认后，再比较 Steam、独立启动器、Epic 与云端 PC 是否更符合你的设备和账号路径。"
              : "Do not treat historical store status as proof of current availability. First confirm regional availability on the Steam store page, then check the game name, publisher, supported languages, download requirements, and current notices. Only then compare Steam, the launcher, Epic, and Cloud PC for your device and account route."}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "二、PC 配置参考" : "2. PC Requirement Reference"}</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
              <h3 className="font-semibold text-gray-200 mb-3">{isZh ? "最低配置" : "Minimum"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li><span className="text-gray-500">{isZh ? "系统：" : "OS: "}</span>Windows 10 64-bit</li>
                <li><span className="text-gray-500">{isZh ? "CPU：" : "CPU: "}</span>Intel Core i5-8400 / AMD Ryzen 5 1600</li>
                <li><span className="text-gray-500">{isZh ? "内存：" : "RAM: "}</span>8 GB</li>
                <li><span className="text-gray-500">{isZh ? "显卡：" : "GPU: "}</span>NVIDIA GTX 1060 6GB / AMD RX 580</li>
                <li><span className="text-gray-500">{isZh ? "存储：" : "Storage: "}</span>90 GB SSD（推荐 NVMe）</li>
              </ul>
            </div>
            <div className="rounded-lg border border-primary-500/30 bg-primary-500/5 p-4">
              <h3 className="font-semibold text-primary-300 mb-3">{isZh ? "推荐配置" : "Recommended"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li><span className="text-gray-500">{isZh ? "系统：" : "OS: "}</span>Windows 10/11 64-bit</li>
                <li><span className="text-gray-500">{isZh ? "CPU：" : "CPU: "}</span>Intel Core i7-9700 / AMD Ryzen 7 3700X</li>
                <li><span className="text-gray-500">{isZh ? "内存：" : "RAM: "}</span>16 GB</li>
                <li><span className="text-gray-500">{isZh ? "显卡：" : "GPU: "}</span>NVIDIA RTX 2060 / AMD RX 5700 XT 或更好</li>
                <li><span className="text-gray-500">{isZh ? "存储：" : "Storage: "}</span>90 GB NVMe SSD</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {isZh ? "下列历史规格仅供预估，下载前请以当前商店页或启动器显示为准。" : "The historical specs below are planning references only; check the current store page or launcher before downloading."}
            <br />
            <Link href={`/${lang}/system-requirements`} className="text-primary-400 hover:text-primary-300">
              {isZh ? "→ 完整系统要求页面（含手机/PS5）" : "→ Full system requirements (mobile/PS5 included)"}
            </Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "三、Steam 与移动端的历史对照字段" : "3. Historical Steam vs Mobile Comparison Fields"}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="text-left p-3">{isZh ? "对比项" : "Aspect"}</th>
                  <th className="text-left p-3">{isZh ? "Steam / PC" : "Steam / PC"}</th>
                  <th className="text-left p-3">{isZh ? "移动端" : "Mobile"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr><td className="p-3">{isZh ? "画面" : "Visuals"}</td><td className="p-3 text-gray-400">{isZh ? "核对当前图形选项与硬件要求" : "Verify current graphics options and hardware requirements"}</td><td className="p-3 text-gray-400">{isZh ? "核对当前设备支持与散热表现" : "Verify current device support and thermal behavior"}</td></tr>
                <tr><td className="p-3">{isZh ? "帧率" : "Frame Rate"}</td><td className="p-3 text-gray-400">{isZh ? "以本机与当前版本设置实测为准" : "Test on your hardware and current version settings"}</td><td className="p-3 text-gray-400">{isZh ? "以机型、设置与客户端实测为准" : "Test on your device, settings, and client"}</td></tr>
                <tr><td className="p-3">{isZh ? "操作" : "Controls"}</td><td className="p-3 text-gray-400">{isZh ? "核对当前键鼠与手柄支持" : "Verify current keyboard, mouse, and controller support"}</td><td className="p-3 text-gray-400">{isZh ? "核对触控与外设支持" : "Verify touch and peripheral support"}</td></tr>
                <tr><td className="p-3">{isZh ? "下载与加载" : "Download and loading"}</td><td className="p-3 text-gray-400">{isZh ? "核对商店下载大小与本地存储" : "Verify store download size and local storage"}</td><td className="p-3 text-gray-400">{isZh ? "核对商店下载大小与可用空间" : "Verify store download size and free space"}</td></tr>
                <tr><td className="p-3">{isZh ? "便携性" : "Portability"}</td><td className="p-3 text-gray-400">{isZh ? "取决于你的设备与使用场景" : "Depends on your device and use case"}</td><td className="p-3 text-gray-400">{isZh ? "取决于你的设备与使用场景" : "Depends on your device and use case"}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {isZh
              ? "本表只列出应逐项核对的历史对照字段，并不判断哪一端更适合你。跨平台进度、输入方式、图形选项、下载要求与性能都必须按当前账号、区服、设备和客户端详情确认。"
              : "This table lists historical comparison fields to verify and does not decide which platform suits you. Confirm progression, input, graphics options, download requirements, and performance for your exact account, server, device, and client."}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "四、PC 入口核验清单" : "4. PC Entry Verification Checklist"}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
              <h3 className="font-semibold text-gray-200 mb-2">{isZh ? "官网客户端 / Epic" : "Launcher / Epic"}</h3>
              <p className="text-sm text-gray-400">
                {isZh
                  ? "核对目标地区是否可用、客户端下载来源、下载大小、系统要求与账号绑定提示。"
                  : "Verify target-region availability, client source, download size, requirements, and account-binding prompts."}
              </p>
            </div>
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
              <h3 className="font-semibold text-sky-300 mb-2">{isZh ? "云异环 PC" : "Cloud Yihuan PC"}</h3>
              <p className="text-sm text-gray-400">
                {isZh
                  ? "核对目标地区、服务入口、价格、排队、网络要求、账号规则和当前客户端提示。"
                  : "Verify target region, service entry, pricing, queues, network requirements, account rules, and current client prompts."}
              </p>
              <Link href={`/${lang}/blog/cloud-yihuan-pc-guide`} className="inline-block mt-3 text-sm text-primary-400 hover:text-primary-300">
                {isZh ? "→ 看云异环 PC 说明" : "→ Cloud PC guide"}
              </Link>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <h3 className="font-semibold text-emerald-300 mb-2">{isZh ? "Steam" : "Steam"}</h3>
              <p className="text-sm text-gray-400">
                {isZh
                  ? "核对目标地区商店页、发行方、语言、功能、配置、下载要求和账号绑定规则。"
                  : "Verify the target-region store page, publisher, language, features, requirements, download details, and account-binding rules."}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "五、跨平台账号核验" : "5. Cross-Platform Account Verification"}</h2>
          <p className="text-gray-400 leading-relaxed">
            {isZh
              ? "不要根据历史入口关系推断 Steam、启动器、Epic、国服或国际服之间的账号继承。创建、绑定、迁移、充值或购买前，请在目标客户端和官方公告中确认区服、登录方式、绑定限制、进度、支付与迁移文案；国服与国际服规则须分别核验。"
              : "Do not infer account inheritance among Steam, the launcher, Epic, CN, or global routes from historical entry relationships. Before creating, linking, migrating, spending, or purchasing, confirm server, login method, binding limits, progression, payments, and migration wording in the target client and official notices; verify CN and global rules separately."}
          </p>
        </section>

        <section className="mb-10 rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "六、选择前的最后核验" : "6. Final Checks Before Choosing"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4">
              <h3 className="font-semibold text-emerald-300 mb-2">{isZh ? "Steam 入口核验通过后" : "After Steam Checks Pass"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>{isZh ? "目标地区商店页可用，且发行方、语言和下载信息已确认" : "The target-region store page is available and publisher, language, and download details are confirmed"}</li>
                <li>{isZh ? "当前配置、价格和付款条件适合你的设备与预算" : "Current requirements, pricing, and payment terms fit your device and budget"}</li>
                <li>{isZh ? "账号绑定、区服和进度规则已在客户端或公告中确认" : "Account binding, server, and progression rules are confirmed in-client or officially"}</li>
              </ul>
            </div>
            <div className="rounded-lg bg-sky-500/5 border border-sky-500/20 p-4">
              <h3 className="font-semibold text-sky-300 mb-2">{isZh ? "其他入口也应分别核验" : "Verify Other Entry Points Separately"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>{isZh ? "启动器、Epic、移动端或云端的地区与可用性不能由 Steam 状态推断" : "Launcher, Epic, mobile, or cloud region availability cannot be inferred from Steam status"}</li>
                <li>{isZh ? "每个入口的下载、账号、支付和配置要求都可能不同" : "Download, account, payment, and requirement rules may differ for every entry point"}</li>
                <li>{isZh ? "只在目标客户端和官方公告同时核验后再做选择" : "Choose only after checking both the target client and official notices"}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10 grid gap-3 sm:grid-cols-3">
          {[
            { href: `/${lang}/system-requirements`, label: isZh ? "完整系统要求" : "Full System Requirements" },
            { href: `/${lang}/cn-vs-global`, label: isZh ? "国服 vs 国际服" : "CN vs Global" },
            { href: `/${lang}/blog/cloud-yihuan-pc-guide`, label: isZh ? "云异环 PC 说明" : "Cloud PC Guide" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3 text-sm text-gray-300 hover:border-primary-500/40 hover:text-primary-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </section>

        <FaqSection faqs={faqs} locale={locale} />
      </main>
    </>
  );
}
