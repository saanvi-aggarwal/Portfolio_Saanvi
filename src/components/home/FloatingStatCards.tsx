'use client';

import React, { useEffect, useState } from 'react';
import { PROFILE, PROJECTS } from '@/lib/data';
import { useLiveClock, usePrefersReducedMotion } from '@/lib/hooks';

interface FloatingStatCardsProps {
  mousePos: { x: number; y: number };
}

export function FloatingStatCards({ mousePos }: FloatingStatCardsProps) {
  const clock = useLiveClock(PROFILE.timeZone);
  const prefersReduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [cgpaVal, setCgpaVal] = useState('0.00');
  const [problemsVal, setProblemsVal] = useState('0+');
  const [projectsVal, setProjectsVal] = useState('00');

  useEffect(() => {
    // Choreographed entrance: cards float in promptly after name
    const timer = setTimeout(() => {
      setMounted(true);
    }, 350);

    // Count-up animation on load (easeOutQuart, 1.4s)
    if (prefersReduced) {
      setCgpaVal(PROFILE.cgpa);
      setProblemsVal('150+');
      setProjectsVal(`0${PROJECTS.length}`);
      return () => clearTimeout(timer);
    }

    const duration = 1400;
    const startTime = performance.now();
    const targetCgpa = parseFloat(PROFILE.cgpa) || 9.37;
    const targetProblems = 150;
    const targetProjects = PROJECTS.length;

    let animId: number;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const updateCounts = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutQuart(progress);

      const currentCgpa = (targetCgpa * eased).toFixed(2);
      const currentProblems = Math.floor(targetProblems * eased);
      const currentProjects = Math.floor(targetProjects * eased);

      setCgpaVal(currentCgpa);
      setProblemsVal(`${currentProblems}+`);
      setProjectsVal(`0${currentProjects}`);

      if (progress < 1) {
        animId = requestAnimationFrame(updateCounts);
      } else {
        setCgpaVal(targetCgpa.toFixed(2));
        setProblemsVal(`${targetProblems}+`);
        setProjectsVal(`0${targetProjects}`);
      }
    };

    animId = requestAnimationFrame(updateCounts);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
    };
  }, [prefersReduced]);

  const cardsData = [
    {
      id: 'cgpa',
      kicker: '01 · ACADEMIC',
      value: cgpaVal,
      detail: 'B.E. CSE (AI) · Chandigarh University',
      desktopPosition: 'top-0 left-0 xl:left-4',
      depth: -0.045,
      animClass: 'animate-float-1',
      delay: '400ms',
    },
    {
      id: 'problems',
      kicker: '02 · LEETCODE',
      value: problemsVal,
      detail: 'Data Structures & Algorithms in C++',
      desktopPosition: 'top-0 right-0 xl:right-4',
      depth: 0.05,
      animClass: 'animate-float-2',
      delay: '500ms',
    },
    {
      id: 'projects',
      kicker: '03 · SYSTEMS',
      value: projectsVal,
      detail: 'ML Classifier, Library OS & CPU Simulator',
      desktopPosition: 'bottom-0 left-0 xl:left-4',
      depth: -0.055,
      animClass: 'animate-float-3',
      delay: '600ms',
    },
    {
      id: 'clock',
      kicker: '04 · CHANDIGARH',
      value: clock || '09:00:00 AM',
      detail: 'India Standard Time · UTC+5:30',
      desktopPosition: 'bottom-0 right-0 xl:right-4',
      depth: 0.04,
      animClass: 'animate-float-4',
      delay: '700ms',
      isMonoValue: true,
    },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP VIEW: Independent floating stat cards with parallax at depths   */}
      {/* ========================================================================= */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-20">
        {cardsData.map((card) => {
          const parallaxX = prefersReduced ? 0 : mousePos.x * card.depth * 45;
          const parallaxY = prefersReduced ? 0 : mousePos.y * card.depth * 45;

          return (
            <div
              key={card.id}
              className={`absolute ${card.desktopPosition} pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
              style={{
                opacity: mounted || prefersReduced ? 1 : 0,
                transform: mounted || prefersReduced
                  ? `translate3d(${parallaxX.toFixed(2)}px, ${parallaxY.toFixed(2)}px, 0)`
                  : 'translate3d(0, 20px, 0)',
                transitionDelay: prefersReduced ? '0ms' : card.delay,
              }}
            >
              <div
                className={`${!prefersReduced ? card.animClass : ''} group`}
              >
                <div
                  data-cursor="view"
                  className="w-[195px] xl:w-[215px] p-4 bg-white/95 backdrop-blur-sm rounded-[20px] border border-[rgba(13,13,13,0.08)] shadow-[0_8px_24px_-4px_rgba(13,13,13,0.04),0_1px_3px_rgba(13,13,13,0.02)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-6px_rgba(13,13,13,0.09)] hover:border-[rgba(13,13,13,0.18)] cursor-pointer text-left"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756f]">
                      {card.kicker}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgba(13,13,13,0.2)] group-hover:bg-[#0d0d0d] transition-colors" />
                  </div>

                  <div
                    className={`${card.isMonoValue ? 'font-mono text-base font-semibold tracking-tight' : 'font-sans font-bold text-2xl xl:text-3xl tracking-tight'} text-[#0d0d0d] leading-none my-1`}
                  >
                    {card.value}
                  </div>

                  {/* One-line detail revealed smoothly on hover */}
                  <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-12 opacity-0 group-hover:opacity-100">
                    <p className="pt-2 text-[10.5px] font-mono text-[#77756f] leading-snug border-t border-[rgba(13,13,13,0.06)]">
                      {card.detail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TABLET / MOBILE VIEW: Neat 2x2 grid below the hero name and quote         */}
      {/* ========================================================================= */}
      <div
        className="block lg:hidden w-full max-w-[420px] mx-auto mt-5 px-3 z-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: mounted || prefersReduced ? 1 : 0,
          transform: mounted || prefersReduced ? 'translateY(0)' : 'translateY(16px)',
          transitionDelay: prefersReduced ? '0ms' : '450ms',
        }}
      >
        <div className="grid grid-cols-2 gap-2.5">
          {cardsData.map((card) => (
            <div
              key={card.id}
              className="p-3.5 bg-white/95 rounded-[18px] border border-[rgba(13,13,13,0.08)] shadow-[0_4px_16px_-2px_rgba(13,13,13,0.04)] text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#77756f]">
                  {card.kicker}
                </span>
                <span className="w-1 h-1 rounded-full bg-[rgba(13,13,13,0.25)]" />
              </div>
              <div
                className={`${card.isMonoValue ? 'font-mono text-xs font-semibold' : 'font-sans font-bold text-lg'} text-[#0d0d0d] leading-none mb-1`}
              >
                {card.value}
              </div>
              <div className="text-[9.5px] font-mono text-[#77756f] leading-tight truncate">
                {card.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
