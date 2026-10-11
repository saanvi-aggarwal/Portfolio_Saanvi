import type { Metadata } from 'next';
import { Achievements } from '@/components/sections/Achievements';
import { Certifications } from '@/components/sections/Certifications';

export const metadata: Metadata = {
  title: 'Achievements & Certifications',
  description:
    'Co-curricular accomplishments, hackathons, 150+ LeetCode problems, and verified Microsoft Azure AZ-900 & AI-900 credentials.',
};

export default function AchievementsPage() {
  return (
    <div className="w-full pt-16 sm:pt-20">
      {/* Part 1: Achievements Horizontal Gallery */}
      <Achievements />

      {/* Part 2: Certifications Ink-Flood Index */}
      <Certifications />
    </div>
  );
}
