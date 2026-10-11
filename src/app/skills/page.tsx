import type { Metadata } from 'next';
import { Skills } from '@/components/sections/Skills';

export const metadata: Metadata = {
  title: 'Skills & Stack',
  description:
    'The periodic table of technical competencies: C, C++, Python, SQL, Machine Learning, NLP, Data Structures, Microsoft Azure, and Git.',
};

export default function SkillsPage() {
  return (
    <div className="w-full pt-16 sm:pt-20">
      <Skills />
    </div>
  );
}
