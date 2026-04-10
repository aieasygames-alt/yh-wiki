interface CharacterSummaryProps {
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  attribute: string;
  rank: string;
  weapon?: string;
  weaponEn?: string;
  faction?: string;
  description?: string;
  descriptionEn?: string;
  locale: "zh" | "en";
}

export function CharacterSummary({ name, nameEn, role, roleEn, attribute, rank, weapon, weaponEn, faction, description, descriptionEn, locale }: CharacterSummaryProps) {
  const rows = [
    { key: locale === "zh" ? "名称" : "Name", val: locale === "zh" ? `${name} (${nameEn})` : `${nameEn} (${name})` },
    { key: locale === "zh" ? "定位" : "Role", val: locale === "zh" ? role : roleEn },
    { key: locale === "zh" ? "属性" : "Element", val: attribute },
    { key: locale === "zh" ? "稀有度" : "Rarity", val: `${rank}-Rank` },
    ...(weapon && weapon !== "TBD" ? [{ key: locale === "zh" ? "武器类型" : "Weapon Type", val: locale === "zh" ? weapon : weaponEn }] : []),
    ...(faction ? [{ key: locale === "zh" ? "阵营" : "Faction", val: faction }] : []),
  ];

  return (
    <aside className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 mb-8" aria-label={locale === "zh" ? "角色摘要" : "Character Summary"}>
      <h2 className="text-lg font-bold mb-3">{locale === "zh" ? "角色概览" : "Quick Stats"}</h2>
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
