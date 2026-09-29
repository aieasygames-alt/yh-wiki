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
  const title = localizedText(locale, "异环国服 vs 国际服：选服与账号核验指南", "NTE CN vs Global: Server Choice & Account Check Guide", "異環國服 vs 國際服：選服與帳號核驗指南");
  const description = localizedText(locale, "异环(NTE)国服与国际服的选服框架：先核对地区、语言、朋友、账号绑定、支付与当前版本规则，再创建角色或充值。", "A framework for choosing NTE CN or global: verify region, language, friends, account binding, payments, and current version rules before creating a character or spending.", "異環(NTE)國服與國際服的選服框架：先核對地區、語言、朋友、帳號綁定、支付與目前版本規則，再建立角色或儲值。");
  return {
    title,
    description,
    alternates: hreflangAlternates("cn-vs-global", lang),
    openGraph: { title, description, type: "article" },
  };
}

export default async function CnVsGlobalPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);

  const faqs = [
    {
      question: "Which server should I play NTE on, CN or global?",
      questionZh: "异环玩国服还是国际服好？",
      answer: "Choose the server where your region, preferred language, payment route, and friends align. Before creating a character or spending, verify the current account, cross-server, banner, and payment rules in the client or official notice; these rules can differ or change by publishing track.",
      answerZh: "选择与你所在地区、语言偏好、支付路径和朋友一致的服务器。创建角色或充值前，请在客户端或官方公告中核对当前账号、跨服、卡池和支付规则；这些规则可能因发行线不同而变化。",
    },
    {
      question: "Why did NTE CN launch later than global?",
      questionZh: "异环国服为什么比国际服晚上线？",
      answer: "Historical launch dates do not establish a permanent release pattern. For a specific update, compare the current CN and global notices instead of using an older version gap to decide where to play.",
      answerZh: "历史上线日期不能证明之后会沿用固定节奏。针对某个具体更新，请直接比较当前国服与国际服公告，不要用旧版本时差决定选服。",
    },
    {
      question: "Is NTE CN server rating really lower than global?",
      questionZh: "异环国服评分真的比国际服低吗？",
      answer: "Store ratings and discussion sentiment change continuously and are not a reliable proxy for your own region, device, or account experience. Read current reviews for your platform, then verify support and performance through official channels.",
      answerZh: "商店评分和社区情绪会持续变化，不能直接代表你的地区、设备或账号体验。请查看你所在平台的近期评价，再通过官方渠道核对支持与性能信息。",
    },
    {
      question: "Can I transfer my NTE account between CN and global?",
      questionZh: "异环国服和国际服账号能互通吗？",
      answer: "Do not assume progress, purchases, friends, or gacha records transfer between CN and global. Confirm the current binding, migration, and cross-server rules in the client or official notice before creating an account or making purchases.",
      answerZh: "不要默认国服与国际服之间可转移进度、充值、好友或抽卡记录。创建账号或充值前，请在客户端或官方公告中确认当前绑定、迁移和跨服规则。",
    },
  ];

  return (
    <>
      <ArticleJsonLd
        title={isZh ? "异环国服 vs 国际服区别对比" : "NTE CN vs Global Server Comparison"}
        description={localizedText(locale, "语言、账号、版本节奏、定价与评分差异", "Language support, account rules, patch timing, pricing, and ratings", "語言、帳號、版本節奏、定價與評分差異")}
        url={`https://nteguide.com/${lang}/cn-vs-global`}
      />
      <FaqPageJsonLd faqs={faqs} lang={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZh ? "国服 vs 国际服" : "CN vs Global" },
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-400 mb-3">
            {isZh ? "历史信息复核：2026-09-29" : "Historical information reviewed: September 29, 2026"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {localizedText(locale, "异环国服 vs 国际服：该选哪个服？", "NTE CN vs Global Server: What's the Difference?", "異環國服 vs 國際服：到底差在哪？")}
          </h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            {localizedText(
              locale,
              "新玩家最常问的是该选哪个服。比起记住旧版本的时差、评分或卡池顺序，更重要的是先确认你的地区、语言、朋友、账号与支付路径是否匹配。账号、跨服、价格和版本规则请以当前客户端与官方公告为准。",
              "New players often ask which server to choose. Rather than relying on an older version gap, rating, or banner order, first confirm that your region, language, friends, account route, and payment route align. Use the current client and official notices as the source of truth for account, cross-server, pricing, and version rules.",
              "新玩家最常問的是該選哪個服。比起記住舊版本的時差、評分或卡池順序，更重要的是先確認你的地區、語言、朋友、帳號與支付路徑是否匹配。帳號、跨服、價格和版本規則請以目前客戶端與官方公告為準。"
            )}
          </p>
        </section>

        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZh ? "选服优先级：" : "Start with:",
              value: localizedText(locale, "地区、语言、朋友与账号路径", "Region, language, friends, and account route", "地區、語言、朋友與帳號路徑"),
            },
            {
              label: isZh ? "版本状态：" : "Version status:",
              value: localizedText(locale, "针对当期公告分别核对，不沿用历史时差", "Check each current notice; do not reuse historical timing gaps", "針對當期公告分別核對，不沿用歷史時差"),
            },
            {
              label: isZh ? "支付与价格：" : "Payments and pricing:",
              value: isZh ? "以目标区服商店和充值页为准" : "Check the target-server store and payment page",
            },
            {
              label: isZh ? "账号规则：" : "Account rules:",
              value: isZh ? "创建角色前核对绑定、迁移与跨服说明" : "Verify binding, migration, and cross-server rules before starting",
            },
          ]}
        />

        <section className="my-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {localizedText(locale, "这页选服对比最适合怎么用？", "How should you use this server comparison?", "這頁選服對比最適合怎麼用？")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {localizedText(
              locale,
              "先用这页排除最容易踩坑的部分：语言、账号是否互通、朋友在哪个服，以及你是否真的在意版本先后。确认这些以后，再去看卡池时间表、兑换码或 Steam/平台入口页补细节。这页最适合做选服判断，不适合替代具体版本公告。",
              "Use this page to rule out the biggest server-choice mistakes first: language, account separation, where your friends play, and whether patch timing actually matters to you. After that, jump to banner schedules, redeem codes, or platform pages for the exact details. This page is best for choosing a server, not for replacing live patch notices.",
              "先用這頁排除最容易踩坑的部分：語言、帳號是否互通、朋友在哪個服，以及你是否真的在意版本先後。確認這些以後，再去看卡池時間表、兌換碼或 Steam/平台入口頁補細節。這頁最適合做選服判斷，不適合替代具體版本公告。"
            )}
          </p>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {localizedText(locale, "选服前先看什么", "What should you check before picking a server?", "選服前先看什麼")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{localizedText(locale, "先确认你和固定队朋友准备在哪个服长期玩。", "Confirm which server you and your friends actually plan to stay on long term.", "先確認你和固定隊朋友準備在哪個服長期玩。")}</li>
              <li>{localizedText(locale, "如果你需要英文界面、国际支付环境或海外社区，国际服通常更顺手。", "If you need English UI, international billing, or overseas communities, global is usually the easier fit.", "如果你需要英文介面、國際支付環境或海外社群，國際服通常更順手。")}</li>
              <li>{localizedText(locale, "如果你更重视最早接触版本内容，再去核当期公告里的具体时间差。", "If getting content earliest matters most, verify the current patch gap in that patch's live notice.", "如果你更重視最早接觸版本內容，再去核當期公告裡的具體時間差。")}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {localizedText(locale, "常见误区", "Common mistakes", "常見誤區")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{localizedText(locale, "以为国服和国际服只是语言不同，后面可以随时转服。", "Assuming CN and global differ only by language and can be swapped later.", "以為國服和國際服只是語言不同，後面可以隨時轉服。")}</li>
              <li>{localizedText(locale, "只看某一版快几天，就忽略朋友分布和账号独立问题。", "Focusing on one patch being earlier and ignoring friend distribution and account separation.", "只看某一版快幾天，就忽略朋友分布和帳號獨立問題。")}</li>
              <li>{localizedText(locale, "把旧版本时间差当成之后每个版本都会固定复制的规律。", "Treating an older patch gap as if every future version will repeat it exactly.", "把舊版本時間差當成之後每個版本都會固定複製的規律。")}</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "一、版本与开服状态怎么核对" : "1. How to Verify Version and Launch Status"}</h2>
          <p className="text-gray-400 mb-3 leading-relaxed">
            {localizedText(
              locale,
              "历史上线日期和旧版本时差只能用于回顾，不能保证当前版本的顺序或可用性。要比较某一版本，请分别打开目标区服的游戏内公告、商店页与活动倒计时；选服时优先考虑语言、朋友、账号和支付环境。",
              "Historical launch dates and older patch gaps are only useful as archive context; they do not guarantee the current version order or availability. For a specific version, compare the target server's in-game notices, store page, and event countdown; prioritize language, friends, account route, and payment environment when choosing a server.",
              "歷史上線日期和舊版本時差只能用於回顧，不能保證目前版本的順序或可用性。要比較某一版本，請分別開啟目標伺服器的遊戲內公告、商店頁與活動倒數；選服時優先考慮語言、朋友、帳號和支付環境。"
            )}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="text-left p-3">{isZh ? "版本" : "Version"}</th>
                  <th className="text-left p-3">{isZh ? "国服" : "CN Server"}</th>
                  <th className="text-left p-3">{isZh ? "国际服" : "Global Server"}</th>
                  <th className="text-left p-3">{isZh ? "时差" : "Gap"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr><td className="p-3">{isZh ? "当前公告" : "Current notice"}</td><td className="p-3">{isZh ? "核对国服客户端与官方公告" : "Check the CN client and official notice"}</td><td className="p-3">{isZh ? "核对国际服客户端与官方公告" : "Check the global client and official notice"}</td><td className="p-3 text-gray-500">{isZh ? "逐期确认" : "Confirm per version"}</td></tr>
                <tr><td className="p-3">{isZh ? "活动与卡池" : "Events and banners"}</td><td className="p-3">{isZh ? "看游戏内倒计时" : "Use the in-game countdown"}</td><td className="p-3">{isZh ? "看游戏内倒计时" : "Use the in-game countdown"}</td><td className="p-3 text-gray-500">{isZh ? "不沿用历史排期" : "Do not reuse historical schedules"}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {localizedText(locale, "如果你关心某个具体版本的先后顺序，建议进入当前卡池页或版本日志页再看当期日期，不要把旧版本时间线当作长期固定规律。", "If you care about one specific patch, verify that version on the live banner schedule or changelog instead of treating an older release gap as a permanent rule.", "如果你關心某個具體版本的先後順序，建議再到當前卡池頁或版本日誌頁查看當期日期，不要把舊版本時間線當成長期固定規律。")}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "二、评分与社区讨论怎么用" : "2. How to Use Ratings and Community Discussion"}</h2>
          <p className="text-gray-400 mb-3 leading-relaxed">
            {isZh
              ? "评分和社区讨论能帮助你发现近期问题，但不能替代自己的地区、设备和账号判断。查看时优先看近期开服环境、平台、设备型号与官方处理进度，而不是把某个历史分数当作选服结论。"
              : "Ratings and community discussions can reveal recent issues, but they cannot replace your own region, device, and account assessment. Focus on recent platform context, device reports, and official follow-up rather than treating one historical score as a server-choice verdict."}
          </p>
          <ul className="space-y-3 text-gray-400">
            <li className="pl-4 border-l-2 border-primary-500/40">
              <strong className="text-gray-200">{isZh ? "看与你设备相近的反馈" : "Read reports from comparable devices"}</strong>
              <p className="text-sm mt-1">{isZh ? "优先寻找同系统、芯片和网络环境下的近期体验，再用试玩或官方支持信息交叉确认。" : "Prioritize recent reports from similar OS, hardware, and network conditions, then cross-check with a trial or official support information."}</p>
            </li>
            <li className="pl-4 border-l-2 border-primary-500/40">
              <strong className="text-gray-200">{isZh ? "区分事实、意见与历史争议" : "Separate facts, opinions, and historical disputes"}</strong>
              <p className="text-sm mt-1">{isZh ? "社区观点会随事件变化；涉及规则、处罚或补偿时，最终以当前官方公告和游戏内说明为准。" : "Community opinions move with events; for rules, enforcement, or compensation, use the current official notice and in-game explanation as the final source."}</p>
            </li>
            <li className="pl-4 border-l-2 border-primary-500/40">
              <strong className="text-gray-200">{isZh ? "不要用评分替代账号安全判断" : "Do not use ratings as an account-safety check"}</strong>
              <p className="text-sm mt-1">{isZh ? "账号绑定、支付与跨端规则要在创建角色前核对，评分无法告诉你当前账号路径是否可用。" : "Verify account binding, payment, and cross-platform rules before creating a character; ratings cannot tell you whether your current account route works."}</p>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "三、定价与付费" : "3. Pricing & Payments"}</h2>
          <p className="text-gray-400 leading-relaxed">
            {isZh
              ? "不要用历史汇率、旧价格表或其他地区截图做充值决定。请在目标区服的商店、支付页和当前活动说明中核对币种、价格、税费、可用支付方式、卡池规则和保底说明，再决定是否充值。"
              : "Do not make spending decisions from historical exchange rates, old price tables, or screenshots from another region. Check currency, price, tax, supported payment methods, banner rules, and pity wording in the target server's current store, payment page, and event notice first."}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "四、内容与账号规则" : "4. Content and Account Rules"}</h2>
          <ul className="space-y-2 text-gray-400">
            <li>{isZh ? "账号绑定、迁移、好友与跨服：创建角色前在客户端或官方公告核对。" : "Account binding, migration, friends, and cross-server behavior: verify in the client or official notice before starting."}</li>
            <li>{isZh ? "活动、卡池与兑换码：按目标区服的游戏内倒计时和来源信息分别确认。" : "Events, banners, and redeem codes: confirm them separately from the target server's in-game countdown and source information."}</li>
            <li>{isZh ? "支付、商品与税费：以目标区服的商店和支付页为准。" : "Payments, products, and taxes: use the target server's store and payment page as the source of truth."}</li>
            <li>{isZh ? "文本、功能与可用性：不要把另一发行线或历史版本的截图当作当前规则。" : "Text, features, and availability: do not treat screenshots from another publishing track or historical version as current rules."}</li>
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "选择建议" : "Which to Pick?"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4">
              <h3 className="font-semibold text-emerald-300 mb-2">{isZh ? "选国服，如果……" : "Pick CN if…"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>{isZh ? "你看懂中文，偏好中文社区" : "You read Chinese and prefer CN communities"}</li>
                <li>{isZh ? "你的地区、语言与支付路径更匹配国服" : "Your region, language, and payment route fit CN"}</li>
                <li>{isZh ? "朋友在国服" : "Friends play CN"}</li>
                <li>{isZh ? "习惯人民币付费" : "You prefer CNY pricing"}</li>
              </ul>
            </div>
            <div className="rounded-lg bg-sky-500/5 border border-sky-500/20 p-4">
              <h3 className="font-semibold text-sky-300 mb-2">{isZh ? "选国际服，如果……" : "Pick Global if…"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>{isZh ? "你偏好英文界面或非中文社区" : "You prefer English UI / non-CN communities"}</li>
                <li>{isZh ? "你的地区、语言与支付路径更匹配国际服" : "Your region, language, and payment route fit global"}</li>
                <li>{isZh ? "朋友在国际服" : "Friends play global"}</li>
                <li>{isZh ? "习惯美元/欧元等本地货币付费" : "You prefer USD/EUR/local currency pricing"}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {[
            { href: `/${lang}/banners`, label: isZh ? "卡池状态核验" : "Banner Status Check" },
            { href: `/${lang}/redeem-codes`, label: isZh ? "兑换码（区分服）" : "Redeem Codes (by server)" },
            { href: `/${lang}/changelog`, label: isZh ? "版本更新日志" : "Version Changelog" },
            { href: `/${lang}/steam`, label: isZh ? "Steam 平台核验" : "Steam Status Check" },
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
