import Link from "next/link";
import { GameImage } from "./GameImage";
import { type Locale, isZhLocale } from "../lib/i18n";
import { getCharacter } from "../lib/queries";

interface RotationStep {
  character: string;
  action: string;
  actionEn: string;
  trigger?: string;
  triggerEn?: string;
}

interface RotationGuideProps {
  steps: RotationStep[];
  tips?: string;
  tipsEn?: string;
  locale: Locale;
  lang: string;
}

function charName(c: { name: string; nameTw?: string; nameEn: string }, locale: string): string {
  if (locale === "en") return c.nameEn;
  if (locale === "tw") return c.nameTw || c.name;
  return c.name;
}

export function RotationGuide({ steps, tips, tipsEn, locale, lang }: RotationGuideProps) {
  const zh = isZhLocale(locale);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">
        {zh ? "推荐输出循环" : "Recommended Rotation"}
      </h2>

      {/* Steps */}
      <div className="relative overflow-x-auto pb-4">
        <div className="flex gap-2 min-w-max">
          {steps.map((step, idx) => {
            const char = getCharacter(step.character);
            return (
              <div key={idx} className="flex items-center gap-2">
                {/* Step Card */}
                <div className="flex flex-col items-center gap-1.5 rounded-lg border border-gray-800 bg-gray-900/40 p-3 min-w-[100px]">
                  {char && (
                    <div className="flex items-center gap-1.5">
                      {char.image && (
                        <GameImage
                          src={char.image}
                          alt={charName(char, locale)}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                      )}
                      <Link
                        href={`/${lang}/characters/${char.id}`}
                        className="text-xs font-medium hover:text-primary-400 transition-colors"
                      >
                        {charName(char, locale)}
                      </Link>
                    </div>
                  )}
                  <span className="text-xs text-center text-gray-300">
                    {zh ? step.action : step.actionEn}
                  </span>
                  {step.trigger && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-600/20 text-primary-400 font-medium">
                      {zh ? step.trigger : step.triggerEn}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-600">#{idx + 1}</span>
                </div>

                {/* Arrow */}
                {idx < steps.length - 1 && (
                  <span className="text-gray-600 text-lg">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      {(zh ? tips : tipsEn) && (
        <div className="mt-4 rounded-lg bg-gray-900/30 border border-gray-800 p-3">
          <p className="text-xs text-gray-400">
            <span className="font-medium text-gray-300">
              {zh ? "循环要点：" : "Key points: "}
            </span>
            {zh ? tips : tipsEn}
          </p>
        </div>
      )}
    </section>
  );
}
