'use client';

import React from 'react';
import { DotGridCanvas } from '@/components/home/DotGridCanvas';
import { InteractiveName } from '@/components/home/InteractiveName';
import { RotatingQuote } from '@/components/home/RotatingQuote';
import { HomeCTA } from '@/components/home/HomeCTA';
import { RotatingBadge } from '@/components/home/RotatingBadge';
import { BottomBar } from '@/components/home/BottomBar';

export default function HomePage() {
  return (
    <div className="relative w-full h-[100svh] max-h-[100svh] overflow-hidden flex flex-col justify-between items-center pt-20 sm:pt-24 pb-4 sm:pb-6 bg-[#f4f2ee] select-none">
      {/* =================================================================== */}
      {/* 1. INTERACTIVE BACKGROUND: Ripple Dot Grid Canvas                   */}
      {/* =================================================================== */}
      <DotGridCanvas />

      {/* Semantic Accessible Heading for SEO & Screen Readers */}
      <h1 className="sr-only">
        Saanvi Aggarwal — Computer Science &amp; Engineering (AI) Student Portfolio
      </h1>

      {/* Spacer to keep center balanced below fixed nav */}
      <div className="w-full h-1" aria-hidden="true" />

      {/* =================================================================== */}
      {/* 2. HERO CENTREPIECE: Living Typographic Name, Quote & Call-to-Actions */}
      {/* =================================================================== */}
      <div className="site-container relative z-10 my-auto flex flex-col items-center justify-center text-center w-full max-w-[1260px]">
        {/* Living Typography Hero Name */}
        <div className="relative w-full flex items-center justify-center">
          <InteractiveName />
        </div>

        {/* Quote in Instrument Serif with cross-fade blur & dot controls */}
        <RotatingQuote />

        {/* Call-to-Action Pill Buttons directly below quote */}
        <HomeCTA />
      </div>

      {/* Rotating Circular Text Badge in Lower-Right (Desktop) */}
      <RotatingBadge />

      {/* =================================================================== */}
      {/* 3. BOTTOM SECTION: Social Buttons                                   */}
      {/* =================================================================== */}
      <div className="w-full relative z-20 flex flex-col items-center">
        <BottomBar />
      </div>

      {/* Keyframe styles for circular rotating badge */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
