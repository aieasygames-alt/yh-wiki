import Link from "next/link";
import { t } from "../lib/i18n";

interface BlogCardProps {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  tags: string[];
  locale: "zh" | "en";
}

function getTagLabel(tag: string, locale: "zh" | "en"): string {
  if (locale === "zh") {
    const zhTag = t(locale, `blog.tags.${tag}`);
    return zhTag !== `blog.tags.${tag}` ? zhTag : tag;
  }
  return tag;
}

export function BlogCard({ id, title, summary, category, date, tags, locale }: BlogCardProps) {
  return (
    <Link
      href={`/${locale}/blog/${id}`}
      className="block rounded-lg border border-gray-800 bg-gray-900/30 p-5 hover:border-primary-500/50 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs px-2 py-0.5 rounded bg-primary-600/20 text-primary-400">
          {category}
        </span>
        <time className="text-xs text-gray-500" dateTime={date}>
          {date}
        </time>
      </div>
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-3 line-clamp-3">{summary}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400"
            >
              #{getTagLabel(tag, locale)}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
