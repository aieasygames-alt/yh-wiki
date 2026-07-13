import { Locale } from "../../../lib/i18n";
import { getAllWeapons, getAllDiskSets } from "../../../lib/queries";
import { EffectsClient } from "./EffectsClient";

export default async function EffectsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  return (
    <EffectsClient
      lang={lang as Locale}
      weapons={getAllWeapons()}
      diskSets={getAllDiskSets()}
    />
  );
}
