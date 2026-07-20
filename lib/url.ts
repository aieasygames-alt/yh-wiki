const INTERNAL_PATH_RE = /^\/(?!\/)/;

function isFileLikePath(pathname: string): boolean {
  const lastSegment = pathname.split("/").pop() || "";
  return /\.[a-zA-Z0-9]{2,8}$/.test(lastSegment);
}

export function canonicalPath(href: string): string {
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
