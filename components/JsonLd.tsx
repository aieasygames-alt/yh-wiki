import { isZhLocale, type Locale } from "../lib/i18n";

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
      target: "https://nteguide.com/en/characters?q={search_term_string}",
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

export function CharacterJsonLd({ character, locale }: { character: { name: string; nameEn: string; attribute: string; rank: string; description?: string; descriptionEn?: string }; locale: Locale }) {
  const displayName = isZhLocale(locale) ? character.name : character.nameEn;
  const altName = isZhLocale(locale) ? character.nameEn : character.name;
  const description = isZhLocale(locale)
    ? (character.description || `${character.name} - Neverness to Everness 角色`)
    : (character.descriptionEn || `${character.nameEn} - Neverness to Everness character`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: displayName,
    alternateName: altName,
    description,
    mainEntity: {
      "@type": "VideoGame",
      name: "Neverness to Everness",
    },
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

export function FaqJsonLd({ faq, lang }: { faq: { question: string; questionEn: string; answer: string; answerEn: string; extraFaqSchema?: { question: string; questionEn: string; answer: string; answerEn: string }[] }; lang: Locale }) {
  const isZh = isZhLocale(lang);
  const question = isZh ? faq.question : faq.questionEn;
  const answer = isZh ? faq.answer : faq.answerEn;

  const mainEntity = [
    {
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    },
  ];

  if (faq.extraFaqSchema && faq.extraFaqSchema.length > 0) {
    for (const item of faq.extraFaqSchema) {
      mainEntity.push({
        "@type": "Question",
        name: isZh ? item.question : item.questionEn,
        acceptedAnswer: { "@type": "Answer", text: isZh ? item.answer : item.answerEn },
      });
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
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

export function ArticleJsonLd({ title, description, url, datePublished, dateModified, image }: { title: string; description: string; url: string; datePublished?: string; dateModified?: string; image?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    image: image || "https://nteguide.com/og.png",
    author: {
      "@type": "Organization",
      name: "NTE Guide",
      url: "https://nteguide.com",
    },
    publisher: {
      "@type": "Organization",
      name: "NTE Guide",
      url: "https://nteguide.com",
      logo: {
        "@type": "ImageObject",
        url: "https://nteguide.com/og.png",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FaqPageJsonLd({ faqs, lang }: { faqs: { question: string; questionZh?: string; questionEn?: string; answer: string; answerZh?: string; answerEn?: string }[]; lang: Locale }) {
  const isZh = isZhLocale(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: isZh ? (faq.questionZh || faq.question) : (faq.questionEn || faq.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: isZh ? (faq.answerZh || faq.answer) : (faq.answerEn || faq.answer),
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

/**
 * @deprecated DO NOT USE on weapon/character/game-item pages. This emits a
 * fabricated e-commerce Product schema (price 0, free shipping, US-only)
 * that Google flags as invalid ("Either offers/review/aggregateRating should
 * be specified"). Game items are not real products. Use ArticleJsonLd for
 * content pages instead. Retained only for the seo.test.tsx test stub.
 */
export function ProductJsonLd({ name, description, url, image, ratingValue, reviewCount, category }: { name: string; description: string; url?: string; image?: string; ratingValue?: number; reviewCount?: number; category?: string }) {
  const offer = {
    "@type": "Offer",
    url: url || "https://nteguide.com",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "0",
        currency: "USD",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "US",
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY",
        },
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "US",
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
    },
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name,
    description,
    image: image || "https://nteguide.com/og.png",
    ...(url ? { url } : {}),
    mainEntity: {
      "@type": "Product",
      name,
      description,
      ...(category ? { category } : {}),
      image: image || "https://nteguide.com/og.png",
      offers: offer,
      ...(ratingValue ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: String(ratingValue),
          bestRating: "5",
          worstRating: "1",
          reviewCount: String(reviewCount || 1),
        },
      } : {}),
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
