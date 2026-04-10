/* eslint-disable @typescript-eslint/no-explicit-any */

const GTM_ID = "GTM-N2TCS4RN";

export interface TrackEventParams {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export function pushDataLayer(params: TrackEventParams) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(params);
  }
}

/** Track a custom event via GTM dataLayer */
export function trackEvent({
  event,
  category,
  label,
  value,
  ...rest
}: TrackEventParams) {
  pushDataLayer({
    event,
    event_category: category,
    event_label: label,
    event_value: value,
    ...rest,
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
    dataLayer: Record<string, unknown>[];
  }
}
