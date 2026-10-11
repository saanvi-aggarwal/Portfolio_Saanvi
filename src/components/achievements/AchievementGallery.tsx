'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AchievementGalleryProps {
  images?: string[];
  imageCaptions?: string[];
  imageType?: 'certificate' | 'photo';
  imageTypes?: ('certificate' | 'photo')[];
  title: string;
  isActive: boolean;
  prefersReduced: boolean;
  onOpenLightbox: (index: number) => void;
}

export function AchievementGallery({
  images,
  imageCaptions,
  imageType = 'photo',
  imageTypes,
  title,
  isActive,
  prefersReduced,
  onOpenLightbox,
}: AchievementGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const hasMultiple = images.length > 1;
  const safeIndex = selectedIndex < images.length ? selectedIndex : 0;

  // Determine if a specific image index is a certificate
  const isCertificate = (idx: number) => {
    if (imageTypes && imageTypes[idx]) {
      return imageTypes[idx] === 'certificate';
    }
    if (imageType === 'certificate') return true;
    const cap = imageCaptions?.[idx]?.toLowerCase() || '';
    const src = images[idx]?.toLowerCase() || '';
    return cap.includes('certificate') || src.includes('cert');
  };

  return (
    <div
      className={`w-full transition-all duration-500 ease-out ${
        isActive || prefersReduced
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-85 scale-[0.98] translate-y-0.5'
      }`}
    >
      {/* 1. Large Hero Image Preview (aspect-[4/3], rounded-2xl) */}
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onOpenLightbox(safeIndex);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onOpenLightbox(safeIndex);
          }
        }}
        aria-label={`View enlarged photo: ${imageCaptions?.[safeIndex] || title}`}
        className="group/hero relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[rgba(13,13,13,0.12)] bg-[#f5f3ef] shadow-2xs hover:shadow-md cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d]"
      >
        {/* Render stacked images for smooth crossfade transition */}
        {images.map((src, idx) => {
          const isSelected = idx === safeIndex;
          const cert = isCertificate(idx);

          return (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-400 ease-in-out ${
                isSelected ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              } ${cert ? 'p-3 flex items-center justify-center bg-[#eae8e3]' : 'bg-[#18181b]'}`}
            >
              <div
                className={`relative w-full h-full overflow-hidden transition-transform ease-out ${
                  prefersReduced
                    ? ''
                    : 'duration-700 group-hover/hero:scale-[1.08]'
                }`}
              >
                <Image
                  src={src}
                  alt={imageCaptions?.[idx] || `${title} photo ${idx + 1}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 480px"
                  className={cert ? 'object-contain' : 'object-cover'}
                />
              </div>
            </div>
          );
        })}

        {/* Subtle dark gradient overlay at bottom on hover */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover/hero:opacity-100 group-focus-visible/hero:opacity-100 transition-opacity duration-300"
        />

        {/* Floating caption snippet + "View ⤢" button on hover */}
        <div className="absolute inset-x-0 bottom-0 z-30 p-3.5 flex items-end justify-between gap-3 pointer-events-none">
          <div className="text-white opacity-0 group-hover/hero:opacity-100 group-focus-visible/hero:opacity-100 transition-all duration-300 transform translate-y-1 group-hover/hero:translate-y-0">
            {imageCaptions?.[safeIndex] && (
              <span className="font-sans font-medium text-xs leading-tight line-clamp-1 drop-shadow-sm">
                {imageCaptions[safeIndex]}
              </span>
            )}
            <span className="font-mono text-[10px] text-white/70 block mt-0.5">
              {safeIndex + 1} of {images.length}
            </span>
          </div>

          <div
            aria-hidden="true"
            className="px-2.5 py-1 rounded-full bg-white/95 text-[#0d0d0d] font-mono text-[11px] font-semibold shadow-md backdrop-blur-xs flex items-center gap-1.5 opacity-0 group-hover/hero:opacity-100 group-focus-visible/hero:opacity-100 transition-all duration-300 transform translate-y-1 group-hover/hero:translate-y-0 shrink-0 ml-auto"
          >
            <span>View</span>
            <span className="text-xs">⤢</span>
          </div>
        </div>
      </div>

      {/* 2. Thumbnail Row Below Hero (Rendered only if images.length > 1) */}
      {hasMultiple && (
        <div
          role="tablist"
          aria-label={`Thumbnail options for ${title}`}
          className="flex items-center gap-2.5 mt-2.5 pt-0.5"
        >
          {images.map((thumbSrc, thumbIdx) => {
            const isSelected = thumbIdx === safeIndex;
            const cert = isCertificate(thumbIdx);

            return (
              <button
                key={thumbSrc}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Switch to image ${thumbIdx + 1}: ${
                  imageCaptions?.[thumbIdx] || title
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(thumbIdx);
                }}
                onMouseEnter={() => setSelectedIndex(thumbIdx)}
                className={`relative aspect-[4/3] w-14 sm:w-16 rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] ${
                  isSelected
                    ? 'border-[#0d0d0d] ring-2 ring-[#0d0d0d]/30 scale-102 shadow-xs'
                    : 'border-[rgba(13,13,13,0.14)] opacity-60 hover:opacity-100 hover:border-[#0d0d0d]/60'
                } ${cert ? 'bg-[#eae8e3] p-1' : 'bg-[#18181b]'}`}
                style={{
                  transitionDelay:
                    !prefersReduced && isActive ? `${thumbIdx * 60}ms` : '0ms',
                }}
              >
                <Image
                  src={thumbSrc}
                  alt={imageCaptions?.[thumbIdx] || `Thumbnail ${thumbIdx + 1}`}
                  fill
                  loading="lazy"
                  sizes="64px"
                  className={cert ? 'object-contain' : 'object-cover'}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
