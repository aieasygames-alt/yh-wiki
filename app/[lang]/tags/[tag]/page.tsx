import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import {
  getAllCharacters,
  getAllWeapons,
  getAllMaterials,
  getAllFaqs,
  getAllGuides,
  getAllLore,
  getAllLocations,
} from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../../components/JsonLd";
import { localizedText } from "../../../../lib/seo-copy";

function collectSources() {
  return [
    ...getAllCharacters().map((c) => ({ type: "character" as const, id: c.id, name: c.name, nameEn: c.nameEn, tags: [c.attribute, c.rank.toLowerCase(), c.role.toLowerCase()] })),
    ...getAllWeapons().map((w) => ({ type: "weapon" as const, id: w.id, name: w.name, nameEn: w.nameEn, tags: [w.type.toLowerCase()] })),
    ...getAllMaterials().map((m) => ({ type: "material" as const, id: m.id, name: m.name, nameEn: m.nameEn, tags: [m.type.toLowerCase()] })),
    ...getAllFaqs().map((f) => ({ type: "faq" as const, id: f.id, name: f.question, nameEn: f.questionEn, tags: f.tags })),
    ...getAllGuides().map((g) => ({ type: "guide" as const, id: g.id, name: g.title, nameEn: g.titleEn, tags: g.tags })),
    ...getAllLore().map((l) => ({ type: "lore" as const, id: l.id, name: l.name, nameEn: l.nameEn, tags: [l.category.toLowerCase()] })),
    ...getAllLocations().map((l) => ({ type: "location" as const, id: l.id, name: l.name, nameEn: l.nameEn, tags: [l.category.toLowerCase()] })),
  ];
}

export function generateStaticParams() {
  const sources = collectSources();
  const allTags = new Set<string>();
  sources.forEach((s) => s.tags.forEach((tag) => allTags.add(tag.toLowerCase())));
  return Array.from(allTags).flatMap((tag) => LOCALES.map((lang) => ({ lang, tag })));
}

export async function generateMetadata({ params }: { params: { lang: string; tag: string } }) {
  const { lang, tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const encodedTag = encodeURIComponent(tag);
  const locale = lang as Locale;
  // Count items to decide noindex for thin tag pages
  const sources = collectSources();
  const tagLower = tag.toLowerCase();
  const matched = sources.filter((s) => s.tags.some((t) => t.toLowerCase() === tagLower));
  const title = localizedText(locale, `#${tag} 相关内容 - 异环游戏 Wiki`, `#${tag} - NTE Guide`);
  const description = localizedText(
    locale,
    `异环(NTE)Wiki中与「${tag}」相关的${matched.length}项内容，包括角色、武器、材料、攻略、FAQ、地点和世界观条目，适合快速查找同一主题下的资料与内链入口。`,
    `Browse ${matched.length} Neverness to Everness resources tagged with "${tag}", including characters, weapons, materials, guides, FAQs, locations, and lore entries for quick topical navigation.`
  );

  return {
    title,
    description,
    alternates: hreflangAlternates(`tags/${encodedTag}`, lang),
    // Thin tag pages (< 4 items) waste crawl budget — noindex them
    ...(matched.length < 4 ? { robots: { index: false, follow: true } } : {}),
  };
}

const TYPE_LABELS: Record<string, Record<string, string>> = {
  zh: { character: "角色", weapon: "武器", material: "材料", faq: "FAQ", guide: "攻略", lore: "世界观", location: "地点" },
  tw: { character: "角色", weapon: "武器", material: "材料", faq: "FAQ", guide: "攻略", lore: "世界觀", location: "地點" },
  en: { character: "Character", weapon: "Weapon", material: "Material", faq: "FAQ", guide: "Guide", lore: "Lore", location: "Location" },
};

export default async function TagPage({ params }: { params: { lang: string; tag: string } }) {
  const { lang, tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const locale = lang as Locale;

  const sources = collectSources();
  const tagLower = tag.toLowerCase();
  const matched = sources.filter((s) => s.tags.some((t) => t.toLowerCase() === tagLower));

  if (matched.length === 0) notFound();

  const grouped = matched.reduce<Record<string, typeof matched>>((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const labels = TYPE_LABELS[locale] || TYPE_LABELS["en"];
  const groupSummary = Object.entries(grouped)
    .map(([type, items]) => `${labels[type] || type} ${items.length}`)
    .join(locale === "en" ? ", " : "、");
  const intro = localizedText(
    locale,
    `「${tag}」标签聚合了 ${groupSummary}。这些内容覆盖异环数据库、攻略、FAQ和世界观页面，方便从同一主题继续浏览角色养成、地图探索、材料刷取或系统说明。`,
    `The "${tag}" tag groups ${groupSummary}. Use this page to move between related NTE database entries, guides, FAQs, lore pages, and location resources without relying on site search.`
  );
  const usageNote = localizedText(
    locale,
    `建议优先查看角色、材料和攻略条目：角色页通常包含配装、技能和养成材料，材料页提供来源与用途，攻略页会补充实战路线。若某个标签只覆盖少量内容，页面会自动设置 noindex，以减少低价值索引页；内容达到索引门槛时则保留为主题入口页。`,
    `Start with character, material, and guide entries first: character pages usually include builds, skills, and upgrade materials; material pages explain sources and uses; guide pages add route or strategy context. Very small tag groups are automatically marked noindex to reduce low-value index pages; broader groups remain indexable as topic hubs.`
  );

  return (
    <>
      <ItemListJsonLd
        items={matched.map((m) => ({
          name: isZhLocale(locale) ? m.name : m.nameEn,
          url: `https://nteguide.com/${lang}/${m.type === "faq" ? "faq" : m.type === "guide" ? "guides" : m.type === "lore" ? "lore" : m.type === "location" ? "locations" : m.type + "s"}/${m.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: `#${tag}` },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">#{tag}</h1>
        <p className="text-gray-500 mb-8">
          {matched.length} {t(locale, "common.items")}
        </p>
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-lg font-bold mb-3">
            {localizedText(locale, "标签概览", "Tag Overview")}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">{intro}</p>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">{usageNote}</p>
        </section>

        {Object.entries(grouped).map(([type, items]) => (
          <section key={type} className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-primary-400">
              {labels[type] || type} ({items.length})
            </h2>
            <div className="space-y-2">
              {items.map((item) => (
                <a
                  key={`${type}-${item.id}`}
                  href={`/${lang}/${type === "faq" ? "faq" : type === "guide" ? "guides" : type === "lore" ? "lore" : type === "location" ? "locations" : type + "s"}/${item.id}`}
                  className="block rounded-lg border border-gray-800 bg-gray-900/30 px-4 py-3 hover:border-primary-500/50 hover:bg-gray-900/50 transition-colors"
                >
                  <p className="text-sm font-medium">{isZhLocale(locale) ? item.name : item.nameEn}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{labels[type] || type}</p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
