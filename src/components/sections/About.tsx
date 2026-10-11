'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PROFILE } from '@/lib/data';
import { usePrefersReducedMotion } from '@/lib/hooks';

export function About() {
  const prefersReduced = usePrefersReducedMotion();
  const [isFlipped, setIsFlipped] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Pendulum swing physics on mouse move
  useEffect(() => {
    if (prefersReduced) return;
    const container = cardContainerRef.current;
    if (!container) return;

    let rAFId: number;
    let angle = 0;
    let velocity = 0;
    let lastX = 0;
    let isHovering = false;
    let startTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const deltaX = currentX - lastX;
      lastX = currentX;

      // Add velocity proportional to mouse motion
      if (Math.abs(deltaX) > 0.5) {
        velocity += (deltaX * 0.08);
        velocity = Math.max(-8, Math.min(8, velocity));
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      isHovering = true;
      lastX = e.clientX;
      setIsFlipped(true);
    };

    const handleMouseLeave = () => {
      isHovering = false;
      setIsFlipped(false);
    };

    const updatePhysics = () => {
      if (isHovering || Math.abs(velocity) > 0.05 || Math.abs(angle) > 0.1) {
        // Spring physics: restoring force towards 0 + damping
        const springForce = -0.06 * angle;
        velocity += springForce;
        velocity *= 0.92; // Damping factor
        angle += velocity;
      } else {
        // Subtle natural idle sway
        const elapsed = (Date.now() - startTime) / 1000;
        angle = Math.sin(elapsed * 1.8) * 1.2;
      }

      setRotationAngle(angle);
      rAFId = requestAnimationFrame(updatePhysics);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    rAFId = requestAnimationFrame(updatePhysics);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rAFId);
    };
  }, [prefersReduced]);

  const academicInterests = [
    'Artificial Intelligence',
    'Machine Learning',
    'Data Structures & Algorithms',
    'Computer Organization & Architecture',
    'Software Development',
  ];

  return (
    <section id="about" className="section-spacing border-b border-[rgba(13,13,13,0.08)] bg-[#f4f2ee]">
      <div className="site-container">
        {/* Section Tag */}
        <div className="rv mb-4">
          <span className="mono-tag">01 — About me</span>
        </div>

        {/* 3-Column Grid: minmax(0,1fr) 330px minmax(0,1fr) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_330px_minmax(0,1fr)] gap-10 lg:gap-8 items-stretch pt-4">
          
          {/* Left Column: Introduction & Bio (Original Layout) */}
          <div className="flex flex-col justify-between card-clean p-8 sm:p-10 rv">
            <div>
              <h2 className="heading-primary text-3xl sm:text-4xl lg:text-5xl mb-6">
                Hi, I&apos;m {PROFILE.firstName}.{' '}
                <span className="heading-accent block sm:inline mt-1 sm:mt-0">Nice to meet you.</span>
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#3a3a3a] leading-relaxed">
                {/* Verbatim Resume Summary */}
                <p className="font-medium text-[#0d0d0d]">
                  {PROFILE.resumeSummary}
                </p>
              </div>
            </div>

            {/* Social & Action Links */}
            <div className="pt-8 border-t border-[rgba(13,13,13,0.08)] flex flex-wrap items-center gap-3">
              <a
                href={PROFILE.resumePath}
                download="Saanvi_Aggarwal_Resume.pdf"
                className="btn-pill-primary text-xs !py-2.5 !px-5"
              >
                <span>Résumé</span>
                <span className="ml-1 font-mono text-[10px]">↓</span>
              </a>

              {PROFILE.github && (
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-secondary text-xs !py-2.5 !px-5"
                >
                  <span>GitHub</span>
                  <span className="ml-1 text-[11px]">↗</span>
                </a>
              )}

              {PROFILE.linkedin && (
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-secondary text-xs !py-2.5 !px-5"
                >
                  <span>LinkedIn</span>
                  <span className="ml-1 text-[11px]">↗</span>
                </a>
              )}

              <Link
                href="/coa"
                className="btn-pill-secondary text-xs !py-2.5 !px-5"
              >
                <span>COA Lab</span>
                <span className="ml-1 text-[11px]">↗</span>
              </Link>
            </div>
          </div>

          {/* Centre Column: Hanging Lanyard ID Card */}
          <div className="flex flex-col items-center justify-start relative rv stagger-1">
            {/* Hanging Lanyard Strap */}
            <div className="relative flex flex-col items-center z-20">
              {/* Lanyard Top Strap (30x56px) with scrolling micro text */}
              <div className="w-[30px] h-[56px] bg-[#0d0d0d] rounded-t-sm shadow-inner flex flex-col items-center justify-center overflow-hidden border border-[#3a3a3a]">
                <div className="animate-[strapScroll_8s_linear_infinite] flex flex-col items-center gap-2 select-none text-[8px] font-mono uppercase text-[#a9a6a0] tracking-widest whitespace-nowrap [writing-mode:vertical-rl]">
                  <span>{PROFILE.initials}</span>
                  <span>·</span>
                  <span>STUDENT</span>
                  <span>·</span>
                  <span>{PROFILE.initials}</span>
                  <span>·</span>
                  <span>STUDENT</span>
                </div>
              </div>

              {/* Realistic Metal Clip */}
              <div className="w-8 h-4 bg-gradient-to-b from-[#d1d5db] to-[#9ca3af] rounded-b-md shadow-md border-t border-white/60 flex items-center justify-center">
                <div className="w-4 h-1 bg-[#4b5563] rounded-full" />
              </div>
            </div>

            {/* Interactive Swing & Flip ID Card Container */}
            <div
              ref={cardContainerRef}
              tabIndex={0}
              role="button"
              aria-label="Student ID card. Press Enter or Space to flip."
              onClick={() => setIsFlipped(!isFlipped)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsFlipped(!isFlipped);
                }
              }}
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transformOrigin: 'top center',
                transition: prefersReduced ? 'none' : 'transform 0.1s ease-out',
              }}
              className="relative w-[300px] h-[404px] mt-1 cursor-pointer perspective-[1000px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] focus-visible:ring-offset-4 rounded-[26px]"
            >
              {/* 3D Flipping Card Body */}
              <div
                className="w-full h-full relative transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d]"
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* FRONT OF ID CARD */}
                <div className="absolute inset-0 w-full h-full bg-white rounded-[26px] p-5 flex flex-col justify-between shadow-[0_16px_36px_-6px_rgba(13,13,13,0.12),inset_0_0_0_1px_rgba(13,13,13,0.1)] [backface-visibility:hidden]">
                  {/* Card Clip Slot Hole */}
                  <div className="w-12 h-2.5 rounded-full bg-[#e5e5e5] border border-[rgba(13,13,13,0.15)] mx-auto mb-2" />

                  {/* Header Band */}
                  <div className="flex items-center justify-between border-b border-[rgba(13,13,13,0.1)] pb-2 mb-3">
                    <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[#0d0d0d]">
                      ENGINEERING ID
                    </span>
                    <span className="font-mono text-[9px] text-[#77756f]">
                      # {PROFILE.studentId}
                    </span>
                  </div>

                  {/* Monogram Frame (128x128) */}
                  <div className="w-28 h-28 mx-auto rounded-2xl bg-[#0d0d0d] text-[#f4f2ee] border-4 border-[#e9e6e0] shadow-inner flex flex-col items-center justify-center p-2 mb-3">
                    <span className="font-mono text-3xl font-bold tracking-tight">
                      {PROFILE.initials}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#a9a6a0] mt-1">
                      CSE (AI)
                    </span>
                  </div>

                  {/* Name and Role */}
                  <div className="text-center mb-3">
                    <h3 className="font-sans font-bold text-lg text-[#0d0d0d] tracking-tight leading-tight">
                      {PROFILE.name}
                    </h3>
                    <p className="font-mono text-[10px] text-[#77756f] uppercase tracking-wider mt-0.5">
                      Student
                    </p>
                  </div>

                  {/* Meta Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-b border-[rgba(13,13,13,0.08)] py-2 mb-3 bg-[#fcfbf9] rounded-lg px-2">
                    <div>
                      <span className="text-[#a9a6a0] block text-[8px] uppercase">ID No.</span>
                      <span className="text-[#0d0d0d] font-semibold">{PROFILE.studentId}</span>
                    </div>
                    <div>
                      <span className="text-[#a9a6a0] block text-[8px] uppercase">Valid Till</span>
                      <span className="text-[#0d0d0d] font-semibold">{PROFILE.validTill}</span>
                    </div>
                  </div>

                  {/* Bottom Barcode + Hologram */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Barcode */}
                    <div className="flex items-end gap-[2px] h-6">
                      {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6].map((w, i) => (
                        <div
                          key={i}
                          className="bg-[#0d0d0d]"
                          style={{
                            width: `${(w % 3) + 1}px`,
                            height: `${14 + (w % 8)}px`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Holographic grayscale security sticker */}
                    <div className="w-7 h-7 rounded-md border border-[rgba(13,13,13,0.15)] bg-gradient-to-tr from-[#f3f4f6] via-[#e5e7eb] to-[#d1d5db] flex items-center justify-center text-[7px] font-mono font-bold text-[#4b5563] shadow-xs">
                      SEC
                    </div>
                  </div>

                  {/* Hover/Tap hint */}
                  <div className="text-center pt-2">
                    <span className="text-[9px] font-mono text-[#a9a6a0] uppercase tracking-wider">
                      Hover or tap to flip ↻
                    </span>
                  </div>
                </div>

                {/* BACK OF ID CARD */}
                <div
                  className="absolute inset-0 w-full h-full bg-[#0d0d0d] text-[#f4f2ee] rounded-[26px] p-6 flex flex-col justify-between shadow-[0_16px_36px_-6px_rgba(13,13,13,0.2)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.15)] pb-3 mb-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#a9a6a0]">
                        Verified Profile
                      </span>
                      <span className="font-mono text-[10px] text-[#f4f2ee]">
                        ID · 2029
                      </span>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed font-sans">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#77756f] block">Program</span>
                        <p className="font-medium text-[#f4f2ee]">B.E. Computer Science & Engineering (AI)</p>
                      </div>

                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#77756f] block">Institution</span>
                        <p className="text-[#a9a6a0]">{PROFILE.institution}</p>
                      </div>

                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#77756f] block">Specialization</span>
                        <p className="text-[#a9a6a0]">Artificial Intelligence</p>
                      </div>

                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#77756f] block">Certifications</span>
                        <p className="text-[#a9a6a0]">Microsoft Azure AZ-900 & AI-900</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[rgba(255,255,255,0.15)] pt-4 text-[11px] font-mono text-[#a9a6a0]">
                    <span className="block text-[#f4f2ee] font-medium mb-1">If found, say hello:</span>
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="text-[#f4f2ee] underline hover:text-white break-all"
                    >
                      {PROFILE.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Facts & Quote */}
          <div className="flex flex-col justify-between card-clean p-8 sm:p-10 rv stagger-2">
            <div>
              <h3 className="heading-primary text-2xl sm:text-3xl mb-6">
                Quick facts.
              </h3>

              <dl className="space-y-4 text-sm divide-y divide-[rgba(13,13,13,0.08)]">
                <div className="pt-3 first:pt-0 flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-xs text-[#77756f] uppercase tracking-wider">
                    Location
                  </dt>
                  <dd className="font-medium text-[#0d0d0d] text-right">
                    {PROFILE.location}
                  </dd>
                </div>

                <div className="pt-3 flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-xs text-[#77756f] uppercase tracking-wider">
                    Standing
                  </dt>
                  <dd className="font-medium text-[#0d0d0d] text-right">
                    CGPA {PROFILE.cgpa}
                  </dd>
                </div>

                <div className="pt-3 flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-xs text-[#77756f] uppercase tracking-wider">
                    Projects
                  </dt>
                  <dd className="font-medium text-[#0d0d0d] text-right">
                    3 Core Projects
                  </dd>
                </div>

                <div className="pt-3 flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-xs text-[#77756f] uppercase tracking-wider">
                    Hackathons
                  </dt>
                  <dd className="font-medium text-[#0d0d0d] text-right">
                    6 Competitions &amp; Ideathons
                  </dd>
                </div>

                <div className="pt-3 flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-xs text-[#77756f] uppercase tracking-wider">
                    Class XII (CBSE)
                  </dt>
                  <dd className="font-medium text-[#0d0d0d] text-right">
                    93.6% · St. Luke&apos;s School
                  </dd>
                </div>

                <div className="pt-3 flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-xs text-[#77756f] uppercase tracking-wider">
                    Interests
                  </dt>
                  <dd className="font-medium text-[#0d0d0d] text-right">
                    Writing, Dancing, Travelling
                  </dd>
                </div>
              </dl>
            </div>

            {/* Paraphrased Quote from résumé / profile */}
            <div className="mt-8 p-5 rounded-2xl bg-[#f4f2ee] border border-[rgba(13,13,13,0.08)]">
              <p className="font-serif italic text-base text-[#3a3a3a] leading-snug">
                &ldquo;Building with curiosity, solving with logic, growing with every challenge.&rdquo;
              </p>
              <span className="block font-mono text-[10px] uppercase text-[#77756f] mt-3">
                — Saanvi Aggarwal
              </span>
            </div>
          </div>
        </div>

        {/* Dedicated Foundation Block: Academic Interests & Future Goals placed down */}
        <div className="card-clean p-8 sm:p-10 lg:p-12 mt-10 lg:mt-12 rv stagger-3">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14 items-start">
            {/* Academic Interests */}
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#f4f2ee] border border-[rgba(13,13,13,0.08)] flex items-center justify-center text-[#0d0d0d] shadow-sm">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                </div>
                <span className="mono-tag !text-[10px] tracking-widest text-[#77756f]">CURRICULAR FOCUS</span>
              </div>

              <h3 className="heading-primary text-2xl sm:text-3xl text-[#0d0d0d] mb-2 tracking-tight">
                Academic <span className="heading-accent">interests.</span>
              </h3>

              <p className="text-xs font-mono text-[#77756f] mb-5 leading-relaxed">
                Core computational and engineering disciplines of focus:
              </p>

              <div className="flex flex-wrap gap-2">
                {academicInterests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3.5 py-1.5 rounded-full text-xs font-mono text-[#0d0d0d] bg-[#fcfbf9] border border-[rgba(13,13,13,0.12)] hover:border-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-[#f4f2ee] transition-all duration-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Future Goals */}
            <div className="border-t lg:border-t-0 lg:border-l border-[rgba(13,13,13,0.08)] pt-8 lg:pt-0 lg:pl-12">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0d0d0d] text-[#f4f2ee] flex items-center justify-center shadow-sm">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <span className="mono-tag !text-[10px] tracking-widest text-[#77756f]">TRAJECTORY &amp; VISION</span>
              </div>

              <h3 className="heading-primary text-2xl sm:text-3xl text-[#0d0d0d] mb-3 tracking-tight">
                Future <span className="heading-accent">goals.</span>
              </h3>

              <div className="relative pl-4 border-l-2 border-[#0d0d0d]/20 py-1">
                <p className="text-sm sm:text-base text-[#3a3a3a] leading-relaxed">
                  I want to grow into an engineer who builds practical AI-driven software, not just models that work in a notebook. Over the next few years I plan to go deeper into machine learning, strengthen my problem-solving and system fundamentals, and take on internships where I can learn how real products get built. Longer term, I&apos;d like to work on AI systems that solve real problems, and keep learning how things work underneath, from algorithms down to the hardware.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes strapScroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
      `}</style>
    </section>
  );
}
