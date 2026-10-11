import type { Metadata } from 'next';
import { About } from '@/components/sections/About';
import { PROFILE } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About',
  description: PROFILE.resumeSummary,
};

export default function AboutPage() {
  return (
    <div className="w-full pt-16 sm:pt-20">
      <About />
    </div>
  );
}
