import Link from "next/link";

const POPULAR_PAGES = {
  zh: [
    { href: "/zh/redeem-codes", label: "兑换码" },
    { href: "/zh/tier-list", label: "角色排行榜" },
    { href: "/zh/guides/download-install-guide", label: "下载安装指南" },
    { href: "/zh/faq", label: "常见问题" },
    { href: "/zh/characters", label: "角色图鉴" },
    { href: "/zh/guides/beginner-guide", label: "新手攻略" },
  ],
  tw: [
    { href: "/tw/redeem-codes", label: "兌換碼" },
    { href: "/tw/tier-list", label: "角色排行榜" },
    { href: "/tw/guides/download-install-guide", label: "下載安裝指南" },
    { href: "/tw/faq", label: "常見問題" },
    { href: "/tw/characters", label: "角色圖鑑" },
    { href: "/tw/guides/beginner-guide", label: "新手攻略" },
  ],
  en: [
    { href: "/en/redeem-codes", label: "Redeem Codes" },
    { href: "/en/tier-list", label: "Tier List" },
    { href: "/en/guides/download-install-guide", label: "Download Guide" },
    { href: "/en/faq", label: "FAQ" },
    { href: "/en/characters", label: "Characters" },
    { href: "/en/guides/beginner-guide", label: "Beginner Guide" },
  ],
};

const DEFAULT = [
  { href: "/en/redeem-codes", label: "Redeem Codes" },
  { href: "/en/faq", label: "FAQ" },
  { href: "/en/tier-list", label: "Tier List" },
  { href: "/en/characters", label: "Characters" },
  { href: "/en/guides/download-install-guide", label: "Download Guide" },
  { href: "/en/guides/beginner-guide", label: "Beginner Guide" },
];

export default async function NotFound({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const links = POPULAR_PAGES[lang as keyof typeof POPULAR_PAGES] || DEFAULT;
  const isZh = lang === "zh" || lang === "tw";
  const isTw = lang === "tw";

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-700 mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-2">
        {isTw ? "頁面未找到" : isZh ? "页面未找到" : "Page Not Found"}
      </p>
      <p className="text-sm text-gray-500 mb-10">
        {isTw
          ? "你可能輸入了錯誤的網址，或頁面已被移動。"
          : isZh
            ? "你可能输入了错误的网址，或页面已被移动。"
            : "The page you're looking for doesn't exist or has been moved."}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-10">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-xl border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm font-medium text-gray-300 hover:border-primary-500/40 hover:text-primary-400 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Link
        href={`/${lang}`}
        className="inline-block px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors"
      >
        {isTw ? "返回首頁" : isZh ? "返回首页" : "Back to Home"}
      </Link>
    </div>
  );
}
