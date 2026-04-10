interface WeaponSummaryProps {
  name: string;
  nameEn: string;
  type: string;
  typeLabel: string;
  description: string;
  descriptionEn: string;
  relatedCharacters: { name: string; nameEn: string }[];
  locale: "zh" | "en";
}

export function WeaponSummary({ name, nameEn, type, typeLabel, description, descriptionEn, relatedCharacters, locale }: WeaponSummaryProps) {
  const rows = [
    { key: locale === "zh" ? "名称" : "Name", val: locale === "zh" ? `${name} (${nameEn})` : `${nameEn} (${name})` },
    { key: locale === "zh" ? "类型" : "Type", val: typeLabel },
  ];

  if (relatedCharacters.length > 0) {
    const charNames = relatedCharacters.map(c => locale === "zh" ? c.name : c.nameEn).join(", ");
    rows.push({ key: locale === "zh" ? "适用角色" : "Best For", val: charNames });
  }

  return (
    <aside className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 mb-8" aria-label={locale === "zh" ? "武器摘要" : "Weapon Summary"}>
      <h2 className="text-lg font-bold mb-3">{locale === "zh" ? "武器概览" : "Quick Stats"}</h2>
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
