import { Breadcrumb } from "../../../components/Breadcrumb";
import { LOCALES, hreflangAlternates, isZhLocale, type Locale } from "../../../lib/i18n";
import { NineNightsPlannerClient } from "./NineNightsPlannerClient";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = isZhLocale(locale)
    ? (locale === "tw"
        ? "異環 999夜規劃器 — 神秘鈕扣缺口與每日刷取目標"
        : "异环 999夜规划器 — 神秘纽扣缺口与每日刷取目标")
    : "NTE 999 Nights Planner — Mystery Button Gap & Daily Target";
  const description = isZhLocale(locale)
    ? (locale === "tw"
        ? "快速估算 999 夜目標還差多少神秘鈕扣、每天要刷多少，並跳轉到沃倫大陸、真紅與 1.2 相關攻略。"
        : "快速估算 999 夜目标还差多少神秘纽扣、每天要刷多少，并跳转到沃伦大陆、真红与 1.2 相关攻略。")
    : "Plan your 999 Nights Mystery Button goals, estimate the remaining gap, set a daily farming target, and jump to the best follow-up guides.";

  return {
    title,
    description,
    alternates: hreflangAlternates("999-nights-planner", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function NineNightsPlannerPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const appName = isZh ? (locale === "tw" ? "999夜規劃器" : "999夜规划器") : "999 Nights Planner";
  const introTitle = isZh
    ? (locale === "tw" ? "這個 999 夜規劃器適合誰？" : "这个 999 夜规划器适合谁？")
    : "Who should use this 999 Nights planner?";
  const introBody = isZh
    ? (locale === "tw"
        ? "如果你正在刷 1.2 的九百九十九夜常駐玩法，這個工具的用途不是只幫你算一個總數，而是把目標獎勵、目前已持有數量和每日刷取節奏放到同一個面板裡，方便你判斷這週該先肝神秘鈕扣、先補真紅材料，還是先把沃倫大陸的收集做完。"
        : "如果你正在刷 1.2 的九百九十九夜常驻玩法，这个工具的用途不是只帮你算一个总数，而是把目标奖励、当前已持有数量和每日刷取节奏放到同一个面板里，方便你判断这周该先肝神秘纽扣、先补真红材料，还是先把沃伦大陆的收集做完。")
    : "If you are farming NTE 1.2's permanent 999 Nights mode, this planner is meant to do more than show one total. It puts your target rewards, current inventory, and daily farming pace in one place so you can decide whether to push Mystery Buttons, prefarm Zhenhong resources, or finish Warren Continent collection first.";
  const notesTitle = isZh
    ? (locale === "tw" ? "使用前先看這三件事" : "使用前先看这三件事")
    : "Three things to check before planning";
  const notes = isZh
    ? [
        locale === "tw"
          ? "先確認你要追的是全商店、外觀類獎勵，還是只補角色養成相關目標。"
          : "先确认你要追的是全商店、外观类奖励，还是只补角色养成相关目标。",
        locale === "tw"
          ? "把目前已持有的神秘鈕扣填進去，結果才會接近真實每日缺口。"
          : "把当前已持有的神秘纽扣填进去，结果才会接近真实每日缺口。",
        locale === "tw"
          ? "如果你還沒開啟 999 夜入口，先去看 1.2 主線與沃倫大陸相關攻略。"
          : "如果你还没开启 999 夜入口，先去看 1.2 主线与沃伦大陆相关攻略。",
      ]
    : [
        "Decide whether you are planning for the full shop, cosmetic rewards, or only progression-related targets.",
        "Enter your current Mystery Button count first so the daily gap estimate matches your real account state.",
        "If 999 Nights is not unlocked yet, check the Version 1.2 story and Warren Continent guides before setting a farm plan.",
      ];
  const relatedTitle = isZh
    ? (locale === "tw" ? "接著看什麼" : "接着看什么")
    : "What to read next";
  const relatedLinks = [
    {
      href: `/${lang}/faq/nte-999-nights-unlock`,
      label: isZh ? (locale === "tw" ? "999夜怎麼解鎖" : "999夜怎么解锁") : "How to unlock 999 Nights",
    },
    {
      href: `/${lang}/faq/warren-continent-how-to-unlock`,
      label: isZh ? (locale === "tw" ? "沃倫大陸怎麼去" : "沃伦大陆怎么去") : "How to reach the Warren Continent",
    },
    {
      href: `/${lang}/faq/zhenhong-materials`,
      label: isZh ? (locale === "tw" ? "真紅材料要先準備什麼" : "真红材料要先准备什么") : "What to prefarm for Zhenhong",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: appName,
            url: `https://nteguide.com/${lang}/999-nights-planner`,
            applicationCategory: "GameApplication",
            operatingSystem: "All",
            description: isZh
              ? (locale === "tw"
                  ? "異環 999 夜神秘鈕扣目標規劃工具"
                  : "异环 999 夜神秘纽扣目标规划工具")
              : "A planning tool for 999 Nights Mystery Button goals in Neverness to Everness",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: isZh ? (locale === "tw" ? "首頁" : "首页") : "Home", href: `/${lang}` },
          { label: appName },
        ]}
      />
      <section className="mx-auto max-w-5xl px-4 pt-6 pb-3 text-sm text-gray-300">
        <h2 className="text-xl font-semibold text-white">{introTitle}</h2>
        <p className="mt-3 leading-7">{introBody}</p>
      </section>
      <NineNightsPlannerClient lang={lang} />
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <div className="grid gap-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-white">{notesTitle}</h2>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-gray-300">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{relatedTitle}</h2>
            <div className="mt-3 space-y-3 text-sm">
              {relatedLinks.map((item) => (
                <a key={item.href} href={item.href} className="block text-primary-300 hover:text-primary-200">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
