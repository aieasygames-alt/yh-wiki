"use client";

import { usePathname } from "next/navigation";
import { isZhLocale, type Locale } from "../lib/i18n";
import { trackContentEvent } from "../lib/analytics";

export function ContentFeedbackLink({ locale, contentId }: { locale: Locale; contentId: string }) {
  const pathname = usePathname();
  const isZh = isZhLocale(locale);
  const subject = isZh ? `NTE Guide 内容反馈：${contentId}` : `NTE Guide content feedback: ${contentId}`;
  const body = isZh
    ? `页面：https://nteguide.com${pathname}\n内容 ID：${contentId}\n\n问题或建议：\n\n正式服/官方来源链接：\n\n截图或复现步骤：`
    : `Page: https://nteguide.com${pathname}\nContent ID: ${contentId}\n\nIssue or suggestion:\n\nLive-game or official source URL:\n\nScreenshot or reproduction steps:`;
  const href = `mailto:contact@nteguide.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <a href={href} onClick={() => trackContentEvent("content_feedback", contentId)} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary-300">
      <span aria-hidden="true">?</span>
      {isZh ? (locale === "tw" ? "回報資料問題" : "反馈资料问题") : "Report content issue"}
    </a>
  );
}
