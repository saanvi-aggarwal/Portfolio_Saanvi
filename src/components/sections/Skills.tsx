'use client';

import React, { useState, useId } from 'react';
import { SKILLS, SkillItem } from '@/lib/data';
import { TechLogo, isBrand } from '@/components/ui/TechLogo';
import { usePrefersReducedMotion } from '@/lib/hooks';

const FAMILIES = ['All', 'Languages', 'Concepts', 'Databases', 'Cloud', 'Tools', 'Interpersonal'] as const;

export function Skills() {
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [activeSkill, setActiveSkill] = useState<SkillItem>(SKILLS[0]);
  const prefersReduced = usePrefersReducedMotion();
  const filterGroupId = useId();

  // 8 columns on desktop
  const cols = 8;

  return (
    <section id="skills" className="section-spacing border-b border-[rgba(13,13,13,0.08)] bg-[#f4f2ee]">
      <div className="site-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="rv mb-3">
              <span className="mono-tag">02 — Periodic table of my stack</span>
            </div>
            <h2 className="heading-primary text-3xl sm:text-5xl lg:text-6xl rv stagger-1">
              Technical competencies &amp; <span className="heading-accent">concepts.</span>
            </h2>
          </div>

          {/* Family Filter Chips */}
          <div
            className="flex flex-wrap items-center gap-1.5 rv stagger-2"
            role="group"
            aria-label="Filter skills by family"
          >
            {FAMILIES.map((family) => {
              const isActive = selectedFamily === family;
              return (
                <button
                  key={family}
                  onClick={() => setSelectedFamily(family)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] ${
                    isActive
                      ? 'bg-[#0d0d0d] text-[#f4f2ee] shadow-sm'
                      : 'bg-white/80 text-[#3a3a3a] border border-[rgba(13,13,13,0.08)] hover:bg-white hover:text-[#0d0d0d]'
                  }`}
                  aria-pressed={isActive}
                >
                  {family}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid + Sticky Inspector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Periodic Table Grid (8 columns desktop, 4 columns mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {SKILLS.map((skill, index) => {
              const row = Math.floor(index / cols);
              const col = index % cols;
              const delayMs = (row + col) * 40;
              const matchesFilter = selectedFamily === 'All' || skill.family === selectedFamily;
              const isSelected = activeSkill.atomicNumber === skill.atomicNumber;

              return (
                <div
                  key={skill.atomicNumber}
                  tabIndex={0}
                  role="button"
                  aria-label={`${skill.name} (${skill.symbol}) - ${skill.family}`}
                  onMouseEnter={() => setActiveSkill(skill)}
                  onFocus={() => setActiveSkill(skill)}
                  onClick={() => setActiveSkill(skill)}
                  style={{
                    transitionDelay: prefersReduced ? '0ms' : `${delayMs}ms`,
                  }}
                  className={`group relative aspect-square p-2.5 sm:p-3 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] select-none ${
                    matchesFilter
                      ? isSelected
                        ? 'bg-[#0d0d0d] text-[#f4f2ee] shadow-lg scale-[1.03] z-10'
                        : 'bg-white hover:bg-white text-[#0d0d0d] border border-[rgba(13,13,13,0.1)] hover:border-[rgba(13,13,13,0.3)] hover:shadow-md hover:-translate-y-1'
                      : 'opacity-25 filter grayscale pointer-events-none bg-white/40 border border-transparent'
                  }`}
                >
                  {/* Top: Atomic Number & Family Initials */}
                  <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                    <span className={isSelected ? 'text-[#a9a6a0]' : 'text-[#77756f]'}>
                      {String(skill.atomicNumber).padStart(2, '0')}
                    </span>
                    <span className={isSelected ? 'text-[#f4f2ee]/60' : 'text-[#a9a6a0]'}>
                      {skill.family.slice(0, 3).toUpperCase()}
                    </span>
                  </div>

                  {/* Center: 2-Letter Chemical Symbol */}
                  <div className="my-auto text-center py-1">
                    <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight block transition-transform group-hover:scale-110 duration-200">
                      {skill.symbol}
                    </span>
                  </div>

                  {/* Bottom: Skill Name */}
                  <div className="text-center overflow-hidden">
                    <span className={`block text-[11px] font-medium leading-tight truncate ${isSelected ? 'text-[#f4f2ee]' : 'text-[#3a3a3a]'}`}>
                      {skill.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Inspector Panel (340px) */}
          <aside
            aria-label="Skill Inspector"
            className="lg:sticky lg:top-28 card-clean p-6 sm:p-8 bg-white border border-[rgba(13,13,13,0.1)] shadow-xl rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-[rgba(13,13,13,0.08)] pb-4 mb-6">
              <span className="mono-tag !text-[11px]">
                INSPECTOR · ELEM #{String(activeSkill.atomicNumber).padStart(2, '0')}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-[#f4f2ee] text-[#3a3a3a] border border-[rgba(13,13,13,0.08)]">
                {activeSkill.family}
              </span>
            </div>

            {/* Central Animated Logo / Symbol (150px) */}
            <div className="w-full h-44 rounded-2xl bg-[#f4f2ee] border border-[rgba(13,13,13,0.06)] flex items-center justify-center relative overflow-hidden mb-6 group">
              {/* Soft background glow if brand logo */}
              {activeSkill.isBrand && (
                <div
                  className="absolute inset-0 opacity-20 filter blur-xl rounded-full scale-75"
                  style={{
                    backgroundColor:
                      activeSkill.logoKey === 'azure'
                        ? '#0078d4'
                        : activeSkill.logoKey === 'python'
                        ? '#ffd43b'
                        : '#0d0d0d',
                  }}
                />
              )}

              {/* Logo Presentation */}
              <div
                key={activeSkill.atomicNumber}
                className="relative z-10 transition-transform duration-500 animate-[popIn_0.4s_cubic-bezier(0.16,1,0.3,1)]"
              >
                {activeSkill.logoKey ? (
                  <TechLogo
                    name={activeSkill.name}
                    logoKey={activeSkill.logoKey}
                    size={110}
                    className="drop-shadow-sm"
                  />
                ) : (
                  <div className="text-center">
                    <span className="font-mono text-5xl font-bold tracking-tight text-[#0d0d0d]">
                      {activeSkill.symbol}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Skill Details */}
            <div className="space-y-4">
              <div>
                <span className="font-mono text-xs text-[#77756f] block mb-1">
                  Chemical Name
                </span>
                <h3 className="font-sans font-bold text-2xl text-[#0d0d0d] tracking-tight">
                  {activeSkill.name}
                </h3>
              </div>

              <div>
                <span className="font-mono text-xs text-[#77756f] block mb-1">
                  Applications &amp; Scope
                </span>
                <p className="text-sm text-[#3a3a3a] leading-relaxed">
                  {activeSkill.description}
                </p>
              </div>

              {/* Associated Projects from Résumé */}
              {activeSkill.projects.length > 0 && (
                <div className="pt-4 border-t border-[rgba(13,13,13,0.08)]">
                  <span className="font-mono text-xs text-[#77756f] block mb-2">
                    Used In Résumé Projects
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSkill.projects.map((proj, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#f4f2ee] text-[#0d0d0d] border border-[rgba(13,13,13,0.1)]"
                      >
                        {proj}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        @keyframes popIn {
          0% {
            transform: scale(0.85);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
