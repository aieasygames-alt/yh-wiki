const INTERNAL_PATH_RE = /^\/(?!\/)/;
const REDIRECT_TARGETS: Record<string, string> = {
  "/faq/android-minimum-specs": "/system-requirements/",
  "/faq/download-installation": "/guides/download-install-guide/",
  "/faq/download-size": "/system-requirements/",
  "/faq/ios-minimum-specs": "/system-requirements/",
  "/faq/nte-download-size-storage": "/system-requirements/",
  "/faq/ssd-requirement": "/system-requirements/",
  "/faq/system-requirements": "/system-requirements/",
  "/faq/weapon-upgrade-faq": "/faq/weapon-upgrade/",
  "/faq/romance-system-explained": "/faq/romance-system-guide/",
  "/blog/nte-system-requirements-can-you-run-it": "/system-requirements/",
  "/characters/the-appraiser": "/characters/zero/",
};

function isFileLikePath(pathname: string): boolean {
  const lastSegment = pathname.split("/").pop() || "";
  return /\.[a-zA-Z0-9]{2,8}$/.test(lastSegment);
}

export function resolveRedirectedPath(href: string): string {
  if (!INTERNAL_PATH_RE.test(href)) return href;

  const match = href.match(/^([^?#]*)([?#].*)?$/);
  if (!match) return href;

  const pathname = match[1].replace(/\/+$/, "") || "/";
  const suffix = match[2] || "";
  const localeMatch = pathname.match(/^\/(zh|tw|en)(\/.*)$/);
  const locale = localeMatch?.[1];
  const unlocalizedPath = localeMatch?.[2] || pathname;
  const target = REDIRECT_TARGETS[unlocalizedPath];

  if (!target) return href;
  const resolved = locale ? `/${locale}${target}` : target;
  return `${resolved}${suffix}`;
}

export function canonicalPath(href: string): string {
  href = resolveRedirectedPath(href);
  if (!INTERNAL_PATH_RE.test(href)) return href;
  if (href === "/" || href.startsWith("/_next/") || href.startsWith("/api/")) return href;

  const match = href.match(/^([^?#]*)([?#].*)?$/);
  if (!match) return href;

  const pathname = match[1];
  const suffix = match[2] || "";
  if (!pathname || pathname === "/" || pathname.endsWith("/") || isFileLikePath(pathname)) {
    return href;
  }

  return `${pathname}/${suffix}`;
}

export function localizedPath(locale: string, path: string = ""): string {
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  return canonicalPath(cleanPath ? `/${locale}/${cleanPath}` : `/${locale}`);
}
