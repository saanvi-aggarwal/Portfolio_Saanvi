'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * CustomCursor Component
 *
 * Minimal, editorial, engineering aesthetic matching the warm off-white (#f4f2ee)
 * background and obsidian ink accents.
 *
 * - Dot: 8px solid white circle, rendered under mix-blend-mode: difference for
 *   automatic high-contrast visibility on both paper (#f4f2ee) and obsidian (#0d0d0d).
 * - Ring: 36px thin-outline ring following with delayed spring/lerp motion.
 * - Morphing States:
 *   - Links, buttons, nav items: Ring grows ~1.5x (54px) with soft translucent fill.
 *   - Project & achievement cards, skill tiles: Morphs into a monospace "View" pill.
 *   - Flippable ID card: Morphs into a monospace "Flip ↻" pill.
 *   - Text & input fields: Morphs into a thin vertical text-caret line.
 *   - On click: Instant scale-down press effect.
 */

type CursorMode = 'default' | 'link' | 'card' | 'flip' | 'caret';

export function CustomCursor() {
  const [isQualified, setIsQualified] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [pillLabel, setPillLabel] = useState('View');
  const [isPressed, setIsPressed] = useState(false);

  const dotWrapperRef = useRef<HTMLDivElement | null>(null);
  const ringWrapperRef = useRef<HTMLDivElement | null>(null);

  const coordsRef = useRef({
    mouseX: -200,
    mouseY: -200,
    ringX: -200,
    ringY: -200,
  });

  const prefersReducedRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // Determine cursor mode from hovered target element
  const evaluateTarget = useCallback((target: HTMLElement | null) => {
    if (!target) {
      setCursorMode('default');
      return;
    }

    // 1. Flippable ID Card
    const flipCard = target.closest<HTMLElement>(
      '[data-cursor="flip"], [aria-label*="flip" i], [aria-label*="Student ID card" i], .perspective-\\[1000px\\]'
    );
    if (flipCard) {
      setCursorMode('flip');
      setPillLabel('Flip ↻');
      return;
    }

    // 2. Interactive elements (Links, buttons, nav items, tabs)
    const interactiveEl = target.closest<HTMLElement>(
      'a, button, [role="tab"], input[type="submit"], input[type="button"], [data-cursor="link"], nav a, nav button, [role="button"]:not([data-achievement-card])'
    );

    // 3. Project cards, specific pill triggers (excluding achievement cards)
    const cardEl = target.closest<HTMLElement>(
      '[data-cursor="pill"], [data-cursor-label]'
    );

    if (cardEl) {
      // If the cursor is specifically over an inner interactive link or button inside the card,
      // give link/button hover precedence
      if (
        interactiveEl &&
        interactiveEl !== cardEl &&
        !interactiveEl.hasAttribute('data-achievement-card') &&
        !interactiveEl.hasAttribute('data-cursor')
      ) {
        setCursorMode('link');
        return;
      }

      const customLabel = cardEl.getAttribute('data-cursor-label') || 'View';
      setCursorMode('card');
      setPillLabel(customLabel);
      return;
    }

    if (interactiveEl) {
      setCursorMode('link');
      return;
    }

    // 4. Text and input fields
    const isInput =
      (target.tagName === 'INPUT' &&
        !['button', 'submit', 'reset', 'checkbox', 'radio', 'range'].includes(
          (target as HTMLInputElement).type
        )) ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable ||
      target.getAttribute('contenteditable') === 'true';

    if (isInput) {
      setCursorMode('caret');
      return;
    }

    // Pure text blocks (paragraphs, headers, code)
    if (
      target.matches('p, h1, h2, h3, h4, h5, h6, blockquote, code, pre') &&
      !target.closest('a, button, [role="button"], [data-achievement-card], [data-cursor="view"]')
    ) {
      setCursorMode('caret');
      return;
    }

    setCursorMode('default');
  }, []);

  useEffect(() => {
    // Only fine pointer devices, not touch devices
    const checkFinePointer = () => {
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      const hoverSupport = window.matchMedia('(hover: hover)').matches;
      return finePointer && hoverSupport;
    };

    if (!checkFinePointer()) {
      setIsQualified(false);
      return;
    }

    setIsQualified(true);
    document.documentElement.classList.add('has-custom-cursor');

    const reducedMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedRef.current = reducedMotionMql.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedRef.current = e.matches;
    };
    reducedMotionMql.addEventListener('change', handleMotionChange);

    let rAFId: number;

    const handlePointerMove = (e: PointerEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (!hasInitializedRef.current) {
        coordsRef.current.ringX = mouseX;
        coordsRef.current.ringY = mouseY;
        hasInitializedRef.current = true;
      }

      coordsRef.current.mouseX = mouseX;
      coordsRef.current.mouseY = mouseY;

      // Update dot immediately without lag
      if (dotWrapperRef.current) {
        dotWrapperRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      setIsVisible(true);
      evaluateTarget(e.target as HTMLElement | null);
    };

    const handlePointerDown = () => {
      setIsPressed(true);
    };

    const handlePointerUp = () => {
      setIsPressed(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsPressed(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleBlur = () => {
      setIsVisible(false);
      setIsPressed(false);
    };

    // Smooth spring/lerp loop for trailing ring
    const render = () => {
      const { mouseX, mouseY } = coordsRef.current;
      const lerp = prefersReducedRef.current ? 1 : 0.18;

      coordsRef.current.ringX += (mouseX - coordsRef.current.ringX) * lerp;
      coordsRef.current.ringY += (mouseY - coordsRef.current.ringY) * lerp;

      if (ringWrapperRef.current) {
        ringWrapperRef.current.style.transform = `translate3d(${coordsRef.current.ringX}px, ${coordsRef.current.ringY}px, 0)`;
      }

      rAFId = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('blur', handleBlur);

    rAFId = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('blur', handleBlur);
      reducedMotionMql.removeEventListener('change', handleMotionChange);
      cancelAnimationFrame(rAFId);
    };
  }, [evaluateTarget]);

  if (!isQualified) return null;

  const isPill = cursorMode === 'card' || cursorMode === 'flip';
  const isCaret = cursorMode === 'caret';
  const isLink = cursorMode === 'link';

  return (
    <div
      id="custom-cursor-container"
      className={`pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none mix-blend-difference transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* 1. Small Solid Dot: ~8px circle, follows mouse instantly */}
      <div
        ref={dotWrapperRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(-200px, -200px, 0)' }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all ease-out ${
            isPressed ? 'scale-75' : ''
          } ${
            isPill || isCaret
              ? 'w-0 h-0 scale-0 opacity-0 duration-150'
              : isLink
              ? 'w-1.5 h-1.5 scale-75 opacity-90 duration-200'
              : 'w-2 h-2 scale-100 opacity-100 duration-200'
          }`}
        />
      </div>

      {/* 2. Thin-Outlined Ring: ~36px circle that follows with smooth lerp motion */}
      <div
        ref={ringWrapperRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(-200px, -200px, 0)' }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isPressed ? 'scale-[0.82] duration-100' : 'duration-300'
          } ${
            isCaret
              ? 'w-[2px] h-[20px] rounded-full bg-white border-0 opacity-90'
              : isPill
              ? 'min-w-[68px] h-[28px] px-3 rounded-full border border-white bg-white/20 backdrop-blur-xs opacity-100 shadow-xs'
              : isLink
              ? 'w-[54px] h-[54px] rounded-full border border-white bg-white/15 opacity-100'
              : 'w-[36px] h-[36px] rounded-full border border-white bg-transparent opacity-80'
          }`}
        >
          {/* Monospace Pill Label (for cards and flippable ID card) */}
          {isPill && (
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150">
              {pillLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Named alias export for backwards compatibility
export { CustomCursor as Cursor };
