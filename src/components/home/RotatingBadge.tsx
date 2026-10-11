'use client';

import React, { useState } from 'react';
import { PROFILE } from '@/lib/data';
import { usePrefersReducedMotion } from '@/lib/hooks';

export function RotatingBadge() {
  const prefersReduced = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const badgeText = `${PROFILE.name.toUpperCase()} · CSE (AI) · CHANDIGARH, INDIA · `;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hidden xl:flex absolute bottom-12 right-12 z-20 items-center justify-center cursor-pointer select-none transition-transform duration-500 hover:scale-105"
      aria-label={`${PROFILE.name} badge`}
    >
      <div
        className="relative w-[110px] h-[110px] flex items-center justify-center"
        style={{
          animation: prefersReduced
            ? 'none'
            : `spin 22s linear infinite ${isHovered ? 'reverse' : 'normal'}`,
        }}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full overflow-visible"
        >
          <path
            id="badgeCirclePath"
            d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
            fill="none"
          />
          <text className="font-mono text-[9px] uppercase tracking-[0.24em] fill-[#77756f]">
            <textPath href="#badgeCirclePath" startOffset="0%">
              {badgeText}
            </textPath>
          </text>
        </svg>

        {/* Center Minimal Monogram */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-sans font-bold text-xs tracking-tight text-[#0d0d0d]">
            {PROFILE.initials}
          </span>
        </div>
      </div>
    </div>
  );
}
