"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  type Googletag = {
    cmd: Array<() => void>;
    defineSlot?: (adUnitPath: string, sizes: unknown[], elementId: string) => {
      addService: (service: unknown) => unknown;
    } | null;
    pubads?: () => { enableSingleRequest?: () => void };
    enableServices?: () => void;
    display?: (elementId: string) => void;
  };

  interface Window {
    googletag?: Googletag;
  }
}

type Placement = "home-top" | "home-feed" | "detail-top" | "detail-bottom";

type AdConfig = {
  adUnitPath: string;
  elementId: string;
  sizes: unknown[];
};

const ADS: Record<Placement, AdConfig> = {
  "home-top": {
    adUnitPath: "/23394875894/same主广告/首页顶部",
    elementId: "div-gpt-ad-1794817010835-0",
    sizes: [[336, 280], [250, 250], [300, 250], "fluid"],
  },
  "home-feed": {
    adUnitPath: "/23394875894/same主广告/首流",
    elementId: "div-gpt-ad-1794817276087-0",
    sizes: ["fluid", [250, 250], [300, 250], [336, 280]],
  },
  "detail-top": {
    adUnitPath: "/23394875894/same主广告/详1",
    elementId: "div-gpt-ad-1794817358609-0",
    sizes: [[300, 250], "fluid", [250, 250], [336, 280]],
  },
  "detail-bottom": {
    adUnitPath: "/23394875894/same主广告/详2",
    elementId: "div-gpt-ad-1794817448378-0",
    sizes: [[300, 250], "fluid", [250, 250], [336, 280]],
  },
};

const DETAIL_PREFIXES = [
  "/characters/",
  "/guides/",
  "/blog/",
  "/weapons/",
  "/materials/",
  "/locations/",
  "/lore/",
  "/vehicles/",
  "/disk-sets/",
  "/faq/",
  "/anomalies/",
  "/quests/",
  "/changelog/",
  "/compare/",
  "/map/region/",
];

function isSameHost() {
  return typeof window !== "undefined" && window.location.hostname === "same.nteguide.com";
}

function isHomePath() {
  return /^\/(zh|tw|en)\/?$/.test(window.location.pathname);
}

function isDetailPath() {
  const [, lang, ...rest] = window.location.pathname.split("/");
  if (!lang || !["zh", "tw", "en"].includes(lang)) return false;
  const path = `/${rest.join("/")}`;
  return DETAIL_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function shouldRender(placement: Placement) {
  if (placement.startsWith("home-")) return isHomePath();
  return isDetailPath();
}

function loadGpt(onReady: () => void) {
  const googletag = window.googletag || { cmd: [] };
  window.googletag = googletag;
  googletag.cmd.push(onReady);

  if (document.querySelector('script[data-same-gpt="true"]')) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  script.crossOrigin = "anonymous";
  script.dataset.sameGpt = "true";
  document.head.appendChild(script);
}

export function SameAdPlacement({ placement }: { placement: Placement }) {
  const displayedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const config = ADS[placement];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isSameHost() || !shouldRender(placement)) return;

    const googletag = window.googletag || { cmd: [] };
    window.googletag = googletag;
    loadGpt(() => {
      const gpt = window.googletag;
      if (displayedRef.current || !gpt?.defineSlot || !gpt.pubads || !gpt.enableServices || !gpt.display) return;
      const pubads = gpt.pubads();
      pubads.enableSingleRequest?.();
      const slot = gpt
        .defineSlot(config.adUnitPath, config.sizes, config.elementId)
        ?.addService(pubads);
      if (!slot) return;
      gpt.enableServices();
      gpt.display(config.elementId);
      displayedRef.current = true;
    });
  }, [config.adUnitPath, config.elementId, config.sizes, mounted, placement]);

  if (!mounted || !isSameHost() || !shouldRender(placement)) return null;

  return (
    <div
      className="mx-auto my-6 flex min-h-[250px] w-full justify-center overflow-hidden"
      data-same-ad-placement={placement}
      data-ad-unit={config.adUnitPath}
    >
      <div id={config.elementId} style={{ minWidth: 250, minHeight: 250 }} />
    </div>
  );
}
