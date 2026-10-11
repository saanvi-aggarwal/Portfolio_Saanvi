'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ImageLightboxProps {
  images: string[];
  captions?: string[];
  imageType?: 'certificate' | 'photo';
  imageTypes?: ('certificate' | 'photo')[];
  currentIndex: number;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (newIndex: number) => void;
  prefersReduced: boolean;
}

export function ImageLightbox({
  images,
  captions,
  imageType = 'photo',
  imageTypes,
  currentIndex,
  title,
  isOpen,
  onClose,
  onIndexChange,
  prefersReduced,
}: ImageLightboxProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const total = images.length;
  const currentSrc = images[currentIndex] || images[0];
  const currentCaption = captions?.[currentIndex];

  const isCertificate = (idx: number) => {
    if (imageTypes && imageTypes[idx]) {
      return imageTypes[idx] === 'certificate';
    }
    if (imageType === 'certificate') return true;
    const cap = captions?.[idx]?.toLowerCase() || '';
    const src = images[idx]?.toLowerCase() || '';
    return cap.includes('certificate') || src.includes('cert');
  };

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    onIndexChange((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onIndexChange]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    onIndexChange((currentIndex + 1) % total);
  }, [currentIndex, total, onIndexChange]);

  // Keyboard navigation & Focus trapping
  useEffect(() => {
    if (!isOpen) return;

    // Body scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button initially
    const timeout = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    // Horizontal swipe threshold 45px, ignore vertical scrolling
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded preview of ${title}`}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-md select-none ${
        prefersReduced ? '' : 'transition-opacity duration-300'
      }`}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#141414] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/15 ${
          prefersReduced
            ? ''
            : 'animate-in fade-in zoom-in-95 duration-200'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#1c1c1e]">
          <div className="pr-4 min-w-0">
            <h3 className="font-sans font-bold text-sm sm:text-base text-white truncate">
              {title}
            </h3>
            {currentCaption && (
              <p className="font-mono text-xs text-[#a1a1aa] mt-0.5 truncate">
                {currentCaption}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {total > 1 && (
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/90">
                {currentIndex + 1} / {total}
              </span>
            )}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close image preview"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center font-mono text-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Center Image Display (Max 90vh/90vw) */}
        <div className="relative w-full flex-1 min-h-[300px] max-h-[74vh] flex items-center justify-center p-3 sm:p-6 bg-[#0a0a0a] overflow-hidden">
          <div
            className={`relative w-full h-[65vh] max-h-[65vh] max-w-[90vw] flex items-center justify-center rounded-xl overflow-hidden ${
              isCertificate(currentIndex) ? 'bg-[#f4f2ee] p-4 sm:p-6' : ''
            }`}
          >
            <Image
              src={currentSrc}
              alt={currentCaption || `${title} photo ${currentIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1200px) 90vw, 1100px"
              className="object-contain"
            />
          </div>

          {/* Prev / Next navigation arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white text-white hover:text-black shadow-lg backdrop-blur-xs flex items-center justify-center font-mono text-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                ←
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white text-white hover:text-black shadow-lg backdrop-blur-xs flex items-center justify-center font-mono text-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Modal Bottom Thumbnail Indicator Bar */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-2 px-6 py-3 border-t border-white/10 bg-[#1c1c1e]">
            {images.map((thumbSrc, idx) => (
              <button
                key={thumbSrc}
                type="button"
                onClick={() => onIndexChange(idx)}
                aria-label={`Jump to image ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  idx === currentIndex
                    ? 'w-7 bg-white'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
