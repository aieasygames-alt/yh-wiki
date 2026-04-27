"use client";

import { useState } from "react";
import { getPlaceholderImage } from "../lib/placeholder";

interface GameImageProps {
  type: "character" | "material" | "weapon" | "vehicle";
  id: string;
  name: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  src?: string;
}

export function GameImage({ type, id, name, className = "", alt, width, height, priority = false, src: srcProp, contain }: GameImageProps & { contain?: boolean }) {
  const [error, setError] = useState(false);
  // Use explicit src if provided, otherwise construct from type/id
  const src = srcProp ?? (type === "vehicle"
    ? `/images/vehicles/${id}.webp`
    : `/images/${type}s/${id}.webp`);
  const altText = alt ?? `${name} - ${type} in Neverness to Everness`;
  // Material images use contain by default; characters/weapons/vehicles use cover
  const useContain = contain ?? (type === "material");

  return (
    <div className={`overflow-hidden ${useContain ? "bg-gray-800/50" : ""} ${className}`}>
      <img
        src={error ? getPlaceholderImage(type, name) : src}
        alt={altText}
        width={width}
        height={height}
        className={`w-full h-full ${useContain ? "object-contain p-1" : "object-cover"}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        draggable={false}
        onError={() => setError(true)}
      />
    </div>
  );
}
