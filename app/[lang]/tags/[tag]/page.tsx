import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../../lib/i18n";
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

const ALL_TAGS = new Set<string>();

function collectTags() {
  const sources = [
    ...getAllCharacters().map((c) => ({ type: "character" as const, id: c.id, name: c.name, nameEn: c.nameEn, tags: [c.attribute, c.rank.toLowerCase(), c.role.toLowerCase()] })),
    ...getAllWeapons().map((w) => ({ type: "weapon" as const, id: w.id, name: w.name, nameEn: w.nameEn, tags: [w.type.toLowerCase()] })),
    ...getAllMaterials().map((m) => ({ type: "material" as const, id: m.id, name: m.name, nameEn: m.nameEn, tags: [m.type.toLowerCase()] })),
    ...getAllFaqs().map((f) => ({ type: "faq" as const, id: f.id, name: f.question, nameEn: f.questionEn, tags: f.tags })),
    ...getAllGuides().map((g) => ({ type: "guide" as const, id: g.id, name: g.title, nameEn: g.titleEn, tags: g.tags })),
    ...getAllLore().map((l) => ({ type: "lore" as const, id: l.id, name: l.name, nameEn: l.nameEn, tags: [l.category.toLowerCase()] })),
    ...getAllLocations().map((l) => ({ type: "location" as const, id: l.id, name: l.name, nameEn: l.nameEn, tags: [l.category.toLowerCase()] })),
  ];
  sources.forEach((s) => s.tags.forEach((tag) => ALL_TAGS.add(tag.toLowerCase())));
  return sources;
}

export function generateStaticParams() {
  collectTags();
  return Array.from(ALL_TAGS).flatMap((tag) => [
    { lang: "zh", tag },
    { lang: "tw", tag },
    { lang: "en", tag },
  ]);
}

export async function generateMetadata({ params }: { params: { lang: string; tag: string } }) {
  const { lang, tag } = await params;
  const locale = lang as Locale;
  const title = isZhLocale(locale) ? `#${tag} 相关内容 - 异环 Wiki` : `#${tag} - NTE Guide`;
  return {
    title: `${title} | NTE Guide`,
    description: title,
    alternates: hreflangAlternates(`tags/${tag}`, lang),
  };
}

const TYPE_LABELS: Record<string, Record<string, string>> = {
  zh: { character: "角色", weapon: "武器", material: "材料", faq: "FAQ", guide: "攻略", lore: "世界观", location: "地点" },
  tw: { character: "角色", weapon: "武器", material: "材料", faq: "FAQ", guide: "攻略", lore: "世界觀", location: "地點" },
  en: { character: "Character", weapon: "Weapon", material: "Material", faq: "FAQ", guide: "Guide", lore: "Lore", location: "Location" },
};

export default async function TagPage({ params }: { params: { lang: string; tag: string } }) {
  const { lang, tag } = await params;
  const locale = lang as Locale;

  const sources = collectTags();
  const tagLower = tag.toLowerCase();
  const matched = sources.filter((s) => s.tags.some((t) => t.toLowerCase() === tagLower));

  if (matched.length === 0) notFound();

  const grouped = matched.reduce<Record<string, typeof matched>>((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const labels = TYPE_LABELS[locale];

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
          {matched.length} {isZhLocale(locale) ? "个相关内容" : "items"}
        </p>

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
