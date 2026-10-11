import React from 'react';
import type { Metadata } from 'next';
import { CoaSubNav } from '@/components/coa/CoaSubNav';
import { NumberConverter } from '@/components/coa/NumberConverter';
import { NextModuleCard } from '@/components/coa/NextModuleCard';

export const metadata: Metadata = {
  title: 'Number System Converter | COA | Saanvi Aggarwal',
  description:
    'Convert between binary, octal, decimal and hex, with every step shown: positional notation, repeated division, and power-of-2 groupings.',
};

export default function ConverterPage() {
  return (
    <div className="w-full pt-20 sm:pt-24 pb-20">
      <div className="site-container space-y-10">
        <CoaSubNav current="converter" />
        <NumberConverter />
        <NextModuleCard current="converter" />
      </div>
    </div>
  );
}
