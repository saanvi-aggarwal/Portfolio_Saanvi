'use client';

import React from 'react';
import { TechLogo } from '@/components/ui/TechLogo';

interface MetricPlaceholderProps {
  platform: string;
  logoKey: string;
  brandColor: string;
  label: string;
  metric?: string;
  numericTarget?: number;
  suffix?: string;
  isActive: boolean;
  prefersReduced: boolean;
}

export function MetricPlaceholder({
  platform,
  logoKey,
  brandColor,
  label,
  metric,
  numericTarget,
  suffix,
  isActive,
  prefersReduced,
}: MetricPlaceholderProps) {
  // Derive primary metric or stage milestone text
  let primaryValue = '';
  let subLabel = '';

  if (metric) {
    primaryValue = metric + (suffix ? ` ${suffix}` : '');
    subLabel = 'Verified Standing';
  } else if (numericTarget !== undefined) {
    primaryValue = `${numericTarget}${suffix || ''}`;
    subLabel = 'Verified Metric';
  } else {
    // Elegant milestone typography for competitive rounds without raw numeric scores
    if (label.includes('Tekathon') || label.includes('SIH')) {
      primaryValue = 'PPT Round';
      subLabel = '';
    } else if (label.includes('PSB') || label.includes('IDEA')) {
      primaryValue = 'IDEA 2.0';
      subLabel = 'AI-CSPARC Innovation';
    } else if (label.includes('HERizon')) {
      primaryValue = 'HERizon 1.0';
      subLabel = 'Women in Tech Hackathon';
    } else {
      primaryValue = platform;
      subLabel = 'Official Contender';
    }
  }

  return (
    <div
      className={`w-full transition-all duration-500 ease-out ${
        isActive || prefersReduced
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-85 scale-[0.98] translate-y-0.5'
      }`}
    >
      <div
        className="group/placeholder relative aspect-[16/10] w-full rounded-xl overflow-hidden border p-4 flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-md transition-all duration-500 ease-out select-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${brandColor}18 0%, ${brandColor}06 60%, rgba(255,255,255,0.7) 100%)`,
          borderColor: `${brandColor}24`,
        }}
      >
        {/* Large faded watermark of the platform logo in the background */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-transform ease-out ${
            prefersReduced
              ? 'opacity-10'
              : 'opacity-10 group-hover/placeholder:scale-120 duration-700'
          }`}
        >
          <div className="w-24 h-24 flex items-center justify-center filter grayscale contrast-125">
            <TechLogo name={platform} logoKey={logoKey} size={85} />
          </div>
        </div>

        {/* Ambient subtle glow ring */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-500 group-hover/placeholder:opacity-40"
          style={{
            background: `radial-gradient(ellipse at center, ${brandColor}30 0%, transparent 70%)`,
          }}
        />

        {/* Center: Big Metric Value + Sub-label */}
        <div className="relative z-10 flex flex-col items-center justify-center px-3 max-w-full">
          <div
            className={`font-sans font-black tracking-tight text-[#0d0d0d] leading-none mb-1.5 transition-transform duration-300 text-xl sm:text-2xl ${
              prefersReduced ? '' : 'group-hover/placeholder:-translate-y-0.5'
            }`}
          >
            {primaryValue}
          </div>

          {subLabel ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[rgba(13,13,13,0.08)] shadow-2xs backdrop-blur-xs">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: brandColor }}
              />
              <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-[#55534e] uppercase tracking-wider">
                {subLabel}
              </span>
            </div>
          ) : null}
        </div>

        {/* Decorative corner tag matching card branding */}
        <div className="absolute bottom-2.5 right-3 font-mono text-[9px] uppercase tracking-widest text-[#a9a6a0]">
          {platform}
        </div>
      </div>

      {/* Structural milestone badges row mirroring the gallery thumbnail strip */}
      <div className="flex items-center gap-2 mt-2.5 font-mono text-[10px] text-[#77756f]">
        <span className="px-2.5 py-1 rounded-md bg-[#eae8e3]/70 border border-[rgba(13,13,13,0.08)]">
          Official Track
        </span>
        <span className="px-2.5 py-1 rounded-md bg-[#eae8e3]/70 border border-[rgba(13,13,13,0.08)]">
          National Level
        </span>
      </div>
    </div>
  );
}
