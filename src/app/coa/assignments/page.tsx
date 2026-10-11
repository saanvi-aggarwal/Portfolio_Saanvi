import React from 'react';
import type { Metadata } from 'next';
import { CoaSubNav } from '@/components/coa/CoaSubNav';
import { AssignmentsList } from '@/components/coa/AssignmentsList';
import { NextModuleCard } from '@/components/coa/NextModuleCard';

export const metadata: Metadata = {
  title: 'Assignments | COA | Saanvi Aggarwal',
  description:
    'Coursework assignments covering single-board computers, cloud infrastructure, processor microarchitecture, and hardware acceleration.',
};

export default function AssignmentsPage() {
  return (
    <div className="w-full pt-20 sm:pt-24 pb-20">
      <div className="site-container space-y-10">
        <CoaSubNav current="assignments" />
        <AssignmentsList />
        <NextModuleCard current="assignments" />
      </div>
    </div>
  );
}
