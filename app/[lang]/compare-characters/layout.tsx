import { hreflangAlternates, Locale, isZhLocale } from "../../../lib/i18n";
import { localizedText } from "../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环角色对比 — 属性技能Build横向比较", "NTE Character Compare — Side-by-Side Stats & Builds");
  const description = localizedText(locale, "横向对比异环角色属性、技能、推荐Build和队伍搭配，最多同时对比3个角色。", "Compare NTE characters side by side: stats, skills, builds, and team comps. Up to 3 characters at once.");
  return {
    title,
    description,
    alternates: hreflangAlternates("compare-characters", lang),
    openGraph: { title, description, type: "website" },
  };
}

export default function CompareCharactersLayout({
  params,
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {
  const locale = params.lang as Locale;
  const isZh = isZhLocale(locale);
  const introTitle = isZh
    ? (locale === "tw" ? "角色對比頁最適合什麼時候用？" : "角色对比页最适合什么时候用？")
    : "When should you use character compare?";
  const introBody = isZh
    ? (locale === "tw"
        ? "如果你常卡在「這兩個角色到底誰更適合現在的帳號」，角色對比頁的價值就在於把屬性、定位、技能和常見 Build 放到同一個視角看。它最適合處理抽卡前後的抉擇，而不是只看單張強度榜截圖。"
        : "如果你常卡在“这两个角色到底谁更适合当前账号”，角色对比页的价值就在于把属性、定位、技能和常见 Build 放到同一个视角看。它最适合处理抽卡前后的抉择，而不是只看单张强度榜截图。")
    : "If you often get stuck on which of two characters actually fits your current account better, character compare is useful because it puts role, attribute, skill profile, and common build direction into one view. It is strongest for pre-pull and post-pull decisions, not just for reading a tier screenshot.";
  const notesTitle = isZh
    ? (locale === "tw" ? "對比時先看這幾點" : "对比时先看这几点")
    : "Compare with these in mind";
  const notes = isZh
    ? [
        locale === "tw"
          ? "先確認你是在比主 C、輔助還是生存位，不同定位不能只憑單卡熱度硬比。"
          : "先确认你是在比主 C、辅助还是生存位，不同定位不能只凭单卡热度硬比。",
        locale === "tw"
          ? "把配隊需求一起看進去，很多角色的價值差異其實出在隊友門檻。"
          : "把配队需求一起看进去，很多角色的价值差异其实出在队友门槛。",
        locale === "tw"
          ? "如果你是零氪或微氪，對比結果還要搭配版本資源和保底壓力一起判斷。"
          : "如果你是零氪或微氪，对比结果还要搭配版本资源和保底压力一起判断。",
      ]
    : [
        "Decide whether you are comparing carries, supports, or sustain units first. Different roles should not be judged by hype alone.",
        "Look at team requirements together with raw kits, because many value gaps come from teammate dependency.",
        "If you are F2P or low-spend, fold banner budget and pity pressure into the comparison instead of treating it as pure power ranking.",
      ];

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-6 pb-3 text-sm text-gray-300">
        <h2 className="text-xl font-semibold text-white">{introTitle}</h2>
        <p className="mt-3 leading-7">{introBody}</p>
      </section>
      {children}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">{notesTitle}</h2>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-gray-300">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
