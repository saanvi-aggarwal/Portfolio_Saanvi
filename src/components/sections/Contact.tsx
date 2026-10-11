'use client';

import React, { useState } from 'react';
import { PROFILE } from '@/lib/data';

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const headingText = "Let's build something";

  return (
    <section
      id="contact"
      className="section-spacing bg-[#f4f2ee] relative"
    >
      <div className="site-container">
        {/* Top Tag */}
        <div className="rv mb-4">
          <span className="mono-tag">06 — Get in touch</span>
        </div>

        {/* Huge Interactive Heading with bouncing letters */}
        <div className="rv mb-12">
          <h2 className="heading-primary text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.04em] text-[#0d0d0d] leading-[1.05]">
            <span className="inline-block">
              {headingText.split('').map((char, index) => (
                <span
                  key={index}
                  className="inline-block transition-transform duration-300 hover:-translate-y-4 cursor-default select-none"
                  style={{
                    display: char === ' ' ? 'inline' : 'inline-block',
                    width: char === ' ' ? '0.3em' : 'auto',
                  }}
                >
                  {char}
                </span>
              ))}
            </span>{' '}
            <span className="font-serif italic font-normal text-[#77756f] inline-block hover:-translate-y-4 transition-transform duration-300 cursor-default select-none">
              together.
            </span>
          </h2>
        </div>

        {/* Email & Copy Interaction */}
        <div className="rv stagger-1 my-10 flex flex-col md:flex-row md:items-center justify-between gap-8 pb-14 border-b border-[rgba(13,13,13,0.1)]">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[#77756f]">
              Direct Inquiries
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${PROFILE.email}`}
                className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-[#0d0d0d] underline decoration-[rgba(13,13,13,0.3)] hover:decoration-[#0d0d0d] underline-offset-8 transition-colors break-all"
              >
                {PROFILE.email}
              </a>

              <button
                onClick={handleCopyEmail}
                className="px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase bg-white border border-[rgba(13,13,13,0.12)] text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-[#f4f2ee] active:scale-95 transition-all shadow-xs cursor-pointer"
                aria-label="Copy email address"
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>

              <span className="sr-only" aria-live="polite">
                {copied ? 'Email address copied to clipboard' : ''}
              </span>
            </div>
          </div>

          {/* Rotating "say hello" badge */}
          <div className="relative self-start md:self-auto flex items-center justify-center">
            <svg
              className="w-32 h-32 animate-[spin_20s_linear_infinite] select-none pointer-events-none"
              viewBox="0 0 200 200"
            >
              <path
                id="contactBadgePath"
                d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
                fill="none"
              />
              <text className="text-[12px] font-mono tracking-[0.22em] uppercase fill-[#3a3a3a] font-medium">
                <textPath href="#contactBadgePath" startOffset="0%">
                  SAY HELLO · GET IN TOUCH · COLLABORATE ·
                </textPath>
              </text>
            </svg>

            <a
              href={`mailto:${PROFILE.email}`}
              className="absolute w-14 h-14 rounded-full bg-[#0d0d0d] text-[#f4f2ee] flex items-center justify-center text-xl font-mono hover:scale-110 transition-transform shadow-md"
              aria-label="Send email"
            >
              ↗
            </a>
          </div>
        </div>

        {/* Links Grid from Résumé */}
        <div className="rv stagger-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-4">
          <div>
            <span className="font-mono text-xs text-[#77756f] uppercase tracking-wider block mb-2">
              Telephone
            </span>
            <a
              href={PROFILE.phoneHref}
              className="font-medium text-[#0d0d0d] hover:underline text-sm"
            >
              {PROFILE.phone}
            </a>
          </div>

          <div>
            <span className="font-mono text-xs text-[#77756f] uppercase tracking-wider block mb-2">
              Location
            </span>
            <span className="font-medium text-[#0d0d0d] text-sm">
              {PROFILE.location}
            </span>
          </div>

          <div>
            <span className="font-mono text-xs text-[#77756f] uppercase tracking-wider block mb-2">
              Profiles
            </span>
            <div className="flex flex-col gap-1.5 text-sm">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#0d0d0d] hover:underline inline-flex items-center gap-1"
              >
                <span>GitHub</span>
                <span className="text-xs font-mono text-[#77756f]">↗</span>
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#0d0d0d] hover:underline inline-flex items-center gap-1"
              >
                <span>LinkedIn</span>
                <span className="text-xs font-mono text-[#77756f]">↗</span>
              </a>
              <a
                href={PROFILE.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#0d0d0d] hover:underline inline-flex items-center gap-1"
              >
                <span>LeetCode</span>
                <span className="text-xs font-mono text-[#77756f]">↗</span>
              </a>
            </div>
          </div>

          <div>
            <span className="font-mono text-xs text-[#77756f] uppercase tracking-wider block mb-2">
              Résumé
            </span>
            <a
              href={PROFILE.resumePath}
              download="Saanvi_Aggarwal_Resume.pdf"
              className="font-medium text-[#0d0d0d] hover:underline text-sm inline-flex items-center gap-1"
            >
              <span>Download Résumé (PDF)</span>
              <span className="text-xs font-mono text-[#77756f]">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
