import type { Locale } from "../lib/i18n";

interface WeaponSummaryProps {
  name: string;
  nameEn: string;
  type: string;
  typeLabel: string;
  description: string;
  descriptionEn: string;
  relatedCharacters: { name: string; nameEn: string }[];
  locale: Locale;
}

export function WeaponSummary({ name, nameEn, type, typeLabel, description, descriptionEn, relatedCharacters, locale }: WeaponSummaryProps) {
  const rows = [
    { key: locale === "en" ? "Name" : "名称", val: locale === "en" ? `${nameEn} (${name})` : `${name} (${nameEn})` },
    { key: locale === "en" ? "Type" : "类型", val: typeLabel },
  ];

  if (relatedCharacters.length > 0) {
    const charNames = relatedCharacters.map(c => locale === "en" ? c.nameEn : c.name).join(", ");
    rows.push({ key: locale === "en" ? "Best For" : "适用角色", val: charNames });
  }

  return (
    <aside className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 mb-8" aria-label={locale === "en" ? "Weapon Summary" : "武器摘要"}>
      <h2 className="text-lg font-bold mb-3">{locale === "en" ? "Quick Stats" : "武器概览"}</h2>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-gray-800/50 last:border-0">
              <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">{row.key}</td>
              <td className="py-2 text-gray-300">{row.val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
}
