"use client";

import { useState, useMemo } from "react";
import { CharacterCard } from "./CharacterCard";
import { getAttributeLabel } from "../lib/attributes";
import { t, type Locale } from "../lib/i18n";

const ATTRIBUTES = ["cosmos", "anima", "incantation", "chaos", "psyche", "lakshana"];
const RANKS = ["S", "A"];
const ROLE_KEYS = ["attack", "support", "defense", "assist"];
const STATUSES = ["available", "upcoming", "rumored"];

interface CharacterFilterProps {
  characters: { id: string; name: string; nameTw?: string; nameEn: string; attribute: string; rank: string; status?: string; image?: string; role: string; roleEn: string }[];
  locale: Locale;
  lang: string;
}

export function CharacterFilter({ characters, locale }: CharacterFilterProps) {
  const [attribute, setAttribute] = useState<string>("");
  const [rank, setRank] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [status, setStatus] = useState<string>("available");

  const roles = ROLE_KEYS.map((key) => t(locale, `roles.${key}`));


  const filtered = useMemo(() => {
    return characters.filter((c) => {
      if (status && c.status !== status) return false;
      if (attribute && c.attribute !== attribute) return false;
      if (rank && c.rank !== rank) return false;
      if (role) {
        const cRole = locale === "zh" ? c.role : c.roleEn;
        if (cRole !== role) return false;
      }
      return true;
    });
  }, [characters, status, attribute, rank, role, locale]);

  const hasFilters = attribute || rank || role || status !== "available";

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="available">{t(locale, "status.available")}</option>
          {STATUSES.filter(s => s !== "available").map((s) => (
            <option key={s} value={s}>{t(locale, `status.${s}`)}</option>
          ))}
          <option value="">{t(locale, "common.all")}</option>
        </select>

        {/* Attribute Filter */}
        <select
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="">{t(locale, "filter.allAttributes")}</option>
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
          <option value="">{t(locale, "filter.allRanks")}</option>
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
          <option value="">{t(locale, "filter.allRoles")}</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => { setStatus("available"); setAttribute(""); setRank(""); setRole(""); }}
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            {t(locale, "common.clear")}
          </button>
        )}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} {t(locale, "filter.charactersCount")}
      </p>

      {/* Character Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((c) => (
          <CharacterCard
            key={c.id}
            id={c.id}
            name={c.name}
            nameTw={c.nameTw}
            nameEn={c.nameEn}
            attribute={c.attribute}
            rank={c.rank}
            status={c.status}
            image={c.image}
            locale={locale}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {t(locale, "filter.noMatching")}
        </div>
      )}
    </>
  );
}
