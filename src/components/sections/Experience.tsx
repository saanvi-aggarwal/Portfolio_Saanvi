'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TIMELINE } from '@/lib/data';
import { usePrefersReducedMotion } from '@/lib/hooks';

export function Experience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [spineHeight, setSpineHeight] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setSpineHeight(1);
      return;
    }

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start when container is 60% down the screen, end when 30% from top
      const start = windowHeight * 0.75;
      const end = windowHeight * 0.25;

      const totalDistance = rect.height;
      const currentProgress = (start - rect.top) / (totalDistance + (start - end));

      const clamped = Math.max(0, Math.min(1, currentProgress));
      setSpineHeight(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReduced]);

  return (
    <section
      id="education"
      className="section-spacing border-b border-[rgba(13,13,13,0.08)] bg-[#f4f2ee]"
    >
      <div className="site-container">
        {/* Section Heading */}
        <div className="rv mb-12">
          <div className="mb-3">
            <span className="mono-tag">04 — Academic Journey</span>
          </div>
          <h2 className="heading-primary text-3xl sm:text-5xl lg:text-6xl">
            Education &amp; academic <span className="heading-accent">journey.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#77756f] mt-3 max-w-xl">
            A chronological academic timeline connecting secondary schooling, senior secondary honors, and undergraduate computer science engineering.
          </p>
        </div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto pt-6 pb-4">
          {/* Vertical Spine Track (Background Faint Line) */}
          <div
            className="absolute top-8 bottom-12 left-4 sm:left-1/2 w-[2px] -translate-x-1/2 bg-[rgba(13,13,13,0.12)] pointer-events-none"
            aria-hidden="true"
          >
            {/* Active Drawing Spine */}
            <div
              className="w-full bg-[#0d0d0d] transition-[height] duration-150 ease-out origin-top"
              style={{
                height: `${(spineHeight * 100).toFixed(1)}%`,
              }}
            />
          </div>

          {/* Timeline Nodes */}
          <div className="space-y-12 sm:space-y-16">
            {TIMELINE.map((item, index) => {
              const isEven = index % 2 === 0;
              const isNext = item.category === 'next';
              const progressThreshold = (index + 0.3) / TIMELINE.length;
              const isPassed = spineHeight >= progressThreshold;

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } gap-6 sm:gap-12 pl-12 sm:pl-0 rv`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* Central Node Indicator Dot */}
                  <div
                    className={`absolute left-4 sm:left-1/2 -translate-x-1/2 top-4 w-5 h-5 rounded-full border-2 transition-all duration-400 z-10 flex items-center justify-center ${
                      isPassed
                        ? 'border-[#0d0d0d] bg-[#0d0d0d] shadow-sm scale-110'
                        : 'border-[#a9a6a0] bg-white scale-95'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isPassed ? 'bg-[#f4f2ee]' : 'bg-[#a9a6a0]'
                      }`}
                    />
                  </div>

                  {/* Content Card (Left or Right depending on isEven) */}
                  <div className="w-full sm:w-[calc(50%-2rem)]">
                    {isNext ? (
                      <a
                        href="/contact"
                        className="group block p-6 sm:p-7 rounded-3xl border-2 border-dashed border-[#0d0d0d] bg-white/70 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <span className="font-mono text-xs font-bold tracking-wider text-[#77756f]">
                            {item.year}
                          </span>
                          <span className="font-mono text-xs text-[#0d0d0d] group-hover:translate-x-1 transition-transform">
                            Get in touch →
                          </span>
                        </div>
                        <h3 className="font-sans font-bold text-lg sm:text-xl text-[#0d0d0d] tracking-tight mb-1">
                          {item.title}
                        </h3>
                        <p className="font-mono text-xs text-[#77756f] uppercase tracking-wider mb-3">
                          {item.place}
                        </p>
                        <p className="text-sm text-[#3a3a3a] leading-relaxed">
                          {item.detail}
                        </p>
                      </a>
                    ) : (
                      <div
                        className={`p-6 sm:p-7 rounded-3xl transition-all duration-300 card-clean bg-white ${
                          isPassed ? 'shadow-md ring-1 ring-[#0d0d0d]/10' : 'opacity-85'
                        }`}
                      >
                        {/* Year Kicker */}
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <span className="font-mono text-xs font-bold tracking-wider text-[#77756f]">
                            {item.year}
                          </span>
                          {item.highlight && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-[#0d0d0d] text-white">
                              Milestone
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-sans font-bold text-lg sm:text-xl text-[#0d0d0d] tracking-tight mb-1">
                          {item.title}
                        </h3>

                        {/* Place / Institution */}
                        <p className="font-mono text-xs text-[#77756f] uppercase tracking-wider mb-3">
                          {item.place}
                        </p>

                        {/* Detail */}
                        <p className="text-sm text-[#3a3a3a] leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Empty spacer for alignment on opposite side */}
                  <div className="hidden sm:block w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
export { Experience as Education };
