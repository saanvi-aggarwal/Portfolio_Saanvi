'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ACHIEVEMENTS, type AchievementItem } from '@/lib/data';
import { TechLogo } from '@/components/ui/TechLogo';
import { useInView, usePrefersReducedMotion } from '@/lib/hooks';
import { AchievementGallery } from '@/components/achievements/AchievementGallery';
import { ImageLightbox } from '@/components/achievements/ImageLightbox';
import { MetricPlaceholder } from '@/components/achievements/MetricPlaceholder';

export function Achievements() {
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const [sectionRef, isSectionInView] = useInView<HTMLElement>({ threshold: 0.2 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  // Fullscreen Lightbox modal state
  const [lightboxData, setLightboxData] = useState<{
    images: string[];
    captions?: string[];
    imageType?: 'certificate' | 'photo';
    imageTypes?: ('certificate' | 'photo')[];
    currentIndex: number;
    title: string;
  } | null>(null);

  // Drag interaction state
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);

  // Update scroll indicators and calculate active card index
  const updateScrollState = useCallback(() => {
    const track = scrollTrackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(1);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const currentScroll = track.scrollLeft;
    const progress = Math.max(0, Math.min(1, currentScroll / maxScroll));
    setScrollProgress(progress);
    setCanScrollLeft(currentScroll > 10);
    setCanScrollRight(currentScroll < maxScroll - 10);

    // Determine card nearest viewport center
    const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
    const cards = track.querySelectorAll<HTMLElement>('[data-achievement-card]');
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(trackCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return;

    updateScrollState();
    track.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    // Smooth horizontal wheel conversion
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 5) {
        const atStart = track.scrollLeft <= 5;
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

        if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
          e.preventDefault();
          track.scrollBy({
            left: e.deltaY * 1.4,
            behavior: 'auto',
          });
        }
      }
    };

    track.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      track.removeEventListener('scroll', updateScrollState);
      track.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  // Scroll to target card index
  const scrollToIndex = (index: number) => {
    const track = scrollTrackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll<HTMLElement>('[data-achievement-card]');
    const targetCard = cards[index];
    if (targetCard) {
      const trackRect = track.getBoundingClientRect();
      const cardRect = targetCard.getBoundingClientRect();
      const targetScrollLeft =
        track.scrollLeft + (cardRect.left - trackRect.left) - (track.clientWidth - cardRect.width) / 2;

      track.scrollTo({
        left: targetScrollLeft,
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    }
  };

  const handlePrev = () => {
    const prevIdx = Math.max(0, activeIndex - 1);
    scrollToIndex(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(ACHIEVEMENTS.length - 1, activeIndex + 1);
    scrollToIndex(nextIdx);
  };

  // Drag-to-scroll mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = scrollTrackRef.current;
    if (!track) return;

    setIsDragging(true);
    dragStartX.current = e.pageX - track.offsetLeft;
    dragStartScrollLeft.current = track.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const track = scrollTrackRef.current;
    if (!track) return;

    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    track.scrollLeft = dragStartScrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="section-spacing border-b border-[rgba(13,13,13,0.08)] bg-[#f4f2ee] overflow-hidden"
    >
      <div className="site-container">
        {/* Section Header with Horizontal Gallery Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="rv mb-3">
              <span className="mono-tag">06 — Track Record</span>
            </div>
            <h2 className="heading-primary text-3xl sm:text-5xl lg:text-6xl">
              Achievements &amp; <span className="heading-accent">metrics.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#77756f] mt-2 max-w-xl">
              Verified competition standings, algorithmic milestones, and academic honors from résumé.
            </p>
          </div>

          {/* Interactive Navigation Controls */}
          <div className="flex items-center gap-4 self-start md:self-end rv stagger-1">
            {/* Progress bar and counter */}
            <div className="flex items-center gap-3 font-mono text-xs text-[#77756f]">
              <div className="w-24 sm:w-32 h-[3px] bg-[rgba(13,13,13,0.12)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0d0d0d] transition-all duration-150 ease-out"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
              <span className="tabular-nums font-bold text-[#0d0d0d]">
                {String(activeIndex + 1).padStart(2, '0')}/{String(ACHIEVEMENTS.length).padStart(2, '0')}
              </span>
            </div>

            {/* Prev / Next Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={!canScrollLeft}
                aria-label="Previous achievement card"
                className={`w-10 h-10 rounded-full border flex items-center justify-center font-mono text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] ${
                  canScrollLeft
                    ? 'border-[rgba(13,13,13,0.2)] bg-white text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-white shadow-xs cursor-pointer active:scale-95'
                    : 'border-[rgba(13,13,13,0.08)] bg-transparent text-[#a9a6a0] cursor-not-allowed opacity-50'
                }`}
              >
                ←
              </button>

              <button
                onClick={handleNext}
                disabled={!canScrollRight}
                aria-label="Next achievement card"
                className={`w-10 h-10 rounded-full border flex items-center justify-center font-mono text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] ${
                  canScrollRight
                    ? 'border-[rgba(13,13,13,0.2)] bg-white text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-white shadow-xs cursor-pointer active:scale-95'
                    : 'border-[rgba(13,13,13,0.08)] bg-transparent text-[#a9a6a0] cursor-not-allowed opacity-50'
                }`}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Slider Track with Edge Fade Masks */}
      <div className="w-full relative py-4">
        {/* Soft edge fade masks so clipped cards feel magazine-polished */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-[#f4f2ee] via-[#f4f2ee]/80 to-transparent z-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-[#f4f2ee] via-[#f4f2ee]/80 to-transparent z-20"
        />

        <div
          ref={scrollTrackRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex items-stretch gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-[max(var(--gutter),calc((100vw-1320px)/2+var(--gutter)))] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
        >
          {ACHIEVEMENTS.map((item, index) => {
            const isActive = activeIndex === index;
            const hasImages = Array.isArray(item.images) && item.images.length > 0;

            return (
              <div
                key={item.id}
                data-achievement-card
                tabIndex={0}
                role="button"
                onClick={() => scrollToIndex(index)}
                aria-label={item.metric ? `${item.label} (${item.metric}${item.suffix || ''})` : item.label}
                className={`snap-center shrink-0 w-[clamp(320px,32vw,395px)] min-h-[515px] sm:min-h-[535px] h-[535px] rounded-[24px] bg-white p-6 flex flex-col justify-between border transition-all duration-500 ease-out select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] ${
                  isActive
                    ? 'opacity-100 scale-100 border-[#0d0d0d]/30 shadow-[0_20px_48px_-10px_rgba(13,13,13,0.14)] -translate-y-1'
                    : 'opacity-60 scale-[0.95] border-[rgba(13,13,13,0.1)] shadow-xs hover:opacity-85 hover:border-[rgba(13,13,13,0.2)]'
                } ${prefersReduced ? '!scale-100 !transform-none' : ''}`}
              >
                {/* 1. Header: Platform Logo Tile + Index + Title + Detail */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center p-2 relative overflow-hidden"
                      style={{
                        backgroundColor: `${item.brandColor}12`,
                      }}
                    >
                      <TechLogo name={item.platform} logoKey={item.logoKey} size={26} />
                      <div
                        className="absolute inset-0 opacity-20 filter blur-md rounded-full pointer-events-none"
                        style={{ backgroundColor: item.brandColor }}
                      />
                    </div>

                    <span className="font-mono text-xs tracking-widest text-[#77756f]">
                      {item.index}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756f] block">
                      {item.platform}
                    </span>
                    <h3 className="font-sans font-bold text-base sm:text-lg text-[#0d0d0d] tracking-tight leading-snug line-clamp-2 min-h-[2.5rem] flex items-center">
                      {item.label}
                    </h3>
                    <p className="text-xs text-[#55534e] leading-relaxed line-clamp-2">
                      {item.detail}
                    </p>
                  </div>
                </div>

                {/* 2. Media Slot: Interactive Gallery OR Designed MetricPlaceholder */}
                <div className="my-3 w-full flex-1 flex flex-col justify-center">
                  {hasImages ? (
                    <AchievementGallery
                      images={item.images}
                      imageCaptions={item.imageCaptions}
                      imageType={item.imageType}
                      imageTypes={item.imageTypes}
                      title={item.label}
                      isActive={isActive}
                      prefersReduced={prefersReduced}
                      onOpenLightbox={(imgIndex) => {
                        setLightboxData({
                          images: item.images!,
                          captions: item.imageCaptions,
                          imageType: item.imageType,
                          imageTypes: item.imageTypes,
                          currentIndex: imgIndex,
                          title: item.label,
                        });
                      }}
                    />
                  ) : (
                    <MetricPlaceholder
                      platform={item.platform}
                      logoKey={item.logoKey}
                      brandColor={item.brandColor}
                      label={item.label}
                      metric={item.metric}
                      numericTarget={item.numericTarget}
                      suffix={item.suffix}
                      isActive={isActive}
                      prefersReduced={prefersReduced}
                    />
                  )}
                </div>

                {/* 3. Bottom Footer: Verified Metric (pinned cleanly at bottom) */}
                <div className="pt-3.5 border-t border-[rgba(13,13,13,0.08)] mt-auto">
                  {hasImages && index < 3 && item.numericTarget !== undefined ? (
                    /* Image cards show animated count-up in the footer */
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#77756f] block font-medium">
                          Verified Metric
                        </span>
                        <span className="text-[11px] font-mono text-[#a9a6a0]">
                          Official Result
                        </span>
                      </div>
                      <div className="text-right">
                        <AnimatedMetric
                          target={item.numericTarget}
                          suffix={item.suffix}
                          start={isSectionInView || prefersReduced}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Cards without images show clean verified standing line */
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#77756f] block font-medium">
                          Verified Standing
                        </span>
                        <span className="text-[11px] font-mono text-[#a9a6a0]">
                          Official Entry
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold text-[#0d0d0d]">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.brandColor }}
                        />
                        <span>
                          {item.metric || (index === 3 ? 'PPT Stage' : index === 4 ? 'IDEA 2.0' : 'Finalist')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* End Card: "and counting →" */}
          <div className="snap-center shrink-0 w-60 min-h-[515px] sm:min-h-[535px] h-[535px] rounded-[24px] border-2 border-dashed border-[rgba(13,13,13,0.18)] bg-white/40 flex flex-col items-center justify-center p-6 text-center text-[#77756f] select-none transition-all duration-500 opacity-60 hover:opacity-100">
            <span className="font-mono text-[10px] uppercase tracking-widest block mb-2 text-[#a9a6a0]">
              Milestones
            </span>
            <span className="font-sans font-bold text-2xl text-[#0d0d0d] block mb-2">
              and counting →
            </span>
            <p className="text-xs text-[#77756f]">
              Actively preparing for new engineering challenges
            </p>
          </div>
        </div>
      </div>

      {/* Accessible Fullscreen Image Lightbox Modal */}
      {lightboxData && (
        <ImageLightbox
          isOpen={lightboxData !== null}
          images={lightboxData.images}
          captions={lightboxData.captions}
          imageType={lightboxData.imageType}
          imageTypes={lightboxData.imageTypes}
          currentIndex={lightboxData.currentIndex}
          title={lightboxData.title}
          onClose={() => setLightboxData(null)}
          onIndexChange={(newIdx) =>
            setLightboxData((prev) =>
              prev ? { ...prev, currentIndex: newIdx } : null
            )
          }
          prefersReduced={prefersReduced}
        />
      )}

      {/* Footer Info Strip */}
      <div className="site-container pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#77756f] border-t border-[rgba(13,13,13,0.08)] pt-4">
          <span>HACKATHONS · COMPETITIVE PROGRAMMING · ACADEMIC MERIT</span>
          <span>CHANDIGARH UNIVERSITY · 2026</span>
        </div>
      </div>
    </section>
  );
}

// EaseOutQuart 1.4s count-up subcomponent
function AnimatedMetric({
  target,
  suffix = '',
  start = false,
}: {
  target: number;
  suffix?: string;
  start?: boolean;
}) {
  const [val, setVal] = useState(start ? target : 0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    const duration = 1400; // 1.4s

    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    let rAF: number;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutQuart(progress);
      setVal(Math.round(eased * target));

      if (progress < 1) {
        rAF = requestAnimationFrame(animate);
      }
    };

    rAF = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rAF);
  }, [target, start]);

  return (
    <div className="flex items-baseline justify-end gap-1.5 font-mono">
      <span className="text-2xl sm:text-3xl font-extrabold text-[#0d0d0d] tracking-tight">
        {val}
      </span>
      {suffix && (
        <span className="text-xs sm:text-sm font-semibold text-[#55534e]">
          {suffix}
        </span>
      )}
    </div>
  );
}
