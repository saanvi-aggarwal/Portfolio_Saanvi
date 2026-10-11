'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom Cursor Component
 *
 * DESIGN INTENT:
 * Clearly visible but calm, built from ink and paper, hairlines, pill shapes
 * and the signature easing curve cubic-bezier(.16, 1, .3, 1).
 *
 * High-contrast dual-tone design:
 * - On light paper: Obsidian ink (#0d0d0d) with a crisp micro-hairline rim.
 * - On dark elements: Automatically flips to crisp paper white (#ffffff) with subtle dark halo.
 * - Dot: 8px solid circle, follows pointer instantly (no lag).
 * - Ring: 36px circle with 1.5px border, follows with smooth lerp ~0.2.
 * - States:
 *   - Default: dot 8px, ring 36px at ~45% opacity.
 *   - Over links, buttons, nav pills, cards: dot shrinks to 4px, ring grows to 56px with faint soft fill.
 *     Magnetic pull 20% toward pill center on pill-shaped elements without displacing element.
 *   - Over external links and "↗" actions: small ↗ arrow SVG inside the ring, dot scales to 0.
 * - Native cursor is hidden ONLY on qualified devices ((hover: hover) & (pointer: fine)).
 * - Text inputs & textareas always retain their native I-beam.
 */

function isDarkElement(el: HTMLElement | null): boolean {
  if (!el) return false;

  const darkAncestor = el.closest<HTMLElement>(
    '.bg-\\[\\#0d0d0d\\], .bg-black, .bg-\\[\\#111\\], .bg-\\[\\#141414\\], .bg-\\[\\#1f1f1f\\], .bg-\\[\\#222\\], .bg-\\[\\#222222\\], .bg-\\[\\#242424\\], .btn-pill-primary, [data-theme="dark"]'
  );
  if (darkAncestor) return true;

  try {
    let current: HTMLElement | null = el;
    while (current && current !== document.documentElement) {
      const bg = window.getComputedStyle(current).backgroundColor;
      if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
        const match = bg.match(/\d+/g);
        if (match && match.length >= 3) {
          const r = parseInt(match[0], 10);
          const g = parseInt(match[1], 10);
          const b = parseInt(match[2], 10);
          const a = match[3] !== undefined ? parseFloat(match[3]) : 1;
          if (a > 0.35) {
            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return luminance < 130;
          }
        }
      }
      current = current.parentElement;
    }
  } catch {
    // fallback
  }

  return false;
}

function getInteractiveState(target: HTMLElement | null): {
  interactive: HTMLElement | null;
  pill: HTMLElement | null;
  isExternal: boolean;
} {
  if (!target) return { interactive: null, pill: null, isExternal: false };

  const interactive = target.closest<HTMLElement>(
    'a, button, [role="button"], [data-cursor], .card-clean, input[type="submit"], input[type="button"]'
  );

  if (!interactive) return { interactive: null, pill: null, isExternal: false };

  // Detect pill shape: check class names or computed border radius
  let pill: HTMLElement | null = null;
  if (
    interactive.classList.contains('rounded-full') ||
    interactive.classList.contains('btn-pill-primary') ||
    interactive.classList.contains('btn-pill-secondary') ||
    interactive.className.includes('rounded-full')
  ) {
    pill = interactive;
  } else {
    const ancestorPill = interactive.closest<HTMLElement>(
      '.rounded-full, .btn-pill-primary, .btn-pill-secondary'
    );
    if (ancestorPill) {
      pill = ancestorPill;
    } else {
      try {
        const style = window.getComputedStyle(interactive);
        const radius = parseFloat(style.borderTopLeftRadius);
        const minDim = Math.min(interactive.offsetWidth, interactive.offsetHeight);
        if (minDim > 0 && radius >= minDim / 2 - 6) {
          pill = interactive;
        }
      } catch {
        // ignore
      }
    }
  }

  // Detect external link or ↗ action
  let isExternal = false;
  const anchor = interactive.closest('a') as HTMLAnchorElement | null;
  if (anchor) {
    if (anchor.target === '_blank') {
      isExternal = true;
    } else if (anchor.rel && anchor.rel.includes('external')) {
      isExternal = true;
    } else if (
      anchor.href &&
      (anchor.href.startsWith('http://') || anchor.href.startsWith('https://'))
    ) {
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin) {
          isExternal = true;
        }
      } catch {
        // ignore
      }
    }
  }

  const cursorAttrEl = target.closest('[data-cursor]');
  if (cursorAttrEl) {
    const val = cursorAttrEl.getAttribute('data-cursor');
    if (val === 'external' || val === 'arrow') {
      isExternal = true;
    }
  }

  if (!isExternal && interactive.textContent && interactive.textContent.includes('↗')) {
    isExternal = true;
  }

  return { interactive, pill, isExternal };
}

export function Cursor() {
  const [isQualified, setIsQualified] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExternal, setIsExternal] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const dotWrapperRef = useRef<HTMLDivElement | null>(null);
  const ringWrapperRef = useRef<HTMLDivElement | null>(null);

  const coordsRef = useRef({
    mouseX: -100,
    mouseY: -100,
    ringX: -100,
    ringY: -100,
  });

  const activePillRef = useRef<HTMLElement | null>(null);
  const hasInitializedPos = useRef(false);

  useEffect(() => {
    // Check device qualification:
    // Only fine pointer devices with hover capability, not coarse-only touch,
    // and respecting prefers-reduced-motion
    const checkQualification = () => {
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      const hoverSupport = window.matchMedia('(hover: hover)').matches;
      const coarseOnly = window.matchMedia('(pointer: coarse)').matches && !finePointer;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      return finePointer && hoverSupport && !coarseOnly && !reducedMotion;
    };

    if (!checkQualification()) {
      setIsQualified(false);
      return;
    }

    setIsQualified(true);
    document.documentElement.classList.add('has-custom-cursor');

    let rAFId: number;

    const handlePointerMove = (e: PointerEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (!hasInitializedPos.current) {
        coordsRef.current.ringX = mouseX;
        coordsRef.current.ringY = mouseY;
        hasInitializedPos.current = true;
      }

      coordsRef.current.mouseX = mouseX;
      coordsRef.current.mouseY = mouseY;

      // Update dot position instantly without lag
      if (dotWrapperRef.current) {
        dotWrapperRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if target is over dark or light background
      setIsDark(isDarkElement(target));

      // Check if target is a text input, textarea or contenteditable
      const isInput =
        (target.tagName === 'INPUT' &&
          !['button', 'submit', 'reset', 'checkbox', 'radio', 'range'].includes(
            (target as HTMLInputElement).type
          )) ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.getAttribute('contenteditable') === 'true';

      setIsTextInput(isInput);

      if (isInput) {
        setIsHovered(false);
        setIsExternal(false);
        activePillRef.current = null;
        return;
      }

      const { interactive, pill, isExternal: ext } = getInteractiveState(target);
      activePillRef.current = pill;
      setIsHovered(!!interactive);
      setIsExternal(ext);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      activePillRef.current = null;
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleBlur = () => {
      setIsVisible(false);
      activePillRef.current = null;
    };

    const render = () => {
      const { mouseX, mouseY } = coordsRef.current;
      let targetX = mouseX;
      let targetY = mouseY;

      const pill = activePillRef.current;
      if (pill && pill.isConnected) {
        const rect = pill.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          // Magnetic pull: gently pull ring 20% toward element center without displacing element
          targetX = mouseX + (centerX - mouseX) * 0.2;
          targetY = mouseY + (centerY - mouseY) * 0.2;
        }
      }

      // Ring smoothing: lerp ~0.2
      coordsRef.current.ringX += (targetX - coordsRef.current.ringX) * 0.2;
      coordsRef.current.ringY += (targetY - coordsRef.current.ringY) * 0.2;

      if (ringWrapperRef.current) {
        ringWrapperRef.current.style.transform = `translate3d(${coordsRef.current.ringX}px, ${coordsRef.current.ringY}px, 0)`;
      }

      rAFId = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('blur', handleBlur);
    rAFId = requestAnimationFrame(render);

    // Watch media query changes (e.g., tablet mode or reduced motion toggle)
    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => {
      if (!checkQualification()) {
        setIsQualified(false);
        document.documentElement.classList.remove('has-custom-cursor');
      }
    };
    motionMql.addEventListener('change', handleMotionChange);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('blur', handleBlur);
      motionMql.removeEventListener('change', handleMotionChange);
      cancelAnimationFrame(rAFId);
    };
  }, []);

  if (!isQualified) return null;

  return (
    <div
      id="site-cursor-root"
      className={`pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-200 ${
        isVisible && !isTextInput ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Dot: 8px solid circle, follows pointer instantly (no lag) */}
      <div
        ref={dotWrapperRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div
          className={`cursor-dot -ml-1 -mt-1 w-2 h-2 rounded-full ${
            isDark ? 'cursor-dot-dark' : 'cursor-dot-light'
          } ${
            isExternal
              ? 'scale-0 opacity-0'
              : isHovered
              ? 'scale-50 opacity-100'
              : 'scale-100 opacity-100'
          }`}
        />
      </div>

      {/* Ring: 36px circle with 1.5px border, follows with lerp ~0.2 */}
      <div
        ref={ringWrapperRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div
          className={`cursor-ring relative -ml-[18px] -mt-[18px] w-[36px] h-[36px] rounded-full flex items-center justify-center ${
            isDark ? 'cursor-ring-dark' : 'cursor-ring-light'
          } ${
            isHovered
              ? 'scale-[1.5556] opacity-100'
              : isDark
              ? 'scale-100 opacity-60'
              : 'scale-100 opacity-45'
          }`}
        >
          {/* Soft fill layer */}
          <div
            className={`cursor-ring-fill absolute inset-0 rounded-full ${
              isDark ? 'cursor-ring-fill-dark' : 'cursor-ring-fill-light'
            } ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* ↗ arrow icon for external links and ↗ actions (SVG, not text) */}
          <div
            className={`cursor-arrow relative z-10 flex items-center justify-center ${
              isDark ? 'cursor-arrow-dark' : 'cursor-arrow-light'
            } ${isExternal ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
