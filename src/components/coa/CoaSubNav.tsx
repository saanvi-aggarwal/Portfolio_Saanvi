'use client';

import React from 'react';
import Link from 'next/link';

export type CoaModuleId = 'converter' | 'simulator' | 'assignments';

interface CoaSubNavProps {
  current: CoaModuleId;
}

const MODULES: { id: CoaModuleId; label: string; href: string }[] = [
  { id: 'converter', label: 'Converter', href: '/coa/converter' },
  { id: 'simulator', label: 'Simulator', href: '/coa/simulator' },
  { id: 'assignments', label: 'Assignments', href: '/coa/assignments' },
];

export function CoaSubNav({ current }: CoaSubNavProps) {
  const currentModule = MODULES.find((m) => m.id === current) || MODULES[0];

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[rgba(13,13,13,0.08)]">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#77756f]">
        <Link
          href="/coa"
          className="hover:text-[#0d0d0d] transition-colors underline-offset-4 hover:underline"
        >
          COA
        </Link>
        <span className="text-[#a9a6a0]" aria-hidden="true">
          /
        </span>
        <span className="text-[#0d0d0d] font-medium">{currentModule.label}</span>
      </nav>

      {/* 3-Pill Switcher */}
      <div
        role="navigation"
        aria-label="COA Sections"
        className="inline-flex self-start sm:self-auto items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-sm border border-[rgba(13,13,13,0.08)] shadow-2xs"
      >
        {MODULES.map((mod) => {
          const isActive = mod.id === current;
          return (
            <Link
              key={mod.id}
              href={mod.href}
              aria-current={isActive ? 'page' : undefined}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0d0d0d] ${
                isActive
                  ? 'bg-[#0d0d0d] text-[#f4f2ee] shadow-xs'
                  : 'text-[#52504b] hover:text-[#0d0d0d] hover:bg-[#faf9f5]'
              }`}
            >
              {mod.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
