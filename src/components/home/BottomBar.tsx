'use client';

import React, { useEffect, useState } from 'react';
import { PROFILE } from '@/lib/data';
import { usePrefersReducedMotion } from '@/lib/hooks';

export function BottomBar() {
  const prefersReduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Choreographed entrance: bottom bar slides up at 650ms
    const timer = setTimeout(() => setMounted(true), 650);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer
      className="w-full relative z-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none"
      style={{
        opacity: mounted || prefersReduced ? 1 : 0,
        transform: mounted || prefersReduced ? 'translateY(0)' : 'translateY(16px)',
        transitionDelay: prefersReduced ? '0ms' : '650ms',
      }}
    >
      <div className="site-container flex items-center justify-end py-2">
        {/* Social Hairline Buttons (Fill Ink on Hover) */}
        <div className="flex items-center gap-2.5">
          {PROFILE.github && (
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[rgba(13,13,13,0.15)] bg-white/80 hover:bg-[#0d0d0d] text-[#0d0d0d] hover:text-[#f4f2ee] flex items-center justify-center transition-all duration-300 shadow-sm focus-visible:outline-2 focus-visible:outline-[#0d0d0d] focus-visible:outline-offset-3"
              aria-label="GitHub Profile"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          )}

          {PROFILE.linkedin && (
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[rgba(13,13,13,0.15)] bg-white/80 hover:bg-[#0d0d0d] text-[#0d0d0d] hover:text-[#f4f2ee] flex items-center justify-center transition-all duration-300 shadow-sm focus-visible:outline-2 focus-visible:outline-[#0d0d0d] focus-visible:outline-offset-3"
              aria-label="LinkedIn Profile"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          )}

          {PROFILE.email && (
            <a
              href={`mailto:${PROFILE.email}`}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[rgba(13,13,13,0.15)] bg-white/80 hover:bg-[#0d0d0d] text-[#0d0d0d] hover:text-[#f4f2ee] flex items-center justify-center transition-all duration-300 shadow-sm focus-visible:outline-2 focus-visible:outline-[#0d0d0d] focus-visible:outline-offset-3"
              aria-label="Send Email"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-none stroke-current"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
