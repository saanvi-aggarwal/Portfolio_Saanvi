'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SKILLS } from '@/lib/data';
import { usePrefersReducedMotion } from '@/lib/hooks';

export function SkillMarquee() {
  const prefersReduced = usePrefersReducedMotion();
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const skillsText = SKILLS.map((s) => s.name.toUpperCase()).join('  ·  ') + '  ·  ';

  useEffect(() => {
    if (prefersReduced) return;

    let timeoutId: NodeJS.Timeout;
    const handleMouseMove = () => {
      setSpeedMultiplier(1.8);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSpeedMultiplier(1);
      }, 400);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden select-none pointer-events-none py-1 group opacity-[0.06]"
      aria-hidden="true"
    >
      <div
        className="flex whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee ${45 / speedMultiplier}s linear infinite`,
        }}
      >
        <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-[0.25em] text-[#0d0d0d] px-4">
          {skillsText}
        </span>
        <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-[0.25em] text-[#0d0d0d] px-4">
          {skillsText}
        </span>
      </div>
    </div>
  );
}
