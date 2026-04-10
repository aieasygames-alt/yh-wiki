"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, getPageType } from "../lib/analytics";

export function GaRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const lang = pathname.split("/")[1] || "zh";
    const pageType = getPageType(pathname);
    trackPageView(pathname, pageType, lang);
  }, [pathname]);

  return null;
}
