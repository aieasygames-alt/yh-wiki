export function getPlaceholderImage(
  type: "character" | "material",
  name: string
): string {
  const colors = {
    character: { bg: "#1e293b", text: "#94a3b8" },
    material: { bg: "#1a1a2e", text: "#64748b" },
  };
  const { bg, text } = colors[type];
  const display = name.length > 4 ? name.substring(0, 4) : name;

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
      <rect fill="${bg}" width="128" height="128" rx="8"/>
      <text x="64" y="64" text-anchor="middle" dy=".3em" fill="${text}" font-size="14" font-family="system-ui">${display}</text>
    </svg>
  `)}`;
}
