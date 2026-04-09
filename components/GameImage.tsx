"use client";

import { useState } from "react";
import { getPlaceholderImage } from "../lib/placeholder";

interface GameImageProps {
  type: "character" | "material";
  id: string;
  name: string;
  className?: string;
  alt?: string;
}

export function GameImage({ type, id, name, className = "", alt }: GameImageProps) {
  const [error, setError] = useState(false);
  const src = `/images/${type}s/${id}.webp`;

  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={error ? getPlaceholderImage(type, name) : src}
        alt={alt ?? name}
        className="w-full h-full object-cover"
        loading="lazy"
        draggable={false}
        onError={() => setError(true)}
      />
    </div>
  );
}
