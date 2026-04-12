"use client";

import { useState } from "react";

interface ShareBuildButtonProps {
  className?: string;
}

export function ShareBuildButton({ className = "" }: ShareBuildButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out my NTE build!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "NTE Build", text, url });
        return;
      } catch {
        // User cancelled or not supported, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 bg-gray-900/50 text-sm text-gray-300 hover:border-primary-500 hover:text-primary-400 transition-colors ${className}`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {copied ? "Copied!" : "Share Build"}
    </button>
  );
}
