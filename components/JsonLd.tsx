export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NTE Guide",
    alternateName: "Neverness to Everness Wiki",
    url: "https://nteguide.com",
    description: "Neverness to Everness Wiki & tools. Character builds, tier lists, calculator, guides and codes.",
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
    description: character.description || `${character.name} - Neverness to Everness character`,
    game: "Neverness to Everness",
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

export function FaqJsonLd({ faq, lang }: { faq: { question: string; questionEn: string; answer: string; answerEn: string }; lang: "zh" | "en" }) {
  const question = lang === "zh" ? faq.question : faq.questionEn;
  const answer = lang === "zh" ? faq.answer : faq.answerEn;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url?: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ArticleJsonLd({ title, description, url, datePublished }: { title: string; description: string; url: string; datePublished?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    ...(datePublished ? { datePublished } : {}),
    publisher: {
      "@type": "Organization",
      name: "NTE Guide",
      url: "https://nteguide.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FaqPageJsonLd({ faqs, lang }: { faqs: { question: string; questionZh: string; answer: string; answerZh: string }[]; lang: "zh" | "en" }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: lang === "zh" ? faq.questionZh : faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: lang === "zh" ? faq.answerZh : faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NTE Guide",
    url: "https://nteguide.com",
    description: "Neverness to Everness Wiki and tools",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function VideoGameJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Neverness to Everness",
    alternateName: "异环",
    gamePlatform: "PC",
    applicationCategory: "Game",
    genre: "Action RPG",
    url: "https://nteguide.com",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ProductJsonLd({ name, description, url, image }: { name: string; description: string; url?: string; image?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: image || "https://nteguide.com/og.png",
    ...(url ? { url } : {}),
    brand: {
      "@type": "Brand",
      name: "Neverness to Everness",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "1",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebApplicationJsonLd({ name, description }: { name: string; description: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: "https://nteguide.com",
    applicationCategory: "Game Tool",
    operatingSystem: "Web",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
