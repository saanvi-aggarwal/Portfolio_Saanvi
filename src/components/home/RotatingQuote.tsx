'use client';

import React, { useState, useEffect } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';

const QUOTES = [
  'Building with curiosity, solving with logic, growing with every challenge.',
  'Turning complex problem statements into clean, structured software solutions.',
  'Engineering with code, algorithms, and continuous curiosity.',
];

export function RotatingQuote() {
  const prefersReduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Choreographed entrance: quote fades in at 500ms
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (prefersReduced || isHovered) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [prefersReduced, isHovered]);

  const handleSelectQuote = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="mt-5 sm:mt-8 max-w-xl w-full px-4 flex flex-col items-center text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none z-10"
      style={{
        opacity: mounted || prefersReduced ? 1 : 0,
        transform: mounted || prefersReduced ? 'translateY(0)' : 'translateY(16px)',
        transitionDelay: prefersReduced ? '0ms' : '500ms',
      }}
    >
      {/* Thin Hairline Divider above quote */}
      <div className="w-16 h-[1px] bg-[rgba(13,13,13,0.18)] mb-3 sm:mb-4" />

      {/* Quote Text with Cross-fade & Soft Blur */}
      <div className="min-h-[44px] sm:min-h-[50px] flex items-center justify-center">
        <p
          className="font-serif italic font-normal text-base sm:text-lg md:text-xl text-[#77756f] leading-snug transition-all duration-500 ease-out"
          style={{
            opacity: isTransitioning ? 0 : 1,
            filter: isTransitioning ? 'blur(5px)' : 'blur(0px)',
            transform: isTransitioning ? 'translateY(4px)' : 'translateY(0)',
          }}
        >
          &ldquo;{QUOTES[currentIndex]}&rdquo;
        </p>
      </div>

      {/* 3 Clickable Indicator Dots */}
      <div className="flex items-center gap-2 mt-3" aria-label="Quote selector">
        {QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={() => handleSelectQuote(i)}
            className="group relative p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0d0d0d] rounded-full"
            aria-label={`Show quote ${i + 1}`}
            aria-current={currentIndex === i ? 'true' : 'false'}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                currentIndex === i
                  ? 'w-4 h-1.5 bg-[#0d0d0d]'
                  : 'w-1.5 h-1.5 bg-[rgba(13,13,13,0.22)] group-hover:bg-[#77756f]'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
