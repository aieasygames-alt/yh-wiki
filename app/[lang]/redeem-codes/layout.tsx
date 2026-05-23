import { t, Locale, hreflangAlternates } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;

  const title = t(locale, "redeemCodes.seoTitle");
  const description = t(locale, "redeemCodes.description");

  return {
    title,
    description,
    alternates: hreflangAlternates("redeem-codes", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function RedeemCodesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const { lang } = await params;
  const isZh = lang === "zh";
  const isTw = lang === "tw";

  const faqItems = isTw
    ? [
        {
          question: "異環兌換碼怎麼用？在哪裡輸入？",
          answer: "進入遊戲後，點擊右上角頭像 → 設定 → 兌換碼輸入框，輸入有效的兌換碼即可領取獎勵。建議第一時間兌換，避免過期。",
        },
        {
          question: "異環1.1前瞻直播兌換碼有哪些？",
          answer: "1.1版本前瞻直播（5月23日）公布了3個兌換碼：DREAMWALK0603、TOMATO100、RACENOLIMIT，有效期至5月25日23:59。",
        },
        {
          question: "異環公測兌換碼還能用嗎？",
          answer: "公測期兌換碼（NTENOWTOENJOY、NTENANALLYGO、NTE0429等）已全部過期。請關注後續直播和活動獲取新碼。",
        },
        {
          question: "異環新兌換碼在哪裡獲取？",
          answer: "新兌換碼通常在官方前瞻直播中公布，也會透過社群媒體活動和合作管道發放。本頁面會第一時間更新所有有效兌換碼。",
        },
      ]
    : isZh
      ? [
          {
            question: "异环兑换码在哪里输入？怎么用？",
            answer: "进入游戏后，点击右上角头像 → 设置 → 兑换码输入框，输入有效的兑换码即可领取奖励。建议第一时间兑换，避免过期。",
          },
          {
            question: "异环1.1前瞻直播兑换码有哪些？",
            answer: "1.1版本前瞻直播（5月23日）公布了3个兑换码：DREAMWALK0603、TOMATO100、RACENOLIMIT，有效期至5月25日23:59。",
          },
          {
            question: "异环公测兑换码还能用吗？",
            answer: "公测期兑换码（NTENOWTOENJOY、NTENANALLYGO、NTE0429等）已全部过期。请关注后续直播和活动获取新码。",
          },
          {
            question: "异环新兑换码在哪里获取？",
            answer: "新兑换码通常在官方前瞻直播中公布，也会通过社交媒体活动和合作渠道发放。本页面会第一时间更新所有有效兑换码。",
          },
        ]
      : [
          {
            question: "How to redeem codes in Neverness to Everness?",
            answer: "Launch the game, tap your profile icon (top-right) → Settings → enter the code in the Redeem Code field. Redeem immediately to avoid expiration.",
          },
          {
            question: "What are the latest NTE redeem codes from the 1.1 livestream?",
            answer: "The 1.1 livestream (May 23) released 3 codes: DREAMWALK0603, TOMATO100, and RACENOLIMIT, valid until May 25 23:59.",
          },
          {
            question: "Do NTE redeem codes expire?",
            answer: "Yes, all redeem codes have expiration dates. Launch-era codes have expired. New codes are released during livestreams and events.",
          },
          {
            question: "Where do I find new NTE redeem codes?",
            answer: "New codes are announced during official livestreams, social media events, and partner promotions. This page is updated in real-time.",
          },
        ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: isTw
      ? "如何兌換異環兌換碼"
      : isZh
        ? "如何兑换异环兑换码"
        : "How to Redeem Codes in Neverness to Everness",
    description: isTw
      ? "一步一步教你如何在異環(NTE)中輸入兌換碼領取獎勵"
      : isZh
        ? "一步一步教你如何在异环(NTE)中输入兑换码领取奖励"
        : "Step-by-step guide to redeem codes in Neverness to Everness",
    step: isTw
      ? [
          { "@type": "HowToStep", text: "開啟異環遊戲，進入主畫面" },
          { "@type": "HowToStep", text: "點擊右上角個人頭像" },
          { "@type": "HowToStep", text: "進入設定頁面，找到兌換碼輸入框" },
          { "@type": "HowToStep", text: "輸入有效的兌換碼並確認" },
        ]
      : isZh
        ? [
            { "@type": "HowToStep", text: "打开异环游戏，进入主界面" },
            { "@type": "HowToStep", text: "点击右上角个人头像" },
            { "@type": "HowToStep", text: "进入设置页面，找到兑换码输入框" },
            { "@type": "HowToStep", text: "输入有效的兑换码并确认" },
          ]
        : [
            { "@type": "HowToStep", text: "Launch Neverness to Everness and enter the main menu" },
            { "@type": "HowToStep", text: "Tap your profile icon in the top-right corner" },
            { "@type": "HowToStep", text: "Go to Settings and find the Redeem Code field" },
            { "@type": "HowToStep", text: "Enter a valid code and confirm" },
          ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      {children}
    </>
  );
}
