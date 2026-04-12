"use client";

import { useState } from "react";
import { getPlaceholderImage } from "../lib/placeholder";

interface GameImageProps {
  type: "character" | "material" | "weapon";
  id: string;
  name: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function GameImage({ type, id, name, className = "", alt, width, height, priority = false }: GameImageProps) {
  const [error, setError] = useState(false);
  const src = `/images/${type}s/${id}.webp`;
  const altText = alt ?? `${name} - ${type} in Neverness to Everness`;

  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={error ? getPlaceholderImage(type, name) : src}
        alt={altText}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        draggable={false}
        onError={() => setError(true)}
      />
    </div>
  );
}
