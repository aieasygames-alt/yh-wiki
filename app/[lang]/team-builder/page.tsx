import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { WebApplicationJsonLd } from "../../../components/JsonLd";
import { TeamBuilderClient } from "./TeamBuilderClient";
import { getAvailableCharacters } from "../../../lib/queries";

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
    ? (locale === "tw" ? "異環隊伍標籤檢查器｜本地組合觀察" : "异环队伍标签检查器｜本地组合观察")
    : "NTE Team Tag Checker | Local Composition Observations";
  const description = isZh
    ? (locale === "tw" ? "依站內靜態屬性與定位標籤查看隊伍組合；本工具不驗證目前共鳴、技能、數值、機制或實戰強度。" : "依据站内静态属性与定位标签查看队伍组合；本工具不验证当前共鸣、技能、数值、机制或实战强度。")
    : "Inspect team combinations using site-held attribute and role tags. This tool does not verify current resonance, skills, values, mechanics, or combat strength.";

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
        ? "这个工具只根据站内静态属性与定位标签展示组合观察，方便你发现可能的角色职能重叠或缺口。它不读取客户端，也不能确认当前共鸣、技能、数值、机制或实际队伍强度。"
        : "这个工具只根据站内静态属性与定位标签展示组合观察，方便你发现可能的角色职能重叠或缺口。它不读取客户端，也不能确认当前共鸣、技能、数值、机制或实际队伍强度。")
    : "This tool shows combination observations from static site-held attribute and role tags so you can spot possible role overlap or gaps. It does not read the client and cannot confirm current resonance, skills, values, mechanics, or real team strength.";
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
          ? "使用前先在目標區服客戶端核對角色可獲取狀態、技能、隊伍規則與近期調整。"
          : "使用前先在目标区服客户端核对角色可获取状态、技能、队伍规则与近期调整。",
      ]
    : [
        "Decide whether the team is for 999 Nights, high-pressure bosses, or general progression first.",
        "Do not judge by single-character power alone. Check rotation flow, buff coverage, and sustain depth too.",
        "Before using a result, verify character availability, skills, team rules, and recent changes in the target server's client.",
      ];
  const followupTitle = isZh
    ? (locale === "tw" ? "相關頁面" : "相关页面")
    : "Related pages";
  const followups = [
    { href: `/${lang}/faq/faq-f2p-viable`, label: isZh ? (locale === "tw" ? "零氪能不能玩" : "零氪能不能玩") : "Is NTE F2P friendly?" },
    { href: `/${lang}/faq/faq-lacrimosa-team`, label: isZh ? (locale === "tw" ? "安魂曲需要早霧嗎" : "安魂曲需要早雾吗") : "Does Lacrimosa need Hayashikiri?" },
    { href: `/${lang}/faq/zhenhong-worth-pulling`, label: isZh ? (locale === "tw" ? "真紅值得抽嗎" : "真红值得抽吗") : "Is Zhenhong worth pulling?" },
  ];
  const characters = getAvailableCharacters().map((character) => ({
    id: character.id,
    name: character.name,
    nameEn: character.nameEn,
    attribute: character.attribute,
    rank: character.rank,
    role: character.role,
    roleEn: character.roleEn,
  }));

  return (
    <>
      <WebApplicationJsonLd
        name={isZhLocale(locale) ? "异环配队模拟器" : "NTE Team Builder"}
        description={isZh ? "基于静态属性与定位标签的本地队伍组合观察工具；不验证当前实战规则" : "Local team-combination observations from static attribute and role tags; it does not verify live gameplay rules"}
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
      <TeamBuilderClient lang={lang} characters={characters} />
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
