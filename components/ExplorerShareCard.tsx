"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { Locale } from "../lib/i18n";
import { t, isZhLocale } from "../lib/i18n";

interface ExplorerShareCardProps {
  open: boolean;
  onClose: () => void;
  nickname: string;
  onNicknameChange: (v: string) => void;
  playerId: string;
  onPlayerIdChange: (v: string) => void;
  collectedCount: number;
  totalCount: number;
  percent: number;
  regionName: string;
  lang: Locale;
}

export default function ExplorerShareCard({
  open,
  onClose,
  nickname,
  onNicknameChange,
  playerId,
  onPlayerIdChange,
  collectedCount,
  totalCount,
  percent,
  regionName,
  lang,
}: ExplorerShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const isZh = isZhLocale(lang);
  const today = new Date().toLocaleDateString(isZh ? "zh-CN" : "en-US");

  if (!open) return null;

  const generateImage = async (): Promise<Blob> => {
    if (!cardRef.current) throw new Error("Card not found");
    const dataUrl = await toPng(cardRef.current, {
      width: 1200,
      height: 630,
      pixelRatio: 2,
    });
    const res = await fetch(dataUrl);
    return await res.blob();
  };

  const handleCopy = async () => {
    setCopying(true);
    try {
      const blob = await generateImage();
      if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "nte-explorer.png";
        a.click();
        URL.revokeObjectURL(url);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setCopying(false);
    }
  };

  const handleShareTwitter = async () => {
    const text = isZh
      ? `我在异环探索伴侣中已收集 ${collectedCount}/${totalCount} 个标点 (${percent}%)！快来试试吧`
      : `I've collected ${collectedCount}/${totalCount} markers (${percent}%) using NTE Exploration Companion!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent("https://nteguide.com")}`;
    window.open(url, "_blank");
  };

  const handleShareReddit = async () => {
    const title = isZh
      ? `异环探索进度: ${percent}% (${regionName})`
      : `NTE Exploration Progress: ${percent}% (${regionName})`;
    const url = `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent("https://nteguide.com")}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {t(lang, "explorer.shareProgress")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              {t(lang, "explorer.nickname")}
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => onNicknameChange(e.target.value)}
              placeholder={isZh ? "输入昵称" : "Enter nickname"}
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              {t(lang, "explorer.playerId")}
            </label>
            <input
              type="text"
              value={playerId}
              onChange={(e) => onPlayerIdChange(e.target.value)}
              placeholder={isZh ? "输入玩家ID" : "Enter Player ID"}
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="flex justify-center">
          <div className="w-full max-w-[340px] rounded-lg overflow-hidden border border-gray-700">
            {/* Card preview — scaled down version of the share card */}
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "1200/630" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 flex flex-col items-center justify-center text-center p-4">
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

                {/* Brand */}
                <div className="flex items-center gap-2 mb-2">
                  <img src="/logo-80.png" alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-xs font-bold text-primary-400">NTE Guide</span>
                </div>

                {/* Player info */}
                <p className="text-sm font-bold text-white truncate max-w-full">
                  {nickname || (isZh ? "探索者" : "Explorer")}
                </p>
                {playerId && (
                  <p className="text-[10px] text-gray-500 mt-0.5">ID: {playerId}</p>
                )}

                {/* Stats */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-xs text-primary-400 font-bold">
                    {collectedCount}/{totalCount}
                  </div>
                  <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="text-xs text-white font-bold">{percent}%</div>
                </div>

                {/* Footer */}
                <p className="text-[9px] text-gray-600 mt-1">
                  {regionName} · {today}
                </p>
                <p className="text-[8px] text-gray-700">nteguide.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={copying}
            className="flex-1 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition-colors"
          >
            {copied ? t(lang, "explorer.imageCopied") : t(lang, "explorer.copyImage")}
          </button>
          <button
            onClick={handleShareTwitter}
            className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 text-sm border border-gray-700 hover:border-gray-600 transition-colors"
          >
            𝕏
          </button>
          <button
            onClick={handleShareReddit}
            className="px-4 py-2.5 rounded-lg bg-gray-800 text-orange-500 text-sm border border-gray-700 hover:border-gray-600 transition-colors"
          >
            Reddit
          </button>
        </div>
      </div>

      {/* Hidden full-size card for image generation */}
      <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
        <div
          ref={cardRef}
          className="relative overflow-hidden"
          style={{ width: 1200, height: 630, fontFamily: "system-ui, sans-serif" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 flex flex-col items-center justify-center text-center p-12">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

            {/* Brand */}
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo-192.png" alt="" className="w-14 h-14 rounded-full" />
              <span className="text-2xl font-bold text-primary-400">NTE Guide</span>
            </div>

            {/* Player info */}
            <p className="text-4xl font-bold text-white mb-1">
              {nickname || (isZh ? "探索者" : "Explorer")}
            </p>
            {playerId && (
              <p className="text-lg text-gray-400">ID: {playerId}</p>
            )}

            {/* Stats */}
            <div className="mt-8 flex items-center gap-4">
              <div className="text-3xl text-primary-400 font-bold">
                {collectedCount}/{totalCount}
              </div>
              <div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
              </div>
              <div className="text-3xl text-white font-bold">{percent}%</div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-sm text-gray-500">
              {regionName} · {today}
            </div>
            <div className="text-xs text-gray-700 mt-1">nteguide.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
