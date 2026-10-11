import React from 'react';
import type { Metadata } from 'next';
import { CoaSubNav } from '@/components/coa/CoaSubNav';
import { InstructionSimulator } from '@/components/coa/InstructionSimulator';
import { NextModuleCard } from '@/components/coa/NextModuleCard';

export const metadata: Metadata = {
  title: 'Instruction Set Simulator | COA | Saanvi Aggarwal',
  description:
    'C++17 command-line simulator converting infix to postfix and generating 3, 2, 1, and 0-address CPU instructions.',
};

export default function SimulatorPage() {
  return (
    <div className="w-full pt-20 sm:pt-24 pb-20">
      <div className="site-container space-y-10">
        <CoaSubNav current="simulator" />
        <InstructionSimulator />
        <NextModuleCard current="simulator" />
      </div>
    </div>
  );
}
