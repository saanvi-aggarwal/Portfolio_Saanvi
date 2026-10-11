import type { Metadata } from 'next';
import { Work } from '@/components/sections/Work';

export const metadata: Metadata = {
  title: 'Work & Projects',
  description:
    'Featured software engineering projects: AI Email Classifier (Machine Learning & NLP) and Library Management System (C & Data Structures).',
};

export default function WorkPage() {
  return (
    <div className="w-full pt-16 sm:pt-20">
      <Work />
    </div>
  );
}
