"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pushDataLayer, getPageType } from "../lib/analytics";

export function GaRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const lang = pathname.split("/")[1] || "zh";
    const pageType = getPageType(pathname);

    pushDataLayer({
      event: "page_view",
      page_path: pathname,
      page_type: pageType,
      page_language: lang,
    });
  }, [pathname]);

  return null;
}
