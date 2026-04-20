"use client";

import { useState } from "react";
import type { Skills, Skill } from "../lib/queries";
import type { Locale } from "../lib/i18n";

interface SkillDetailProps {
  skills: Skills;
  locale: Locale;
}

function SkillCard({
  skill,
  label,
  icon,
  locale,
  defaultOpen,
}: {
  skill: Skill;
  label: string;
  icon: string;
  locale: Locale;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const name = locale === "en" ? skill.nameEn : skill.name;
  const description = locale === "en" ? skill.descriptionEn : skill.description;
  const scaling = locale === "en" ? skill.scalingEn : skill.scaling;

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/30 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-900/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {label}
            </span>
            <p className="text-sm font-medium">{name}</p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 space-y-3">
          <p className="text-sm text-gray-400 leading-relaxed">
            {description}
          </p>
          {scaling && (
            <div className="rounded-md bg-gray-800/50 px-4 py-2">
              <span className="text-xs text-gray-500 block mb-1">
                {locale === "en" ? "Scaling" : "倍率"}
              </span>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {scaling}
              </p>
            </div>
          )}
          <div className="flex gap-4 text-xs text-gray-500">
            {skill.cooldown && (
              <span>
                {locale === "en" ? "CD" : "冷却"}: {skill.cooldown}
              </span>
            )}
            {skill.cost && (
              <span>
                {locale === "en" ? "Cost" : "消耗"}: {skill.cost}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SkillDetail({ skills, locale }: SkillDetailProps) {
  const sections: {
    skill: Skill;
    label: string;
    icon: string;
  }[] = [
    {
      skill: skills.normalAttack,
      label: locale === "en" ? "Normal Attack" : "普通攻击",
      icon: "⚔",
    },
    {
      skill: skills.skill,
      label: locale === "en" ? "Skill" : "战技",
      icon: "✦",
    },
    {
      skill: skills.ultimate,
      label: locale === "en" ? "Ultimate" : "终结技",
      icon: "★",
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">
        {locale === "en" ? "Skills" : "技能详情"}
      </h2>
      <div className="space-y-2">
        {sections.map((s, i) => (
          <SkillCard
            key={i}
            skill={s.skill}
            label={s.label}
            icon={s.icon}
            locale={locale}
            defaultOpen={i === 0}
          />
        ))}
        {skills.passives && skills.passives.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
              {locale === "en" ? "Passives" : "被动技能"}
            </h3>
            <div className="space-y-2">
              {skills.passives.map((passive, i) => (
                <SkillCard
                  key={`passive-${i}`}
                  skill={passive}
                  label={
                    locale === "en"
                      ? `Passive ${i + 1}`
                      : `被动 ${i + 1}`
                  }
                  icon="◆"
                  locale={locale}
                  defaultOpen={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
