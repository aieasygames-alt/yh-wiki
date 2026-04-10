"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  questionZh: string;
  answer: string;
  answerZh: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
  locale: "zh" | "en";
}

export function FaqSection({ faqs, locale }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">
        {locale === "zh" ? "常见问题" : "FAQ"}
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => {
          const question = locale === "zh" ? faq.questionZh : faq.question;
          const answer = locale === "zh" ? faq.answerZh : faq.answer;
          const isOpen = openIndex === i;
          return (
            <div key={i} className="rounded-lg border border-gray-800 bg-gray-900/30 overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-900/50 transition-colors"
              >
                <span className="text-sm font-medium pr-4">{question}</span>
                <svg
                  className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-400 leading-relaxed">{answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
