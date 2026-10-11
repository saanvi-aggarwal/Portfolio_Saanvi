'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePrefersReducedMotion } from '@/lib/hooks';

const CONVERTER_EXAMPLES = ['1011₂ → 11₁₀', '255₁₀ → FF₁₆', '77₈ → 63₁₀'];

export function CoaHubClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReduced = usePrefersReducedMotion();

  // Redirect old ?tab= links if any reached client
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'converter') router.replace('/coa/converter');
    else if (tab === 'simulator') router.replace('/coa/simulator');
    else if (tab === 'assignments') router.replace('/coa/assignments');
  }, [searchParams, router]);

  // Converter looping preview
  const [exampleIdx, setExampleIdx] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setExampleIdx((prev) => (prev + 1) % CONVERTER_EXAMPLES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [prefersReduced]);

  return (
    <div className="w-full">
      {/* Compact Header: Tag + Heading + ONE short sentence */}
      <div className="space-y-2 mb-6 sm:mb-8">
        <div>
          <span className="mono-tag text-xs text-[#77756f]">
            07 — Computer Organization &amp; Architecture
          </span>
        </div>
        <h1 className="heading-primary text-3xl sm:text-4xl lg:text-5xl text-[#0d0d0d] tracking-tight">
          Learn it, run it,{' '}
          <span className="font-serif italic font-normal text-[#0d0d0d]">ship it.</span>
        </h1>
        <p className="text-sm sm:text-base text-[#52504b] max-w-2xl">
          Three core modules from my computer architecture coursework, built to be explored.
        </p>
      </div>

      {/* 3 Large Equal Cards in a Row (Stacked on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
        {/* Card 01: Number System Converter */}
        <Link
          href="/coa/converter"
          className="group flex flex-col justify-between p-6 sm:p-7 rounded-[28px] bg-white border border-[rgba(13,13,13,0.1)] shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[380px] max-h-[440px]"
        >
          {/* Card Top: Index + Line Icon */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#77756f] font-semibold">01</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#77756f] group-hover:text-[#0d0d0d] transition-colors"
                aria-hidden="true"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="16" y1="14" x2="16" y2="18" />
                <line x1="16" y1="10" x2="16" y2="10" />
                <line x1="12" y1="10" x2="12" y2="10" />
                <line x1="8" y1="10" x2="8" y2="10" />
                <line x1="12" y1="14" x2="12" y2="14" />
                <line x1="8" y1="14" x2="8" y2="14" />
                <line x1="12" y1="18" x2="12" y2="18" />
                <line x1="8" y1="18" x2="8" y2="18" />
              </svg>
            </div>

            {/* Title + One Plain-English Sentence */}
            <div className="space-y-1.5">
              <h2 className="heading-primary text-xl sm:text-2xl text-[#0d0d0d] group-hover:text-black transition-colors">
                Number System Converter
              </h2>
              <p className="text-xs sm:text-sm text-[#77756f] leading-relaxed">
                Convert between binary, octal, decimal and hex, with every step shown.
              </p>
            </div>
          </div>

          {/* Tiny Live Preview: 1011₂ → 11₁₀ cycling */}
          <div className="my-auto py-3">
            <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-[rgba(13,13,13,0.08)] flex items-center justify-center">
              <span className="font-mono text-sm font-semibold text-[#0d0d0d] tracking-tight transition-opacity duration-300">
                {CONVERTER_EXAMPLES[exampleIdx]}
              </span>
            </div>
          </div>

          {/* Card Bottom: Round arrow button bottom-right that fills ink on hover */}
          <div className="flex items-center justify-between pt-2 border-t border-[rgba(13,13,13,0.06)]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#77756f]">
              Open Engine
            </span>
            <div
              className="w-10 h-10 rounded-full border border-[rgba(13,13,13,0.15)] flex items-center justify-center font-mono text-sm text-[#0d0d0d] group-hover:bg-[#0d0d0d] group-hover:text-white group-hover:border-[#0d0d0d] transition-all duration-300"
              aria-hidden="true"
            >
              →
            </div>
          </div>
        </Link>

        {/* Card 02: Instruction Set Simulator */}
        <Link
          href="/coa/simulator"
          className="group flex flex-col justify-between p-6 sm:p-7 rounded-[28px] bg-white border border-[rgba(13,13,13,0.1)] shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[380px] max-h-[440px]"
        >
          {/* Card Top: Index + Line Icon */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#77756f] font-semibold">02</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#77756f] group-hover:text-[#0d0d0d] transition-colors"
                aria-hidden="true"
              >
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            </div>

            {/* Title + One Plain-English Sentence */}
            <div className="space-y-1.5">
              <h2 className="heading-primary text-xl sm:text-2xl text-[#0d0d0d] group-hover:text-black transition-colors">
                Instruction Set Simulator
              </h2>
              <p className="text-xs sm:text-sm text-[#77756f] leading-relaxed">
                My command-line simulator, with the code on GitHub.
              </p>
            </div>
          </div>

          {/* Tiny Live Preview: Mini terminal with blinking cursor */}
          <div className="my-auto py-3">
            <div className="p-3 rounded-2xl bg-[#0d0d0d] border border-[#222] text-[#f4f2ee] font-mono text-xs flex items-center shadow-xs">
              <span className="text-[#a9a6a0] mr-2">$</span>
              <span>./simulator</span>
              <span
                className="inline-block w-1.5 h-3.5 bg-white ml-1.5 animate-pulse"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Card Bottom: Round arrow button */}
          <div className="flex items-center justify-between pt-2 border-t border-[rgba(13,13,13,0.06)]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#77756f]">
              CLI Project
            </span>
            <div
              className="w-10 h-10 rounded-full border border-[rgba(13,13,13,0.15)] flex items-center justify-center font-mono text-sm text-[#0d0d0d] group-hover:bg-[#0d0d0d] group-hover:text-white group-hover:border-[#0d0d0d] transition-all duration-300"
              aria-hidden="true"
            >
              →
            </div>
          </div>
        </Link>

        {/* Card 03: Assignments */}
        <Link
          href="/coa/assignments"
          className="group flex flex-col justify-between p-6 sm:p-7 rounded-[28px] bg-white border border-[rgba(13,13,13,0.1)] shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[380px] max-h-[440px]"
        >
          {/* Card Top: Index + Line Icon */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#77756f] font-semibold">03</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#77756f] group-hover:text-[#0d0d0d] transition-colors"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>

            {/* Title + One Plain-English Sentence */}
            <div className="space-y-1.5">
              <h2 className="heading-primary text-xl sm:text-2xl text-[#0d0d0d] group-hover:text-black transition-colors">
                Assignments
              </h2>
              <p className="text-xs sm:text-sm text-[#77756f] leading-relaxed">
                My COA assignments, ready to read or download.
              </p>
            </div>
          </div>

          {/* Tiny Live Preview: Small stack of page outlines that fan out on hover */}
          <div className="my-auto py-3 flex items-center justify-center">
            <div className="relative h-14 w-28 flex items-center justify-center" aria-hidden="true">
              {/* Left page */}
              <div className="absolute w-11 h-14 bg-white border border-[rgba(13,13,13,0.15)] rounded-md shadow-2xs p-1.5 flex flex-col justify-around transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] -rotate-3 group-hover:-translate-x-3.5 group-hover:-rotate-12">
                <div className="w-full h-1 bg-[rgba(13,13,13,0.1)] rounded-full" />
                <div className="w-3/4 h-1 bg-[rgba(13,13,13,0.08)] rounded-full" />
                <div className="w-1/2 h-1 bg-[rgba(13,13,13,0.06)] rounded-full" />
              </div>
              {/* Middle page */}
              <div className="absolute w-11 h-14 bg-white border border-[rgba(13,13,13,0.2)] rounded-md shadow-xs p-1.5 flex flex-col justify-around transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
                <div className="w-full h-1 bg-[rgba(13,13,13,0.15)] rounded-full" />
                <div className="w-4/5 h-1 bg-[rgba(13,13,13,0.1)] rounded-full" />
                <div className="w-2/3 h-1 bg-[rgba(13,13,13,0.08)] rounded-full" />
              </div>
              {/* Right page */}
              <div className="absolute w-11 h-14 bg-white border border-[rgba(13,13,13,0.15)] rounded-md shadow-2xs p-1.5 flex flex-col justify-around transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] rotate-3 group-hover:translate-x-3.5 group-hover:rotate-12">
                <div className="w-full h-1 bg-[rgba(13,13,13,0.1)] rounded-full" />
                <div className="w-3/4 h-1 bg-[rgba(13,13,13,0.08)] rounded-full" />
                <div className="w-1/2 h-1 bg-[rgba(13,13,13,0.06)] rounded-full" />
              </div>
            </div>
          </div>

          {/* Card Bottom: Round arrow button */}
          <div className="flex items-center justify-between pt-2 border-t border-[rgba(13,13,13,0.06)]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#77756f]">
              Coursework PDF
            </span>
            <div
              className="w-10 h-10 rounded-full border border-[rgba(13,13,13,0.15)] flex items-center justify-center font-mono text-sm text-[#0d0d0d] group-hover:bg-[#0d0d0d] group-hover:text-white group-hover:border-[#0d0d0d] transition-all duration-300"
              aria-hidden="true"
            >
              →
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
