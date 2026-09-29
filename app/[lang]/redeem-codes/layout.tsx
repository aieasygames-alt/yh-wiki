import { t, Locale, hreflangAlternates } from "../../../lib/i18n";
import redeemCodesData from "../../../data/redeem-codes.json";

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
  const dataset = redeemCodesData as { reviewedAt: string; codes: Array<{ code: string; status: string }> };
  const activeCodes = dataset.codes.filter((code) => code.status === "active").map((code) => code.code).join(", ");

  const faqItems = isTw
    ? [
        {
          question: "異環兌換碼怎麼用？在哪裡輸入？",
          answer: "進入遊戲後，點擊右上角頭像 → 設定 → 兌換碼輸入框，輸入本頁標記為有效且來源明確的兌換碼。請以遊戲內領取結果為準。",
        },
        {
          question: "哪些異環兌換碼目前標記為有效？",
          answer: `本頁最後複核於 ${dataset.reviewedAt}。目前標記為有效的代碼：${activeCodes || "暫無"}。直播碼與待複核碼不會被當作可用碼。`,
        },
        {
          question: "異環直播碼還能用嗎？",
          answer: "直播碼通常時效很短。只有本頁標記為有效且有明確來源的碼才建議嘗試，並應以遊戲內結果為準。",
        },
        {
          question: "異環新兌換碼在哪裡獲取？",
          answer: "新兌換碼通常在官方公告、前瞻直播或合作活動中公布。本頁提供最後複核日期與狀態，但不承諾即時可用性。",
        },
      ]
    : isZh
      ? [
          {
            question: "异环兑换码在哪里输入？怎么用？",
            answer: "进入游戏后，点击右上角头像 → 设置 → 兑换码输入框，输入本页标记为有效且来源明确的兑换码。请以游戏内领取结果为准。",
          },
          {
            question: "哪些异环兑换码目前标记为有效？",
            answer: `本页最后复核于 ${dataset.reviewedAt}。目前标记为有效的代码：${activeCodes || "暂无"}。直播码与待复核码不会被当作可用码。`,
          },
          {
            question: "异环直播兑换码还能用吗？",
            answer: "直播码通常时效很短。只有本页标记为有效且有明确来源的码才建议尝试，并应以游戏内结果为准。",
          },
          {
            question: "异环新兑换码在哪里获取？",
            answer: "新兑换码通常在官方公告、前瞻直播或合作活动中公布。本页提供最后复核日期与状态，但不承诺实时可用性。",
          },
        ]
      : [
          {
            question: "How to redeem codes in Neverness to Everness?",
            answer: "Launch the game, tap your profile icon (top-right) → Settings → enter a source-backed code marked active on this page. Confirm the reward in-game.",
          },
          {
            question: "Which NTE redeem codes are currently marked active?",
            answer: `This page was last reviewed on ${dataset.reviewedAt}. Codes currently marked active: ${activeCodes || "none"}. Livestream and watchlist codes are not treated as usable.`,
          },
          {
            question: "Do NTE redeem codes expire?",
            answer: "Yes. Livestream codes often expire quickly. Treat a code as usable only when it is marked active with a clear source, then confirm the reward in-game.",
          },
          {
            question: "Where do I find new NTE redeem codes?",
            answer: "New codes are announced through official notices, livestreams, social events, and partner promotions. This page shows its review date and does not promise real-time availability.",
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
