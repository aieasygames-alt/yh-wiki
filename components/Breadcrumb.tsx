import Link from "next/link";
import { BreadcrumbJsonLd } from "./JsonLd";

const BASE_URL = "https://nteguide.com";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={items.map((item) => ({
          name: item.label,
          url: item.href ? `${BASE_URL}${item.href}` : undefined,
        }))}
      />
      <nav className="max-w-4xl mx-auto px-4 pt-6">
        <ol className="flex items-center gap-1.5 text-sm text-gray-500">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-gray-700">/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-primary-400 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-400">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
