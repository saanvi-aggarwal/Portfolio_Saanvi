import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CoaHubClient } from '@/components/coa/CoaHubClient';

export const metadata: Metadata = {
  title: 'Computer Organization & Architecture | Saanvi Aggarwal',
  description:
    'Interactive educational platform for Computer Organization & Architecture: Number System Converter, Instruction Set Simulator (C++17), and coursework assignments.',
};

export default async function CoaPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;

  // Redirect legacy ?tab= queries to dedicated sub-routes
  if (params.tab === 'converter') {
    redirect('/coa/converter');
  }
  if (params.tab === 'simulator') {
    redirect('/coa/simulator');
  }
  if (params.tab === 'assignments') {
    redirect('/coa/assignments');
  }

  return (
    <div className="w-full pt-20 sm:pt-24 pb-12 sm:pb-16 min-h-[calc(100vh-80px)] flex flex-col justify-start">
      <div className="site-container">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="font-mono text-xs text-[#77756f] animate-pulse">
                Loading COA Hub...
              </div>
            </div>
          }
        >
          <CoaHubClient />
        </Suspense>
      </div>
    </div>
  );
}
