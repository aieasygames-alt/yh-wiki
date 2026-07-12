import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { WebApplicationJsonLd } from "../../../components/JsonLd";
import { TeamBuilderClient } from "./TeamBuilderClient";

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
  const isZh = isZhLocale(locale);
  const title = isZh
    ? (locale === "tw" ? "異環配隊模擬器 — 最佳隊伍組建工具" : "异环配队模拟器 — 最佳队伍组建工具")
    : "NTE Team Builder — Best Team Composition Tool";
  const description = isZh
    ? (locale === "tw" ? "異環配隊模擬器：選擇角色，分析共鳴效果，生成最佳隊伍搭配。支持屬性共鳴、角色協同分析。" : "异环配队模拟器：选择角色，分析共鸣效果，生成最佳队伍搭配。支持属性共鸣、角色协同分析。")
    : "Build the best Neverness to Everness teams. Analyze synergy, resonance effects, and role coverage for optimal team compositions.";

  return {
    title,
    description,
    alternates: hreflangAlternates("team-builder", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function TeamBuilderPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const introTitle = isZh
    ? (locale === "tw" ? "配隊模擬器能幫你解決什麼？" : "配队模拟器能帮你解决什么？")
    : "What is this team builder good for?";
  const introBody = isZh
    ? (locale === "tw"
        ? "這個異環配隊模擬器適合拿來做三件事：先補主隊缺的功能位、再檢查屬性與定位是否重疊、最後確認你現在抽到的新角色到底該進哪一隊。它不是只生成一個固定答案，而是幫你更快看出主 C、輔助、生存和共鳴配置之間有沒有明顯衝突。"
        : "这个异环配队模拟器适合拿来做三件事：先补主队缺的功能位、再检查属性与定位是否重叠、最后确认你现在抽到的新角色到底该进哪一队。它不是只生成一个固定答案，而是帮你更快看出主 C、辅助、生存和共鸣配置之间有没有明显冲突。")
    : "This NTE team builder is best used for three jobs: filling the role your main team still lacks, checking whether attributes and jobs overlap too much, and deciding where a newly pulled character actually fits. It is not meant to spit out one universal answer. It helps you spot conflicts between carry, support, sustain, and resonance choices faster.";
  const checklistTitle = isZh
    ? (locale === "tw" ? "配隊前先確認" : "配队前先确认")
    : "Check these before you build";
  const checklist = isZh
    ? [
        locale === "tw"
          ? "先決定這隊是拿來打 999 夜、高壓 Boss，還是泛用推圖。"
          : "先决定这队是拿来打 999 夜、高压 Boss，还是泛用推图。",
        locale === "tw"
          ? "不要只看單卡強度，還要確認輪轉、增益覆蓋和生存位是否足夠。"
          : "不要只看单卡强度，还要确认轮转、增益覆盖和生存位是否足够。",
        locale === "tw"
          ? "如果你在抽卡階段，先用它比較補角色和補弧盤哪個提升更直接。"
          : "如果你在抽卡阶段，先用它比较补角色和补弧盘哪个提升更直接。",
      ]
    : [
        "Decide whether the team is for 999 Nights, high-pressure bosses, or general progression first.",
        "Do not judge by single-character power alone. Check rotation flow, buff coverage, and sustain depth too.",
        "If you are still spending pulls, use the builder to compare whether another character or an Arc investment helps more.",
      ];
  const followupTitle = isZh
    ? (locale === "tw" ? "相關頁面" : "相关页面")
    : "Related pages";
  const followups = [
    { href: `/${lang}/faq/faq-f2p-viable`, label: isZh ? (locale === "tw" ? "零氪能不能玩" : "零氪能不能玩") : "Is NTE F2P friendly?" },
    { href: `/${lang}/faq/faq-lacrimosa-team`, label: isZh ? (locale === "tw" ? "安魂曲需要早霧嗎" : "安魂曲需要早雾吗") : "Does Lacrimosa need Hayashikiri?" },
    { href: `/${lang}/faq/zhenhong-worth-pulling`, label: isZh ? (locale === "tw" ? "真紅值得抽嗎" : "真红值得抽吗") : "Is Zhenhong worth pulling?" },
  ];

  return (
    <>
      <WebApplicationJsonLd
        name={isZhLocale(locale) ? "异环配队模拟器" : "NTE Team Builder"}
        description="Interactive team composition builder for Neverness to Everness"
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "teamBuilder.title") },
        ]}
      />
      <section className="mx-auto max-w-6xl px-4 pt-6 pb-3 text-sm text-gray-300">
        <h2 className="text-xl font-semibold text-white">{introTitle}</h2>
        <p className="mt-3 leading-7">{introBody}</p>
      </section>
      <TeamBuilderClient lang={lang} />
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-white">{checklistTitle}</h2>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-gray-300">
              {checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{followupTitle}</h2>
            <div className="mt-3 space-y-3 text-sm">
              {followups.map((item) => (
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
