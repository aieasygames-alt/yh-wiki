/* eslint-disable @typescript-eslint/no-explicit-any */

const GA_ID = "G-KLVBV8S58R";

export interface TrackEventParams {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/** Call gtag() directly */
function gtag(...args: any[]) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function (...a: any[]) { window.dataLayer.push(a); };
    window.gtag(...args);
  }
}

/** Track page_view with custom dimensions */
export function trackPageView(path: string, pageType: string, language: string) {
  gtag("config", GA_ID, {
    page_path: path,
    send_page_view: true,
    page_type: pageType,
    page_language: language,
  });
}

/** Track a custom event */
export function trackEvent({
  event,
  category,
  label,
  value,
}: TrackEventParams) {
  gtag("event", event, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

/** Get page_type from pathname for GA custom dimension */
export function getPageType(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) return "home";
  const section = segments[1];
  switch (section) {
    case "characters":
      return segments[2] ? "character_detail" : "character_list";
    case "weapons":
      return segments[2] ? "weapon_detail" : "weapon_list";
    case "materials":
      return segments[2] ? "material_detail" : "material_list";
    case "guides":
      return segments[2] ? "guide_detail" : "guide_list";
    case "blog":
      return segments[2] ? "blog_detail" : "blog_list";
    case "calculator":
      return "tool_calculator";
    case "gacha":
      return "tool_gacha";
    case "redeem-codes":
      return "tool_redeem_codes";
    case "map":
      return "tool_map";
    case "lore":
      return segments[2] ? "lore_detail" : "lore_list";
    case "locations":
      return segments[2] ? "location_detail" : "location_list";
    case "faq":
      return segments[2] ? "faq_detail" : "faq_list";
    case "tags":
      return "tag";
    default:
      return "other";
  }
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
