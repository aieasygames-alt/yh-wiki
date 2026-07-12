import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllCharacters, getAvailableCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { CharacterFilter } from "../../../components/CharacterFilter";
import { KardzPromoCard } from "../../../components/KardzPromoCard";
import { localizedText } from "../../../lib/seo-copy";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const availableCount = getAvailableCharacters().length;
  const title = localizedText(
    locale,
    `异环全角色图鉴 - ${availableCount} 名角色强度、Build 与配队入口 | NTE Guide`,
    `NTE Characters - ${availableCount} Character Builds, Teams, and Tier Guide`
  );
  const description = localizedText(
    locale,
    `异环 ${availableCount} 名可玩角色总表，整理角色定位、Build、配队、强度参考与培养方向，方便你按属性、定位和版本需求快速筛选。`,
    `Browse ${availableCount} playable NTE characters with role filters, build links, team guides, and tier reference so you can compare units by attribute, role, and account needs.`
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("characters", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function CharactersPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const characters = getAvailableCharacters();
  const allCharacters = getAllCharacters();
  const priorityLinks = [
    { id: "shinku", en: "Shinku NTE guide", zh: "沁红攻略", tw: "沁紅攻略" },
    { id: "black-bird", en: "Black Bird NTE guide", zh: "黑鸟攻略", tw: "黑鳥攻略" },
    { id: "akane", en: "Akane NTE guide", zh: "Akane 攻略", tw: "Akane 攻略" },
    { id: "lingko", en: "Lingko NTE guide", zh: "凛子攻略", tw: "凛子攻略" },
    { id: "illica", en: "Illica NTE guide", zh: "伊洛伊攻略", tw: "伊洛伊攻略" },
    { id: "renee", en: "Renee NTE guide", zh: "蕾妮攻略", tw: "蕾妮攻略" },
    { id: "nitsa", en: "Nitsa NTE guide", zh: "尼察攻略", tw: "尼察攻略" },
  ].filter((link) => allCharacters.some((character) => character.id === link.id));

  return (
    <>
      <ItemListJsonLd
        items={characters.map((c) => ({
          name: isZhLocale(locale) ? c.name : c.nameEn,
          url: `https://nteguide.com/${lang}/characters/${c.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.characters") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{t(locale, "characters.title")}</h1>
        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale) ? (locale === "tw" ? "這頁角色圖鑑最適合怎麼看？" : "这页角色图鉴最适合怎么用？") : "How should you use this character index?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? (locale === "tw"
                  ? "先用這裡篩出你要找的屬性、定位或版本熱門角色，再進入單角色頁看 Build、配隊、抽取建議與養成優先級。角色總表適合快速比較，不適合只看名稱就直接決定投入。"
                  : "先用这里筛出你要找的属性、定位或版本热门角色，再进入单角色页看 Build、配队、抽取建议与养成优先级。角色总表适合快速比较，不适合只看名字就直接决定投入。")
              : "Use this page to filter by attribute, role, or current meta interest first, then open the character guide for builds, teams, pull value, and upgrade priority. The index is best for comparison, not final investment decisions by name alone."}
          </p>
        </section>
        <div className="mb-6">
          <KardzPromoCard locale={locale} variant="banner" />
        </div>
        {priorityLinks.length > 0 && (
          <nav className="mb-6 rounded-xl border border-gray-800 bg-gray-900/40 p-4" aria-label={isZhLocale(locale) ? "热门角色攻略" : "Popular NTE character guides"}>
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-3">
              {isZhLocale(locale) ? (locale === "tw" ? "熱門搜尋" : "热门搜索") : "Popular searches"}
            </p>
            <div className="flex flex-wrap gap-2">
              {priorityLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`/${lang}/characters/${link.id}`}
                  className="rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-gray-300 hover:border-primary-500/50 hover:text-primary-300 transition-colors"
                >
                  {locale === "tw" ? link.tw : isZhLocale(locale) ? link.zh : link.en}
                </Link>
              ))}
            </div>
          </nav>
        )}
        <CharacterFilter characters={characters} locale={locale} lang={lang} />

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? (locale === "tw" ? "選角前先確認" : "选角色前先确认") : "Check this before choosing a character"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "你的隊伍缺的是主C、破韌、輔助還是治療。" : "你的队伍缺的是主C、破韧、辅助还是治疗。") : "Know whether your roster needs a carry, break unit, support, or healer."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "看角色時別只看單卡強度，也要看是否吃專武、專屬隊友或高練度。" : "看角色时别只看单卡强度，也要看是否吃专武、专属队友或高练度。") : "Do not judge by solo power alone; check whether the unit depends on signature gear, specific teammates, or high investment."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "如果你主要打 999 Nights、Boss 或探索，優先級會明顯不同。" : "如果你主要打 999 Nights、Boss 或探索，优先级会明显不同。") : "Your priorities change a lot depending on whether you focus on 999 Nights, bosses, or exploration."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? (locale === "tw" ? "常見誤區" : "常见误区") : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "只跟著強度榜抽，結果補不到帳號真正缺的功能位。" : "只跟着强度榜抽，结果补不到账号真正缺的功能位。") : "Pulling strictly by tier list and missing the role your account actually needs."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "把前期開荒體驗和後期高配畢業表現混在一起看。" : "把前期开荒体验和后期高配毕业表现混在一起看。") : "Mixing early-game comfort with late-game ceiling when evaluating a unit."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "忽略角色頁裡的 Build 與配隊條件，只看立繪或話題度。" : "忽略角色页里的 Build 与配队条件，只看立绘或话题度。") : "Ignoring build and team conditions in the guide and choosing only by visual appeal or hype."}</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
