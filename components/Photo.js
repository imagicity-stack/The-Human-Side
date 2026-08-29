"use client";

import { useState } from "react";

/* A brand-coloured stand-in used when a photo hasn't been dropped in yet.
   Purely graphical, so `object-fit: cover` can crop it without cutting text. */
const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F3ECFA"/>
      <stop offset="0.55" stop-color="#E4D8F1"/>
      <stop offset="1" stop-color="#D8E1EB"/>
    </linearGradient>
    <pattern id="h" width="24" height="24" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="24" stroke="#7B3FA0" stroke-opacity="0.09" stroke-width="1.5"/>
    </pattern>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <rect width="1200" height="900" fill="url(#h)"/>
  <circle cx="600" cy="450" r="168" fill="none" stroke="#7B3FA0" stroke-opacity="0.16" stroke-width="2"/>
  <path d="M600 566c-74-49-124-97-124-154a59 59 0 0 1 124-40 59 59 0 0 1 124 40c0 57-50 105-124 154z" fill="#7B3FA0" fill-opacity="0.13"/>
</svg>`;

const FALLBACK = `data:image/svg+xml,${encodeURIComponent(FALLBACK_SVG).replace(/'/g, "%27")}`;

export default function Photo({ src, alt = "", loading = "lazy", ...rest }) {
  const [broken, setBroken] = useState(false);
  return (
    <img
      {...rest}
      src={broken ? FALLBACK : src}
      alt={alt}
      loading={loading}
      decoding="async"
      data-placeholder={broken ? "true" : undefined}
      onError={() => setBroken(true)}
    />
  );
}
