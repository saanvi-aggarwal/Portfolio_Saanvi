'use client';

import React from 'react';
import Link from 'next/link';
import { CoaModuleId } from './CoaSubNav';

interface NextModuleCardProps {
  current: CoaModuleId;
}

const NEXT_CONFIG: Record<
  CoaModuleId,
  { nextTitle: string; nextDesc: string; href: string }
> = {
  converter: {
    nextTitle: 'Next: Simulator →',
    nextDesc: 'My command-line simulator, with the code on GitHub.',
    href: '/coa/simulator',
  },
  simulator: {
    nextTitle: 'Next: Assignments →',
    nextDesc: 'My COA assignments, ready to read or download.',
    href: '/coa/assignments',
  },
  assignments: {
    nextTitle: 'Next: Converter →',
    nextDesc: 'Convert between binary, octal, decimal and hex, with every step shown.',
    href: '/coa/converter',
  },
};

export function NextModuleCard({ current }: NextModuleCardProps) {
  const config = NEXT_CONFIG[current];

  return (
    <div className="w-full pt-10">
      <Link
        href={config.href}
        className="group block p-6 sm:p-8 rounded-[28px] bg-white border border-[rgba(13,13,13,0.1)] shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
      >
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="mono-tag text-[11px] text-[#77756f]">Next in COA</span>
            <h3 className="heading-primary text-xl sm:text-2xl text-[#0d0d0d] group-hover:text-black transition-colors">
              {config.nextTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#77756f] max-w-xl">
              {config.nextDesc}
            </p>
          </div>

          <div
            className="shrink-0 w-11 h-11 rounded-full border border-[rgba(13,13,13,0.15)] flex items-center justify-center font-mono text-sm text-[#0d0d0d] group-hover:bg-[#0d0d0d] group-hover:text-white group-hover:border-[#0d0d0d] transition-all duration-300"
            aria-hidden="true"
          >
            →
          </div>
        </div>
      </Link>
    </div>
  );
}
