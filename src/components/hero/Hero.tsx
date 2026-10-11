'use client';

import React, { useEffect, useState, useRef } from 'react';
import { PROFILE, SKILLS } from '@/lib/data';
import { scrollToTarget } from '@/lib/scroll';
import { useLiveClock, useMagnetic, usePrefersReducedMotion } from '@/lib/hooks';

export function Hero() {
  const clock = useLiveClock(PROFILE.timeZone);
  const prefersReduced = usePrefersReducedMotion();
  const exploreBtnRef = useMagnetic<HTMLAnchorElement>(70, 0.3);
  const talkBtnRef = useMagnetic<HTMLAnchorElement>(70, 0.3);

  // Background parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lettersLoaded, setLettersLoaded] = useState(false);

  // Text scramble state for role
  const [scrambleText, setScrambleText] = useState('');
  const targetRole = PROFILE.role;

  useEffect(() => {
    setLettersLoaded(true);

    if (prefersReduced) {
      setScrambleText(targetRole);
      return;
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@';
    let iteration = 0;
    const interval = setInterval(() => {
      setScrambleText(
        targetRole
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return targetRole[index];
            }
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= targetRole.length) {
        clearInterval(interval);
      }

      iteration += 1 / 2;
    }, 30);

    return () => clearInterval(interval);
  }, [targetRole, prefersReduced]);

  // Subtle mouse tracking for giant letters and background grid
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const nameLetters = PROFILE.firstName.toUpperCase().split('');
  const topMarqueeSkills = [
    'Python',
    'C++',
    'C',
    'SQL',
    'Data Structures & Algorithms',
    'Machine Learning',
    'Natural Language Processing',
    'Microsoft Azure',
    'Git & GitHub',
    'MySQL',
    'Object-Oriented Programming',
    'Database Management Systems',
  ];

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-[95vh] flex flex-col justify-between pt-28 pb-12 overflow-hidden border-b border-[rgba(13,13,13,0.08)] bg-[#f4f2ee]"
    >
      {/* Subtle fine dotted background grid with gentle drift */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.45] transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -16}px, 0)`,
          backgroundImage:
            'radial-gradient(circle, rgba(13,13,13,0.14) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
        aria-hidden="true"
      />

      {/* Top Status Indicators */}
      <div className="site-container relative z-10 w-full mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#77756f]">
          {/* Location & Live Clock */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/70 border border-[rgba(13,13,13,0.08)] backdrop-blur-sm shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[#0d0d0d] font-medium">{PROFILE.location}</span>
            <span className="text-[#a9a6a0]">/</span>
            <span className="text-[#3a3a3a] tabular-nums">{clock || '12:00:00 PM'} IST</span>
          </div>

          {/* Current Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/70 border border-[rgba(13,13,13,0.08)] backdrop-blur-sm shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#77756f]" />
            <span className="text-[#0d0d0d] font-medium">Currently:</span>
            <span className="text-[#3a3a3a]">{PROFILE.currentStatus}</span>
          </div>
        </div>
      </div>

      {/* Main Hero Composition */}
      <div className="site-container relative z-10 my-auto flex flex-col items-center text-center py-6">

        {/* Giant First Name Typographic Background Layer */}
        <div
          className="relative w-full flex items-center justify-center select-none overflow-hidden py-1 mb-2"
          aria-label={PROFILE.firstName}
        >
          <div className="flex items-center justify-center tracking-[-0.05em] leading-none font-bold text-[#0d0d0d]/[0.07] hover:text-[#0d0d0d]/[0.12] transition-colors text-[clamp(4.5rem,19vw,15.5rem)]">
            {nameLetters.map((char, i) => (
              <span
                key={i}
                className="inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform"
                style={{
                  transform: lettersLoaded
                    ? `translate3d(${mousePos.x * (i - 2.5) * 8}px, ${mousePos.y * (i - 2.5) * 6}px, 0)`
                    : 'translateY(120%)',
                  opacity: lettersLoaded ? 1 : 0,
                  transitionDelay: `${i * 65}ms`,
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Hero Role Heading with Scramble Effect */}
        <h1 className="heading-primary text-3xl sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl tracking-[-0.04em] text-[#0d0d0d] mt-2 mb-6">
          <span className="font-sans font-bold">
            {scrambleText || targetRole}{' '}
          </span>
          <span className="font-serif italic font-normal text-[#77756f] lowercase tracking-normal">
            student.
          </span>
        </h1>

        {/* Verbatim Resume Objective Summary */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-[#3a3a3a] leading-relaxed mb-10 font-normal">
          {PROFILE.shortBio}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            ref={exploreBtnRef}
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget('#work');
            }}
            className="btn-pill-primary group"
          >
            <span>Explore work</span>
            <span className="ml-2 font-mono text-xs transition-transform duration-300 group-hover:translate-x-1">
              ↓
            </span>
          </a>

          <a
            ref={talkBtnRef}
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget('#contact');
            }}
            className="btn-pill-secondary group"
          >
            <span>Let&apos;s talk</span>
            <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5">
              ↗
            </span>
          </a>

          <a
            href={PROFILE.resumePath}
            download="Saanvi_Aggarwal_Resume.pdf"
            className="btn-pill-secondary group"
            title="Download resume PDF"
          >
            <span>Résumé</span>
            <span className="ml-1.5 font-mono text-xs transition-transform duration-300 group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
        </div>
      </div>

      {/* Bottom Row: Infinite Marquee Strip + Scroll Indicator */}
      <div className="relative z-10 w-full mt-10">
        {/* Infinite marquee strip of skills */}
        <div className="w-full overflow-hidden border-y border-[rgba(13,13,13,0.08)] bg-white/50 backdrop-blur-xs py-3 group">
          <div className="flex w-max animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[0, 1].map((copyIndex) => (
              <div key={copyIndex} className="flex items-center gap-8 shrink-0 pr-8">
                {topMarqueeSkills.map((skill, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-[#3a3a3a]">
                    <span>{skill}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgba(13,13,13,0.25)]" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="site-container flex items-center justify-between pt-5 text-[11px] font-mono text-[#77756f] uppercase tracking-wider">
          <span>00 — Index</span>

          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget('#about');
            }}
            className="inline-flex items-center gap-2 hover:text-[#0d0d0d] transition-colors"
          >
            <span>Scroll</span>
            <div className="w-4 h-7 rounded-full border border-[rgba(13,13,13,0.3)] flex items-start justify-center p-1">
              <span className="w-1 h-2 rounded-full bg-[#0d0d0d] animate-bounce" />
            </div>
          </a>

          <span>{PROFILE.validTill}</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </section>
  );
}
