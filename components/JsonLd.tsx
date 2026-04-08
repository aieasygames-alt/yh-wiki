export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "异环 Wiki",
    alternateName: "YiHuan Wiki",
    url: "https://nteguide.com",
    description: "异环游戏数据库和工具站，提供角色升级材料查询、养成计算器等实用工具。",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://nteguide.com/zh/characters?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function CharacterJsonLd({ character }: { character: { name: string; nameEn: string; attribute: string; rank: string; description?: string } }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGameCharacter",
    name: character.name,
    alternateName: character.nameEn,
    description: character.description || `${character.name} - 异环游戏角色`,
    game: "异环",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ItemListJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
