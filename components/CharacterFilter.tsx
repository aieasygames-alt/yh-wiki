"use client";

import { useState, useMemo } from "react";
import { CharacterCard } from "./CharacterCard";
import { getAttributeLabel } from "../lib/attributes";
import type { Character, Locale } from "../lib/i18n";

const ATTRIBUTES = ["cosmos", "anima", "incantation", "chaos", "psyche", "lakshana"];
const RANKS = ["S", "A"];
const ROLES_ZH = ["进攻", "支援", "防护", "辅助"];
const ROLES_EN = ["Attack", "Support", "Defense", "Utility"];

interface CharacterFilterProps {
  characters: Character[];
  locale: Locale;
  lang: string;
}

export function CharacterFilter({ characters, locale, lang }: CharacterFilterProps) {
  const [attribute, setAttribute] = useState<string>("");
  const [rank, setRank] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const roles = locale === "zh" ? ROLES_ZH : ROLES_EN;

  const filtered = useMemo(() => {
    return characters.filter((c) => {
      if (attribute && c.attribute !== attribute) return false;
      if (rank && c.rank !== rank) return false;
      if (role) {
        const cRole = locale === "zh" ? c.role : c.roleEn;
        if (cRole !== role) return false;
      }
      return true;
    });
  }, [characters, attribute, rank, role, locale]);

  const hasFilters = attribute || rank || role;

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Attribute Filter */}
        <select
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="">{locale === "zh" ? "全部属性" : "All Attributes"}</option>
          {ATTRIBUTES.map((attr) => (
            <option key={attr} value={attr}>{getAttributeLabel(attr, locale)}</option>
          ))}
        </select>

        {/* Rank Filter */}
        <select
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="">{locale === "zh" ? "全部等级" : "All Ranks"}</option>
          {RANKS.map((r) => (
            <option key={r} value={r}>{r}-rank</option>
          ))}
        </select>

        {/* Role Filter */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="">{locale === "zh" ? "全部定位" : "All Roles"}</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => { setAttribute(""); setRank(""); setRole(""); }}
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            {locale === "zh" ? "清除" : "Clear"}
          </button>
        )}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} {locale === "zh" ? "个角色" : "characters"}
      </p>

      {/* Character Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((c) => (
          <CharacterCard
            key={c.id}
            id={c.id}
            name={c.name}
            nameEn={c.nameEn}
            attribute={c.attribute}
            rank={c.rank}
            locale={locale}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {locale === "zh" ? "没有匹配的角色" : "No matching characters"}
        </div>
      )}
    </>
  );
}
