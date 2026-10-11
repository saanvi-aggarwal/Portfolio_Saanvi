'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PROFILE } from '@/lib/data';
import { usePrefersReducedMotion } from '@/lib/hooks';

export function HomeCTA() {
  const prefersReduced = usePrefersReducedMotion();
  const [mountedPrimary, setMountedPrimary] = useState(false);
  const [mountedSecondary, setMountedSecondary] = useState(false);
  const [mountedResume, setMountedResume] = useState(false);

  const primaryRef = useRef<HTMLAnchorElement | null>(null);
  const secondaryRef = useRef<HTMLAnchorElement | null>(null);
  const resumeRef = useRef<HTMLAnchorElement | null>(null);

  // Entrance animation: primary at 620ms, secondary at 700ms, resume at 780ms (80ms apart)
  useEffect(() => {
    const t1 = setTimeout(() => setMountedPrimary(true), 620);
    const t2 = setTimeout(() => setMountedSecondary(true), 700);
    const t3 = setTimeout(() => setMountedResume(true), 780);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Subtle magnetic effect on desktop only (up to 8px within ~80px)
  useEffect(() => {
    if (prefersReduced) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const buttons = [
      primaryRef.current,
      secondaryRef.current,
      resumeRef.current,
    ].filter(Boolean) as HTMLAnchorElement[];
    if (buttons.length === 0) return;

    let mouseX = -9999;
    let mouseY = -9999;
    let animId: number;

    const states = buttons.map(() => ({
      curX: 0,
      curY: 0,
      targetX: 0,
      targetY: 0,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    const render = () => {
      const THRESHOLD = 80;
      const MAX_PULL = 8;

      buttons.forEach((btn, i) => {
        const state = states[i];
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < THRESHOLD && dist > 0.001) {
          const factor = 1 - dist / THRESHOLD;
          const pull = factor * MAX_PULL;
          state.targetX = (dx / dist) * pull;
          state.targetY = (dy / dist) * pull;
        } else {
          state.targetX = 0;
          state.targetY = 0;
        }

        // Spring lerp towards target
        state.curX += (state.targetX - state.curX) * 0.18;
        state.curY += (state.targetY - state.curY) * 0.18;

        btn.style.setProperty('--mag-x', `${state.curX.toFixed(2)}px`);
        btn.style.setProperty('--mag-y', `${state.curY.toFixed(2)}px`);
      });

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [prefersReduced]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full max-w-[560px] mx-auto mt-7 sm:mt-9 z-20 select-none">
      {/* =================================================================== */}
      {/* 1. PRIMARY BUTTON: "View my work →"                                 */}
      {/* =================================================================== */}
      <Link
        ref={primaryRef}
        href="/work"
        className="group relative inline-flex items-center justify-center h-[48px] px-6 sm:px-7 rounded-full bg-[#0d0d0d] text-white font-sans font-medium text-[15px] tracking-[-0.01em] shadow-[0_4px_16px_rgba(13,13,13,0.12)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[2px] hover:bg-[#222222] hover:shadow-[0_8px_24px_rgba(13,13,13,0.22)] focus-visible:outline-2 focus-visible:outline-[#0d0d0d] focus-visible:outline-offset-3 focus-visible:outline-solid cursor-pointer"
        style={{
          opacity: mountedPrimary || prefersReduced ? 1 : 0,
          transform:
            mountedPrimary || prefersReduced
              ? 'translate3d(var(--mag-x, 0px), var(--mag-y, 0px), 0)'
              : 'translate3d(0, 16px, 0)',
          transition:
            'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1), background-color 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)',
          willChange: 'transform, opacity',
        }}
      >
        <span>View my work</span>
        <span
          className="inline-block ml-1.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          aria-hidden="true"
        >
          →
        </span>
      </Link>

      {/* =================================================================== */}
      {/* 2. SECONDARY BUTTON: "About me"                                     */}
      {/* =================================================================== */}
      <Link
        ref={secondaryRef}
        href="/about"
        className="group relative inline-flex items-center justify-center h-[48px] px-6 sm:px-7 rounded-full bg-transparent text-[#0d0d0d] border border-[rgba(13,13,13,0.1)] font-sans font-medium text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#0d0d0d] hover:text-white hover:border-[#0d0d0d] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(13,13,13,0.08)] focus-visible:outline-2 focus-visible:outline-[#0d0d0d] focus-visible:outline-offset-3 focus-visible:outline-solid cursor-pointer"
        style={{
          opacity: mountedSecondary || prefersReduced ? 1 : 0,
          transform:
            mountedSecondary || prefersReduced
              ? 'translate3d(var(--mag-x, 0px), var(--mag-y, 0px), 0)'
              : 'translate3d(0, 16px, 0)',
          transition:
            'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1), background-color 0.3s cubic-bezier(0.16,1,0.3,1), color 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)',
          willChange: 'transform, opacity',
        }}
      >
        <span>About me</span>
      </Link>

      {/* =================================================================== */}
      {/* 3. DOWNLOAD RESUME BUTTON beside "About me"                         */}
      {/* =================================================================== */}
      <a
        ref={resumeRef}
        href={PROFILE.resumePath}
        download="Saanvi_Aggarwal_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center justify-center h-[48px] px-6 sm:px-7 rounded-full bg-transparent text-[#0d0d0d] border border-[rgba(13,13,13,0.1)] font-sans font-medium text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#0d0d0d] hover:text-white hover:border-[#0d0d0d] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(13,13,13,0.08)] focus-visible:outline-2 focus-visible:outline-[#0d0d0d] focus-visible:outline-offset-3 focus-visible:outline-solid cursor-pointer"
        style={{
          opacity: mountedResume || prefersReduced ? 1 : 0,
          transform:
            mountedResume || prefersReduced
              ? 'translate3d(var(--mag-x, 0px), var(--mag-y, 0px), 0)'
              : 'translate3d(0, 16px, 0)',
          transition:
            'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1), background-color 0.3s cubic-bezier(0.16,1,0.3,1), color 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)',
          willChange: 'transform, opacity',
        }}
        aria-label="Download Resume"
      >
        <span>Download resume</span>
        <span
          className="inline-block ml-1.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5"
          aria-hidden="true"
        >
          ↓
        </span>
      </a>
    </div>
  );
}
