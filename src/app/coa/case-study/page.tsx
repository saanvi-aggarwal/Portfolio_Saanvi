import React from 'react';
import type { Metadata } from 'next';
import { CoaSubNav } from '@/components/coa/CoaSubNav';
import { CaseStudyView } from '@/components/coa/CaseStudyView';
import { NextModuleCard } from '@/components/coa/NextModuleCard';

export const metadata: Metadata = {
  title: 'Case Study: CPU Instruction Cycle Trace | COA | Saanvi Aggarwal',
  description:
    'Interactive case study tracing registers, ALU, control unit, and program counter during the instruction cycle of ADD R3, R1, R2 (A = B + C).',
};

export default function CaseStudyPage() {
  return (
    <div className="w-full pt-20 sm:pt-24 pb-20">
      <div className="site-container space-y-10">
        <CoaSubNav current="case-study" />
        <CaseStudyView />
        <NextModuleCard current="case-study" />
      </div>
    </div>
  );
}

