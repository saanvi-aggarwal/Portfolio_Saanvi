'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { usePrefersReducedMotion, useRevealObserver } from '@/lib/hooks';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReduced = usePrefersReducedMotion();
  const [key, setKey] = useState(pathname);

  useRevealObserver();

  useEffect(() => {
    // Reset window scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setKey(pathname);
  }, [pathname]);

  if (prefersReduced) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div
      key={key}
      className="w-full animate-[pageEnter_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards]"
    >
      {children}

      <style jsx global>{`
        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
