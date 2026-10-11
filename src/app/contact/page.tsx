import type { Metadata } from 'next';
import { Contact } from '@/components/sections/Contact';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Saanvi Aggarwal for software engineering and AI internships. Direct email, telephone, LinkedIn, and GitHub links.',
};

export default function ContactPage() {
  return (
    <div className="w-full pt-16 sm:pt-20">
      <Contact />
    </div>
  );
}
