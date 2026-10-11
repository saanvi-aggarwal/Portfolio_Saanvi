'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PROFILE } from '@/lib/data';
import { usePrefersReducedMotion } from '@/lib/hooks';

export function InteractiveName() {
  const prefersReduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const topLettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const [mounted, setMounted] = useState(false);
  const [spotlightReady, setSpotlightReady] = useState(false);

  const letters = PROFILE.firstName.toUpperCase().split(''); // ['S','A','A','N','V','I']

  useEffect(() => {
    // Choreographed entrance:
    // 1. Letters rise with 60ms stagger starting right after mount
    // 2. Spotlight fades in after letters are revealed (~450ms)
    const t1 = setTimeout(() => setMounted(true), 60);
    const t2 = setTimeout(() => setSpotlightReady(true), 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (prefersReduced) return;

    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    let pointerX = -9999;
    let pointerY = -9999;
    let hasPointer = false;
    let lastPointerTime = 0;

    // Smoothed spotlight coordinates relative to container
    let spotX = 0;
    let spotY = 0;
    let targetSpotX = 0;
    let targetSpotY = 0;

    // Letter dynamic states for proximity lerping
    const letterStates = letters.map(() => ({
      y: 0,
      scale: 1,
      targetY: 0,
      targetScale: 1,
      weight: 700,
    }));

    // Cache letter centers
    let letterCenters: { x: number; y: number }[] = [];
    let containerRect = container.getBoundingClientRect();

    const updateLetterCenters = () => {
      if (!container) return;
      containerRect = container.getBoundingClientRect();
      spotX = containerRect.width / 2;
      spotY = containerRect.height / 2;
      targetSpotX = spotX;
      targetSpotY = spotY;

      letterCenters = bottomLettersRef.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      });
    };

    updateLetterCenters();

    const handlePointerMove = (e: MouseEvent) => {
      hasPointer = true;
      lastPointerTime = performance.now();
      pointerX = e.clientX;
      pointerY = e.clientY;

      targetSpotX = pointerX - containerRect.left;
      targetSpotY = pointerY - containerRect.top;
    };

    const handlePointerLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
      hasPointer = false;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('resize', updateLetterCenters);

    // rAF loop for letter proximity lerp and spotlight lemniscate/tracking
    const loop = (time: number) => {
      // If no mouse or idle > 2.5s, drift spotlight in a smooth lemniscate (figure-8)
      const isIdle = !hasPointer || time - lastPointerTime > 2500;
      if (isIdle) {
        const t = time * 0.001;
        const rx = containerRect.width * 0.38;
        const ry = containerRect.height * 0.28;
        targetSpotX = containerRect.width * 0.5 + Math.cos(t * 0.85) * rx;
        targetSpotY = containerRect.height * 0.5 + (Math.sin(t * 1.7) / 2) * ry;
      }

      // Smooth lerp for spotlight
      spotX += (targetSpotX - spotX) * 0.12;
      spotY += (targetSpotY - spotY) * 0.12;

      container.style.setProperty('--spot-x', `${spotX.toFixed(1)}px`);
      container.style.setProperty('--spot-y', `${spotY.toFixed(1)}px`);

      // Calculate proximity for each letter
      for (let i = 0; i < letters.length; i++) {
        const state = letterStates[i];
        const center = letterCenters[i];

        if (center && hasPointer && pointerX > -1000) {
          const dx = pointerX - center.x;
          const dy = pointerY - center.y;
          const dist = Math.hypot(dx, dy);
          const PROXIMITY_RADIUS = 150;

          if (dist < PROXIMITY_RADIUS) {
            const factor = 1 - dist / PROXIMITY_RADIUS;
            state.targetY = -8 * factor;
            state.targetScale = 1 + 0.04 * factor;
            state.weight = 700 + Math.round(200 * factor);
          } else {
            state.targetY = 0;
            state.targetScale = 1;
            state.weight = 700;
          }
        } else {
          state.targetY = 0;
          state.targetScale = 1;
          state.weight = 700;
        }

        // Spring/lerp letter positions
        state.y += (state.targetY - state.y) * 0.18;
        state.scale += (state.targetScale - state.scale) * 0.18;

        const transform = `translate3d(0, ${state.y.toFixed(2)}px, 0) scale(${state.scale.toFixed(3)})`;
        const bottomEl = bottomLettersRef.current[i];
        const topEl = topLettersRef.current[i];

        if (bottomEl) {
          bottomEl.style.transform = transform;
          bottomEl.style.fontWeight = `${state.weight}`;
        }
        if (topEl) {
          topEl.style.transform = transform;
          topEl.style.fontWeight = `${state.weight}`;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('resize', updateLetterCenters);
    };
  }, [letters.length, prefersReduced]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center select-none py-2"
      style={{
        '--spot-x': '50%',
        '--spot-y': '50%',
      } as React.CSSProperties}
      aria-label={PROFILE.firstName}
    >
      {/* 1. BOTTOM LAYER: Outlined Stroke-Only Name */}
      <div
        className="flex items-center justify-center font-sans font-bold tracking-[-0.04em] leading-[0.9] text-[clamp(4.2rem,13vw,10.5rem)]"
        style={{
          color: 'transparent',
          WebkitTextStroke: '1.5px #0d0d0d',
        }}
        aria-hidden="true"
      >
        {letters.map((char, i) => (
          <span
            key={`bot-${i}`}
            className="inline-block overflow-hidden py-3 px-0.5"
          >
            <span
              ref={(el) => {
                bottomLettersRef.current[i] = el;
              }}
              className="inline-block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] py-1"
              style={{
                transform: mounted || prefersReduced ? 'translateY(0%)' : 'translateY(115%)',
                opacity: mounted || prefersReduced ? 1 : 0,
                transitionDelay: prefersReduced ? '0ms' : `${i * 60}ms`,
                willChange: 'transform',
              }}
            >
              {char}
            </span>
          </span>
        ))}
      </div>

      {/* 2. TOP LAYER: Solid Ink Fill revealed via Spotlight Radial Gradient */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out"
        style={{
          opacity: spotlightReady || prefersReduced ? 1 : 0,
          WebkitMaskImage:
            'radial-gradient(circle 120px at var(--spot-x, 50%) var(--spot-y, 50%), black 0%, black 65%, transparent 100%)',
          maskImage:
            'radial-gradient(circle 120px at var(--spot-x, 50%) var(--spot-y, 50%), black 0%, black 65%, transparent 100%)',
        }}
        aria-hidden="true"
      >

        {/* Solid Ink Letters */}
        <div className="flex items-center justify-center font-sans font-bold tracking-[-0.04em] leading-[0.9] text-[#0d0d0d] text-[clamp(4.2rem,13vw,10.5rem)]">
          {letters.map((char, i) => (
            <span
              key={`top-${i}`}
              className="inline-block overflow-hidden py-3 px-0.5"
            >
              <span
                ref={(el) => {
                  topLettersRef.current[i] = el;
                }}
                className="inline-block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] py-1"
                style={{
                  transform: mounted || prefersReduced ? 'translateY(0%)' : 'translateY(115%)',
                  opacity: mounted || prefersReduced ? 1 : 0,
                  transitionDelay: prefersReduced ? '0ms' : `${i * 60}ms`,
                  willChange: 'transform',
                }}
              >
                {char}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
