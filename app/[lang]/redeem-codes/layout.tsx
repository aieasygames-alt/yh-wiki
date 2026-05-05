import { isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const isTw = locale === "tw";

  const title = isTw
    ? "異環兌換碼（2026年5月）— 國服/國際服禮包碼序號大全、直播兌換碼即時更新 | NTE Guide"
    : isZh
      ? "异环兑换码（2026年5月）— 国服/国际服礼包码大全、开服兑换码、前瞻直播码实时更新 | NTE Guide"
      : "NTE Redeem Codes (May 2026) — All Active Codes, Gift Codes & Livestream Codes";
  const description = isTw
    ? "異環(NTE)兌換碼即時更新（2026年5月）。國服和國際服所有有效禮包碼/序號，含前瞻直播碼、開服碼，附兌換方法教學和獎勵一覽。"
    : isZh
      ? "异环(NTE)兑换码实时更新（2026年5月）。国服和国际服所有有效礼包码，含开服兑换码、前瞻直播码、合作码，附兑换入口和奖励详情。"
      : "All working NTE redeem codes for May 2026 (CN & Global). Includes livestream codes NTENOWTOENJOY, NTENANALLYGO, NTE0429 and more. Copy & redeem instantly!";

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
          answer: "進入遊戲後，點擊右上角頭像 → 設定 → 兌換碼輸入框，輸入有效的兌換碼即可領取獎勵。建議開服後第一時間兌換，避免過期。",
        },
        {
          question: "異環國際服兌換碼有哪些？",
          answer: "目前國際服有效兌換碼包括 NTENOWTOENJOY、NTENANALLYGO、NTE0429 等，有效期至 2026 年 5 月。請以本頁面最新資訊為準。",
        },
        {
          question: "異環兌換碼過期了怎麼辦？",
          answer: "兌換碼有使用期限，過期後無法使用。請關注官方直播和社群活動獲取新兌換碼，本頁面也會即時更新。",
        },
        {
          question: "異環前瞻直播兌換碼有哪些？",
          answer: "公測前瞻直播（4月18日）公布了國服3個和國際服3個兌換碼。國服碼有效期至5月7日，國際服碼有效期至5月29日。",
        },
      ]
    : isZh
      ? [
          {
            question: "异环兑换码在哪里输入？怎么用？",
            answer: "进入游戏后，点击右上角头像 → 设置 → 兑换码输入框，输入有效的兑换码即可领取奖励。建议开服后第一时间兑换，避免过期。",
          },
          {
            question: "异环国际服兑换码有哪些？",
            answer: "目前国际服有效兑换码包括 NTENOWTOENJOY、NTENANALLYGO、NTE0429 等，有效期至2026年5月。请以本页面最新信息为准。",
          },
          {
            question: "异环开服兑换码有哪些？公测码是多少？",
            answer: "异环公测兑换码分为国服和国际服两组。国服：YHNOWTOENJOY、YHNANALLYGO、YHOB0423（有效期至5月7日）。国际服：NTENOWTOENJOY、NTENANALLYGO、NTE0429（有效期至5月29日）。",
          },
          {
            question: "异环前瞻直播兑换码有哪些？",
            answer: "公测前瞻直播（4月18日）公布了国服3个和国际服3个兑换码。国服码有效期至5月7日，国际服码有效期至5月29日。后续直播活动可能发布更多兑换码。",
          },
        ]
      : [
          {
            question: "How to redeem codes in Neverness to Everness?",
            answer: "Launch the game, tap your profile icon (top-right) → Settings → enter the code in the Redeem Code field. Redeem immediately after launch to avoid expiration.",
          },
          {
            question: "What are the active NTE redeem codes for Global server?",
            answer: "Active Global codes include NTENOWTOENJOY, NTENANALLYGO, and NTE0429, valid through May 2026. Check this page for the latest updates.",
          },
          {
            question: "Do NTE redeem codes expire?",
            answer: "Yes, all redeem codes have expiration dates and some have usage limits. CN server codes expire May 7, 2026 and Global codes expire May 29, 2026. Redeem them as soon as possible.",
          },
          {
            question: "Where do I find new NTE redeem codes?",
            answer: "New codes are announced during official livestreams, social media events, and partner promotions. This page is updated in real-time with all available codes.",
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
