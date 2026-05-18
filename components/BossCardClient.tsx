"use client";

import { useState } from "react";
import Link from "next/link";
import { GameImage } from "./GameImage";
import { getAllCharacters } from "../lib/queries";
import buildsData from "../data/builds.json";

interface BuildEntry {
  characterId: string;
  builds: {
    id: string;
    name: string;
    nameEn: string;
    teamComp: string[];
  }[];
}

const builds = buildsData as BuildEntry[];

const TYPE_COLORS: Record<string, string> = {
  boss: "bg-red-500/20 text-red-400 border-red-500/30",
  elite: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const DIFFICULTY_STARS: Record<string, number> = {
  "headless-iron-rider": 3,
  "black-book": 4,
  "morpheus": 5,
  "sea-prisoner": 4,
};

export function BossCardClient({
  id,
  name,
  type,
  attribute,
  hp,
  weakness,
  location,
  strategy,
  drops,
  mechanics,
  lang,
  isZh,
}: {
  id: string;
  name: string;
  type: string;
  attribute?: string;
  hp?: string;
  weakness?: string;
  location?: string;
  strategy?: string;
  drops?: string[];
  mechanics?: string;
  lang: string;
  isZh: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  // Find recommended teams from builds where this boss is mentioned or by matching attribute
  const allCharacters = getAllCharacters();
  const recommendedTeams = builds
    .filter((b) => b.builds.length > 0 && b.builds[0].teamComp.length > 0)
    .slice(0, 4)
    .map((b) => ({
      characterId: b.characterId,
      teamIds: [b.characterId, ...b.builds[0].teamComp].slice(0, 3),
    }));

  const difficulty = DIFFICULTY_STARS[id];

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 transition-colors">
      <div
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 mb-3">
          <h4 className="font-semibold text-sm flex-1">{name}</h4>
          {difficulty && (
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < difficulty ? "text-yellow-400" : "text-gray-700"}`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
                </svg>
              ))}
            </span>
          )}
          <span className={`text-[10px] px-2 py-0.5 rounded border ${TYPE_COLORS[type] || ""}`}>
            {type === "boss" ? "Boss" : type === "elite" ? "Elite" : "Normal"}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div className="space-y-2 text-xs">
          {attribute && (
            <div className="flex gap-2">
              <span className="text-gray-500 w-12 shrink-0">{isZh ? "属性" : "Attr"}</span>
              <span className="text-gray-300">{attribute}</span>
            </div>
          )}
          {hp && (
            <div className="flex gap-2">
              <span className="text-gray-500 w-12 shrink-0">HP</span>
              <span className="text-gray-300">{hp}</span>
            </div>
          )}
          {weakness && (
            <div className="flex gap-2">
              <span className="text-gray-500 w-12 shrink-0">{isZh ? "弱点" : "Weak"}</span>
              <span className="text-yellow-400 line-clamp-1">{weakness}</span>
            </div>
          )}
          {strategy && !expanded && (
            <p className="text-gray-400 line-clamp-2 mt-2">{strategy}</p>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-800/50 space-y-4">
          {location && (
            <div className="text-xs">
              <span className="text-gray-500">{isZh ? "位置" : "Location"}: </span>
              <span className="text-gray-300">{location}</span>
            </div>
          )}
          {mechanics && (
            <div className="text-xs">
              <span className="text-gray-500 font-medium block mb-1">{isZh ? "机制" : "Mechanics"}</span>
              <p className="text-gray-300 leading-relaxed">{mechanics}</p>
            </div>
          )}
          {strategy && (
            <div className="text-xs">
              <span className="text-gray-500 font-medium block mb-1">{isZh ? "策略" : "Strategy"}</span>
              <p className="text-gray-300 leading-relaxed">{strategy}</p>
            </div>
          )}
          {drops && drops.length > 0 && (
            <div>
              <span className="text-xs text-gray-500 block mb-1">{isZh ? "掉落" : "Drops"}</span>
              <div className="flex flex-wrap gap-1">
                {drops.map((d, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Teams */}
          <div>
            <span className="text-xs text-gray-500 block mb-2">{isZh ? "推荐队伍" : "Recommended Teams"}</span>
            <div className="space-y-2">
              {recommendedTeams.slice(0, 3).map((team) => (
                <div key={team.characterId} className="flex items-center gap-2">
                  {team.teamIds.map((cid) => {
                    const char = allCharacters.find((c) => c.id === cid);
                    if (!char) return null;
                    return (
                      <Link
                        key={cid}
                        href={`/${lang}/characters/${cid}`}
                        className="flex flex-col items-center gap-0.5 group/char"
                      >
                        <GameImage
                          type="character"
                          id={char.id}
                          name={char.name}
                          className="w-8 h-8 rounded-md group-hover/char:ring-1 group-hover/char:ring-primary-500/50 transition-all"
                        />
                        <span className="text-[9px] text-gray-500 group-hover/char:text-gray-300 truncate max-w-[48px]">
                          {isZh ? char.name : char.nameEn}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <Link
            href={`/${lang}/anomalies/${id}`}
            className="text-xs text-primary-400 hover:text-primary-300 inline-block"
          >
            {isZh ? "查看完整详情 →" : "View Full Details →"}
          </Link>
        </div>
      )}
    </div>
  );
}
