import type { Metadata } from 'next';
import { Education } from '@/components/sections/Experience';

export const metadata: Metadata = {
  title: 'Education & Academic Journey',
  description:
    'Chronological education journey: secondary schooling, senior secondary honors, and B.E. Computer Science & Engineering (AI) at Chandigarh University.',
};

export default function EducationPage() {
  return (
    <div className="w-full pt-16 sm:pt-20">
      <Education />
    </div>
  );
}
