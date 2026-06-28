"use client";

import { useState } from "react";

interface BlogImageProps {
  src: string;
  alt: string;
}

export function BlogImage({ src, alt }: BlogImageProps) {
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-gray-800 to-gray-900">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}
